<?php

namespace App\Controller;


use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\ShoppingCart;
use App\MainBundle\Document\User;
use App\Service\CatalogService;
use App\Service\ShopCartService;
use Doctrine\ODM\MongoDB\Cursor;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class CartController extends BaseController
{
    /** @var CatalogService */
    private $catalogService;
    /** @var ShopCartService */
    protected $shopCartService;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        TranslatorInterface $translator,
        CatalogService $catalogService,
        ShopCartService $shopCartService
    )
    {
        parent::__construct($params, $dm, $translator);
        $this->catalogService = $catalogService;
        $this->shopCartService = $shopCartService;
    }

    /**
     * @Route(
     *     "/{_locale}/shop_cart/action",
     *     name="shop_cart_action_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/shop_cart/action", name="shop_cart_action", methods={"GET", "POST"})
     * @param Request $request
     * @return Response
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function actionResponseAction(Request $request)
    {
        $output = ['success' => true];
        $referer = $request->headers->get('referer');
        $back_url = $request->get('back_url', $referer);
        $action = $request->get('action');
        $type = $request->get('type', ShoppingCart::TYPE_MAIN);
        $templateName = $request->get('templateName');
        if (!$action && $request->get('item_id')) {
            $action = 'add_to_cart';
        }
        if (!is_null($request->get('remove_by_index'))) {
            $action = 'remove';
        }

        switch ($action) {
            case 'add_to_cart':

                $output = $this->addToCartAction($request);

                break;
            case 'add_from_array':

                $output = $this->addToCartFromArrayAction($request);
                
                break;
            case 'remove_by_id':

                $output = $this->removeById($request);

                break;
            case 'remove':

                $output = $this->removeByIndex($request);

                break;
            case 'update':

                $output = $this->recalculateAction($request);

                break;
            case 'clean':

                $this->shopCartService->clearContent($type);

                break;
        }

        if ($request->isXmlHttpRequest()) {
            if ($output['success']) {
                $shoppingCart = $this->shopCartService->getShoppingCartByType($type);
                if ($shoppingCart) {
                    $output = array_merge($output, $shoppingCart->toArray());
                } else {
                    $output = array_merge($output, [
                        'type' => $type,
                        'price_total' => 0,
                        'items_total' => 0,
                        'items_unique_total' => 0,
                        'delivery_price' => 0,
                        'delivery_name' => '',
                        'ids' => []
                    ]);
                }
                if ($templateName) {
                    $output['html'] = $this->shopCartService->renderShopCart($shoppingCart, $templateName, $type);
                }
            }
            if (!empty($output['message'])) {
                $output['message'] = $this->translator->trans($output['message'], ['%name%' => $output['name'] ?? '']);
            }
            return $this->json($output);
        } else {
            if (!$output['success'] && isset($output['message'])) {
                $this->addFlash('errors', $this->translator->trans($output['message'], ['%name%' => $output['name'] ?? '']));
            }
            return new RedirectResponse($back_url ?: '/');
        }
    }

    /**
     * Add product to shopping cart
     * @param Request $request
     * @return array
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function addToCartAction(Request $request)
    {
        $locale = $request->getLocale();
        $localeDefault = $this->params->get('locale');
        $type = $request->get('type', ShoppingCart::TYPE_MAIN);

        $count = max(1, (int) $request->get('count'));
        /** @var ShoppingCart $shoppingCart */
        $shoppingCart = $this->shopCartService->getShoppingCart($type, $this->getUserId(), $this->getSessionId($type), null, true);

        /** @var Category $category */
        list($category, $productDocument) = $this->getCategoryAndProduct($request);
        if (!$category || !$productDocument) {
            return ['success' => false, 'message' => 'Item not found.'];
        }

        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $contentTypeFields = $contentType->getFields();

        $options = [];
        $files = [];
        $parameters = $this->getProductParameters($request, $productDocument, $contentTypeFields);
        $missedParameters = $this->checkParametersRequired($contentTypeFields, $parameters);

        if (!empty($missedParameters)) {
            return ['success' => false, 'message' => 'Field "%name%" is required.', 'name' => $missedParameters[0]['title']];
        }

        // Files required?
        if ($type === ShoppingCart::TYPE_MAIN) {
            $files = $this->getProductFiles($request, $shoppingCart, $productDocument, $contentTypeFields);
            if (!count($files)) {
                $fileRequiredFields = array_filter($contentTypeFields, function($field) {
                    return $field['outputType'] == 'file'
                        && !empty($field['outputProperties']['required']);
                });
                if (count($fileRequiredFields) > 0) {
                    $c = 0;
                    foreach ($fileRequiredFields as $index => $field) {
                        if (!empty($productDocument[$field['name']])) {
                            $c++;
                        }
                    }
                    if ($c > 0) {
                        return ['success' => false, 'message' => 'File is required.'];
                    }
                }
            }
        }

        try {
            $this->addCartContent($shoppingCart, $category, $productDocument, $count, $locale, $localeDefault, $parameters, $options, $files);
        } catch (MongoDBException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }

        return ['success' => true];
    }

    /**
     * Add products to shopping cart by ID array
     * @param Request $request
     * @return array
     */
    public function addToCartFromArrayAction(Request $request)
    {
        $locale = $request->getLocale();
        $localeDefault = $this->params->get('locale');
        $type = $request->get('type', ShoppingCart::TYPE_MAIN);
        $itemIdString = $request->get('item_id');
        $countString = $request->get('count');
        $categoryId = (int) $request->get('category_id');
        
        $shoppingCart = $this->shopCartService->getShoppingCart($type, $this->getUserId(), $this->getSessionId($type), null, true);

        /** @var Category $category */
        $category = $this->dm->getRepository(Category::class)->find($categoryId);
        if (!$category) {
            return ['success' => false, 'message' => 'Category not found.'];
        }

        $itemIdArr = explode(',', $itemIdString);
        $itemCountArr = explode(',', $countString);
        
        foreach ($itemIdArr as $index => $itemId) {
            $productDocument = $this->getProduct($category, $itemId);
            if (!$productDocument) {
                continue;
            }
            $count = !empty($itemCountArr[$index]) && is_numeric($itemCountArr[$index]) ? (int) $itemCountArr[$index] : 1;
            try {
                $this->addCartContent($shoppingCart, $category, $productDocument, $count, $locale, $localeDefault);
            } catch (MongoDBException $e) {
            
            }
        }
        return ['success' => true];
    }

    /**
     * @param ShoppingCart $shoppingCart
     * @param Category $category
     * @param object $productDocument
     * @param int $count
     * @param string $locale
     * @param string $localeDefault
     * @param array $parameters
     * @param array $options
     * @param array $files
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function addCartContent(
        ShoppingCart $shoppingCart,
        Category $category,
        $productDocument,
        $count = 1,
        $locale = '',
        $localeDefault = '',
        $parameters = [],
        $options = [],
        $files = []
    )
    {
        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $priceFieldName = $contentType->getPriceFieldName();
        $titleFieldName = $contentType->getFieldByChunkName('header', 'title');
        $imageFieldName = $contentType->getFieldByChunkName('image', 'image');
        $systemNameField = $contentType->getSystemNameField();
        
        $cartContent = $shoppingCart->getContent();
        $contentIndex = $this->getContentIndex($cartContent, [
            'id' => $productDocument['_id'],
            'price' => $productDocument[$priceFieldName] ?? 0,
            'parameters' => $parameters,
            'options' => $options,
            'contentTypeName' => $category->getContentTypeName()
        ]);
        /** @var OrderContent $currentProduct */
        $currentProduct = $contentIndex > -1 ? $cartContent->get($contentIndex) : null;
        
        $imageUrl = $this->shopCartService->getImageUrl($productDocument, $parameters, $imageFieldName);

        if ($currentProduct) {
            $currentProduct->incrementCount($count);
        } else {

            $content = new OrderContent();
            $content
                ->setId($productDocument['_id'])
                ->setTitle(ShopCartService::getTranslatedField($productDocument, $titleFieldName, $locale, $localeDefault))
                ->setPrice($productDocument[$priceFieldName] ?? '')
                ->setCount($count)
                ->setParameters($parameters)
                ->setFiles($files)
                ->setImage($imageUrl)
                ->setUri($category->getUri() . ($productDocument[$systemNameField] ?? ''))
                ->setContentTypeName($category->getContentTypeName());

            $shoppingCart->addContent($content);
        }

        $this->dm->flush();
    }

    /**
     * Recalculate products count
     * @param Request $request
     * @return array
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function recalculateAction(Request $request)
    {
        $type = $request->get('type', ShoppingCart::TYPE_MAIN);
        $countArr = $request->get('count', []);
        if (!is_array($countArr)) {
            $countArr = [];
        }
        $shoppingCart = $this->shopCartService->getShoppingCart($type, $this->getUserId(), $this->getSessionId($type));
        $shoppingCartContent = $shoppingCart ? $shoppingCart->getContentSorted() : [];

        if (empty($shoppingCartContent)) {
            return ['success' => true];
        }

        /** @var OrderContent $content */
        foreach ($shoppingCartContent as $index => $content) {
            $count = isset($countArr[$index]) && is_numeric($countArr[$index])
                ? (int) $countArr[$index]
                : 1;
            $content->setCount($count);
        }

        $this->dm->flush();

        return ['success' => true];
    }

    /**
     * @param Request|null $request
     * @param int|null $itemId
     * @return array
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function removeById($request = null, $itemId = null)
    {
        if (is_null($itemId) && $request instanceof Request) {
            $itemId = (int) $request->get('item_id', 0);
        }
        $type = $request instanceof Request
            ? $request->get('type', ShoppingCart::TYPE_MAIN)
            : ShoppingCart::TYPE_MAIN;

        if (!$itemId) {
            return ['success' => false];
        }

        $shoppingCart = $this->shopCartService->getShoppingCartByType($type);
        $shoppingCartContent = $shoppingCart ? $shoppingCart->getContentSorted() : [];

        $index = $this->getContentIndex($shoppingCartContent, ['id' => $itemId]);
        if ($index === -1) {
            return ['success' => false];
        }

        if (count($shoppingCartContent) === 1) {
            $this->dm->remove($shoppingCart);
        } else {
            $shoppingCart->removeContent($shoppingCartContent->get($index));
        }
        $this->dm->flush();

        return ['success' => true];
    }

    /**
     * @param Request|null $request
     * @param int|null $index
     * @return array
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function removeByIndex($request = null, $index = null)
    {
        if (is_null($index) && $request instanceof Request) {
            $index = (int) $request->get('remove_by_index');
        }
        $type = $request instanceof Request
            ? $request->get('type', ShoppingCart::TYPE_MAIN)
            : ShoppingCart::TYPE_MAIN;

        $shoppingCart = $this->shopCartService->getShoppingCartByType($type);
        $shoppingCartContent = $shoppingCart ? $shoppingCart->getContentSorted() : [];

        if (is_null($index) || !$shoppingCartContent->containsKey($index)) {
            return ['success' => false];
        }

        if (count($shoppingCartContent) === 1) {
            $this->dm->remove($shoppingCart);
        } else {
            $shoppingCart->removeContent($shoppingCartContent->get($index));
        }
        $this->dm->flush();

        return ['success' => true];
    }

    /**
     * @param Request $request
     * @return array
     */
    public function getCategoryAndProduct(Request $request)
    {
        $itemId = (int) $request->get('item_id');
        $categoryId = (int) $request->get('category_id');

        /** @var Category $category */
        $category = $this->dm->getRepository(Category::class)->find($categoryId);
        if (!$category) {
            return [null, null];
        }

        $productDocument = $this->getProduct($category, $itemId);

        return [$category, $productDocument];
    }

    /**
     * @param Category $category
     * @param int|string $itemId
     * @return array|object|null
     */
    public function getProduct(Category $category, $itemId)
    {
        $contentType = $category->getContentType();
        $collectionName = $contentType->getCollection();
        $collection = $this->catalogService->getCollection($collectionName);
        
        return $collection->findOne([
            '_id' => (int) $itemId,
            'isActive' => true
        ]);
    }

    /**
     * @param $shoppingCartContent
     * @param array $itemData
     * @return int
     */
    public function getContentIndex($shoppingCartContent, $itemData)
    {
        if (empty($shoppingCartContent)) {
            return -1;
        }
        $index = -1;
        /** @var OrderContent $content */
        foreach ($shoppingCartContent as $ind => $content) {
            if (isset($itemData['id']) && $itemData['id'] != $content->getId()) {
                continue;
            }
            if (isset($itemData['price']) && $itemData['price'] != $content->getPrice()) {
                continue;
            }
            if (isset($itemData['parameters']) && $itemData['parameters'] != $content->getParameters()) {
                continue;
            }
            if (isset($itemData['options']) && $itemData['options'] != $content->getOptions()) {
                continue;
            }
            if (isset($itemData['contentTypeName']) && $itemData['contentTypeName'] != $content->getContentTypeName()) {
                continue;
            }
            $index = $ind;
            break;
        }
        return $index;
    }

    /**
     * @param Request $request
     * @param array $productDocument
     * @param array $contentTypeFields
     * @return array
     */
    public function getProductParameters(Request $request, $productDocument, $contentTypeFields)
    {
        $postData = $request->request->all();
        $parameters = [];
        foreach ($postData as $key => $value) {
            if (strpos($key, 'param__') === false) {
                continue;
            }
            $paramName = str_replace('param__', '', $key);
            $fieldBaseName = ContentType::getCleanFieldName($paramName);

            $index = array_search($fieldBaseName, array_column($contentTypeFields, 'name'));
            if ($index === false) {
                continue;
            }
            $contentTypeField = $contentTypeFields[$index];
            
            // Schedule
            if ($contentTypeField['outputType'] === 'schedule') {
                if (!is_array($value)) {
                    $value = [$value];
                }
                $value = array_filter($value, function($val) {
                    return ShopCartService::validateDateTime($val, 'Y-m-d')
                        || ShopCartService::validateDateTime($val, 'Y-m-d\TH:i:sP');
                });
                if (!empty($value)) {
                    $parameters[] = $this->getDatesParameterValue($contentTypeField, $value);
                }
                continue;
            }

            if ($contentTypeField['outputType'] !== 'parameters') {
                continue;
            }
            $outputType = isset($contentTypeField['outputProperties']) && isset($contentTypeField['outputProperties']['type'])
                ? $contentTypeField['outputProperties']['type']
                : 'radio';
            if (!isset($productDocument[$fieldBaseName])) {
                $productDocument[$fieldBaseName] = [];
            }
            switch ($outputType) {
                case 'select':
                case 'radio':
                case 'checkbox':
                    if (empty($value)) {
                        break;
                    }
                    if (!is_array($value)) {
                        $value = [$value];
                    }
                    foreach($value as $val) {
                        $paramIndex = array_search($val, array_column($productDocument[$fieldBaseName], 'value'));
                        if ($paramIndex === false) {
                            $paramIndex = array_search($val, array_column($productDocument[$fieldBaseName], 'name'));
                        }
                        if ($paramIndex !== false) {
                            $parameters[] = $productDocument[$fieldBaseName][$paramIndex];
                        }
                    }
                    break;
                case 'text':
                    if (empty($value) || !is_array($value)) {
                        break;
                    }
                    foreach($value as $index => $val) {
                        if (empty($val)) {
                            continue;
                        }
                        if (is_array($val)) {
                            $val = implode(', ', $val);
                        }
                        if (isset($productDocument[$fieldBaseName][$index])) {
                            $parameters[] = array_merge($productDocument[$fieldBaseName][$index], [
                                'value' => strip_tags($val)
                            ]);
                        }
                    }
                    break;
            }
        }
        return $parameters;
    }

    /**
     * @param array $contentTypeFields
     * @param array $parameters
     * @return array
     */
    public function checkParametersRequired($contentTypeFields, $parameters)
    {
        $fieldsRequired = array_filter($contentTypeFields, function($contentTypeField) {
            return in_array($contentTypeField['outputType'], ['parameters', 'schedule'])
                && !empty($contentTypeField['outputProperties']['required']);
        });
        $fieldsRequired = array_merge($fieldsRequired);
        $fieldsRequired = array_map(function($field) {
            return $field['name'];
        }, $fieldsRequired);

        if (empty($fieldsRequired)) {
            return [];
        }

        $missedParameters = [];
        foreach ($fieldsRequired as $fieldNameRequired) {
            $index = array_search($fieldNameRequired, array_column($contentTypeFields, 'name'));
            if ($index === false) {
                continue;
            }
            $field = $contentTypeFields[$index];
            $ind = array_search($field['title'], array_column($parameters, 'name'));
            if ($ind === false) {
                $missedParameters[] = [
                    'name' => $field['name'],
                    'title' => $field['title']
                ];
            }
        }
        return $missedParameters;
    }
    
    /**
     * @param array $contentTypeField
     * @param array $value
     * @return array
     */
    public function getDatesParameterValue($contentTypeField, $value)
    {
        $outputDateFormat = $contentTypeField['outputProperties']['outputFormat'] ?? 'd/m/Y H:i';
        $value = array_map(function($val) use ($outputDateFormat) {
            if (ShopCartService::validateDateTime($val, 'Y-m-d')) {
                $date = \DateTime::createFromFormat('Y-m-d', $val);
                if (strpos($outputDateFormat, 'H:i') !== false) {
                    $outputDateFormat = str_replace([' H:i:s', ' H:i'], '', $outputDateFormat);
                }
            } else {
                $date = \DateTime::createFromFormat('Y-m-d\TH:i:sP', $val);
            }
            return $date ? $date->format($outputDateFormat) : '';
        }, $value);
        return [
            'name' => $contentTypeField['title'],
            'value' => implode(' - ', $value),
            'price' => 0
        ];
    }

    /**
     * @param Request $request
     * @param ShoppingCart $shoppingCart
     * @param array $productDocument
     * @param array $contentTypeFields
     * @return array
     */
    public function getProductFiles(Request $request, ShoppingCart $shoppingCart, $productDocument, $contentTypeFields)
    {
        /** @var User $user */
        $user = $this->getUser();
        $userId = $user ? $user->getId() : 0;
        $ownerId = $shoppingCart->getId();

        $postData = $request->request->all();
        $files = [];
        $fileFields = array_filter($contentTypeFields, function($field) {
            return $field['outputType'] == 'file';
        });
        $fileFieldsNames = array_map(function($field) {
            return $field['name'];
        }, $fileFields);

        $fileRepository = $this->getFileRepository();

        foreach ($postData as $key => $value) {
            if (!in_array($key, $fileFieldsNames) || empty($postData[$key])) {
                continue;
            }
            $fileId = (int) $postData[$key];
            /** @var FileDocument $fileDocument */
            $fileDocument = $fileRepository->findOneBy([
                'id' => $fileId,
                'ownerType' => FileDocument::OWNER_ORDER_TEMPORARY,
                'userId' => $userId,
                'ownerId' => strval($ownerId)
            ]);
            if (!$fileDocument) {
                continue;
            }
            $files[] = $fileDocument->getRecordData();
        }
        return $files;
    }

    /**
     * @Route(
     *     "/{_locale}/shop_cart/{type}",
     *     name="shop_cart_edit_localized",
     *     methods={"GET", "POST"},
     *     requirements={"_locale": "^[a-z]{2}$", "type"=".+"},
     *     defaults={"type": "shop"}
     * )
     * @Route(
     *     "/shop_cart/{type}",
     *     name="shop_cart_edit",
     *     methods={"GET", "POST"},
     *     requirements={"type"=".+"},
     *     defaults={"type": "shop"}
     * )
     * @param string $type
     * @return Response
     */
    public function editAction($type)
    {
        return $this->render('page_shop_cart.html.twig', [
            'shoppingCartContentType' => $type,
            'currentUri' => 'shop_cart/' . $type
        ]);
    }

    /**
     * @Route("/shop_cart/clear", name="shop_cart_clear")
     * @param Request $request
     * @return Response
     */
    public function clearAction(Request $request)
    {
        $referer = $request->headers->get('referer');
        $type = $request->get('type', ShoppingCart::TYPE_MAIN);
        $this->shopCartService->clearContent($type);

        return new RedirectResponse($referer);
    }

    /**
     * @return int
     */
    public function getUserId()
    {
        if ($user = $this->getUser()) {
            return $user->getId();
        }
        return 0;
    }

    /**
     * @param string $type
     * @return string
     */
    public function getSessionId($type = ShoppingCart::TYPE_MAIN)
    {
        return $this->shopCartService->getSessionId($type);
    }

    /**
     * @param $shopCartData
     */
    public function updateCartCookie($shopCartData)
    {
        $response = new Response();
        $contentArr = [
            'content_type' => [],
            'id' => [],
            'count' => []
        ];

        foreach ($shopCartData['data'] as $cName => $products) {
            foreach ($products as $product) {
                $contentArr['content_type'][] = $cName;
                $contentArr['id'][] = $product['id'];
                $contentArr['count'][] = $product['count'];
            }
        }
        foreach ($contentArr as $key => $data) {
            $response->headers->setCookie(new Cookie(
                'shk_' . $key,
                implode(',', $data),
                time() + (60 * 60 * 24 * 7)
            ));
        }
        $response->sendHeaders();
    }

    /**
     * @return \App\Repository\ShoppingCartRepository|ObjectRepository
     */
    public function getRepository()
    {
        return $this->dm->getRepository(ShoppingCart::class);
    }

    /**
     * @return \App\Repository\FileDocumentRepository|ObjectRepository
     */
    public function getFileRepository()
    {
        return $this->dm->getRepository(FileDocument::class);
    }
}
