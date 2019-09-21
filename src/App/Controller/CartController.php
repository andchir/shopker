<?php

namespace App\Controller;

use App\Events;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\ShoppingCart;
use App\MainBundle\Document\User;
use App\Repository\CategoryRepository;
use App\Service\SettingsService;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\Cursor;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * @Route("/shop_cart")
 */
class CartController extends ProductController
{

    /**
     * @Route("/action", name="shop_cart_action", methods={"GET", "POST"})
     * @param Request $request
     * @return Response
     */
    public function actionResponseAction(Request $request)
    {
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');

        $output = ['success' => true];
        $referer = $request->headers->get('referer');
        $back_url = $request->get('back_url', $referer);
        $action = $request->get('action');
        $type = $request->get('type', 'shop');
        $templateName = $request->get('templateName');
        if ($request->get('item_id')) {
            $action = 'add_to_cart';
        }
        if (!is_null($request->get('remove_by_index'))) {
            $action = 'remove';
        }

        switch ($action) {
            case 'add_to_cart':

                $output = $this->addToCartAction($request);

                break;
            case 'print':



                break;
            case 'remove':

                $output = $this->removeByIndex($request);

                break;
            case 'update':

                $output = $this->recalculateAction($request);

                break;
            case 'clean':

                $shopCartService->clearContent($type);

                break;
        }

        if ($request->isXmlHttpRequest()) {
            if ($output['success']) {
                $shoppingCart = $shopCartService->getShoppingCartByType($type);
                if ($shoppingCart) {
                    $output = array_merge($output, $shoppingCart->toArray());
                }
                $output['html'] = $shopCartService->renderShopCart($shoppingCart, $templateName, $type);
            }
            return $this->json($output);
        } else {
            if (!$output['success'] && isset($output['message'])) {
                $request->getSession()
                    ->getFlashBag()
                    ->add('errors', $output['message']);
            }
            return new RedirectResponse($back_url);
        }
    }

    /**
     * Add product to shopping cart
     * @param Request $request
     * @return array
     */
    public function addToCartAction(Request $request)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $currency = $settingsService->getCurrency();

        $type = $request->get('type', 'shop');
        $count = max(1, (int) $request->get('count'));
        $shoppingCart = $shopCartService->getShoppingCart($type, $this->getUserId(), $this->getSessionId(), null, true);

        /** @var Category $category */
        list($category, $productDocument) = $this->getCategoryAndProduct($request);
        if (!$category || !$productDocument) {
            return ['success' => false, 'message' => 'Item not found.'];
        }

        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $contentTypeFields = $contentType->getFields();
        $priceFieldName = $contentType->getPriceFieldName();
        $titleFieldName = $contentType->getFieldByChunkName('header', 'title');
        $systemNameField = $contentType->getSystemNameField();

        // Product parameters
        $parameters = $this->getProductParameters($request, $productDocument, $contentTypeFields);

        // Product files
        $files = $this->getProductFiles($request, $shoppingCart, $productDocument, $contentTypeFields);

        // Files required?
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

        $cartContent = $shoppingCart->getContent();
        $contentIndex = $this->getContentIndex($cartContent, $productDocument, $priceFieldName);
        /** @var OrderContent $currentProduct */
        $currentProduct = $contentIndex > -1 ? $cartContent->get($contentIndex) : null;

        if (!empty($currentProduct)
            && $currentProduct->getParameters() == $parameters
            && $currentProduct->getFiles() == $files) {
                $currentProduct->incrementCount($count);
        } else {

            $content = new OrderContent();
            $content
                ->setId($productDocument['_id'])
                ->setTitle($productDocument[$titleFieldName] ?? '')
                ->setPrice($productDocument[$priceFieldName] ?? '')
                ->setCount($count)
                ->setParameters($parameters)
                ->setFiles($files)
                ->setUri($category->getUri() . ($productDocument[$systemNameField] ?? ''))
                ->setContentTypeName($category->getContentTypeName())
                ->setCurrency($currency);

            $shoppingCart->addContent($content);
        }

        $dm->flush();

        return ['success' => true];
    }

    /**
     * Recalculate products count
     * @param Request $request
     * @return array
     */
    public function recalculateAction(Request $request)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');

        $type = $request->get('type', 'shop');
        $countArr = $request->get('count', []);
        if (!is_array($countArr)) {
            $countArr = [];
        }
        $shoppingCart = $shopCartService->getShoppingCart($type, $this->getUserId(), $this->getSessionId());
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

        $dm->flush();

        return ['success' => true];
    }

    /**
     * @param Request|null $request
     * @param int|null $index
     * @return array
     */
    public function removeByIndex($request = null, $index = null)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');

        if (is_null($index) && $request instanceof Request) {
            $index = (int) $request->get('remove_by_index');
        }
        $type = $request->get('type', 'shop');

        $shoppingCart = $shopCartService->getShoppingCartByType($type);
        $shoppingCartContent = $shoppingCart ? $shoppingCart->getContentSorted() : [];

        if (is_null($index) || !$shoppingCartContent->containsKey($index)) {
            return ['success' => false];
        }

        if (count($shoppingCartContent) === 1) {
            $dm->remove($shoppingCart);
        } else {
            $shoppingCart->removeContent($shoppingCartContent->get($index));
        }
        $dm->flush();

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
        $categoriesRepository = $this->getCategoriesRepository();

        /** @var Category $category */
        $category = $categoriesRepository->findOneBy([
            'id' => $categoryId
        ]);
        if (!$category) {
            return [null, null];
        }

        $contentType = $category->getContentType();
        $collectionName = $contentType->getCollection();
        $collection = $this->getCollection($collectionName);

        $productDocument = $collection->findOne([
            '_id' => $itemId,
            'isActive' => true
        ]);
        if (!$productDocument) {
            return [null, null];
        }

        return [$category, $productDocument];
    }

    /**
     * @param $shoppingCartContent
     * @param array $productDocument
     * @param string $priceFieldName
     * @return int
     */
    public function getContentIndex($shoppingCartContent, $productDocument, $priceFieldName = 'price')
    {
        if (empty($shoppingCartContent)) {
            return -1;
        }
        $index = -1;
        /** @var OrderContent $content */
        foreach ($shoppingCartContent as $ind => $content) {
            if ($content->getId() == $productDocument['_id']
                && $content->getPrice() == $productDocument[$priceFieldName]) {
                $index = $ind;
                break;
            }
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
            if ($index === false
                || !isset($productDocument[$paramName])
                || !is_array($productDocument[$paramName])) {
                continue;
            }
            $contentTypeField = $contentTypeFields[$index];

            if ($contentTypeField['inputType'] != 'parameters') {
                continue;
            }
            $outputType = isset($contentTypeField['outputProperties']) && isset($contentTypeField['outputProperties']['type'])
                ? $contentTypeField['outputProperties']['type']
                : 'radio';
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
                        $paramIndex = array_search($val, array_column($productDocument[$paramName], 'value'));
                        if ($paramIndex === false) {
                            $paramIndex = array_search($val, array_column($productDocument[$paramName], 'name'));
                        }
                        if ($paramIndex !== false) {
                            $parameters[] = $productDocument[$paramName][$paramIndex];
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
                        if (isset($productDocument[$paramName][$index])) {
                            $parameters[] = array_merge($productDocument[$paramName][$index], [
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
                'ownerId' => $ownerId
            ]);
            if (!$fileDocument) {
                continue;
            }
            $files[] = $fileDocument->getRecordData();
        }
        return $files;
    }

    /**
     * @Route("/edit", name="shop_cart_edit")
     * @return Response
     */
    public function editAction()
    {


        return $this->render('page_shop_cart.html.twig', [

        ]);
    }

    /**
     * @Route("/clear", name="shop_cart_clear")
     * @param Request $request
     * @return Response
     */
    public function clearAction(Request $request)
    {
        $referer = $request->headers->get('referer');
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');
        $type = $request->get('type', 'shop');
        $shopCartService->clearContent($type);

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
     * @return string
     */
    public function getSessionId()
    {
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');
        return $shopCartService->getSessionId();
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
     * @return \App\Repository\ShoppingCartRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ShoppingCart::class);
    }

    /**
     * @return \App\Repository\FileDocumentRepository
     */
    public function getFileRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(FileDocument::class);
    }
}
