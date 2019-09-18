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
        $output = [];
        $referer = $request->headers->get('referer');
        $back_url = $request->get('back_url', $referer);
        $action = $request->get('action');
        $type = $request->get('type', 'shop');
        if ($request->get('item_id')) {
            $action = 'add_to_cart';
        }

        switch ($action) {
            case 'add_to_cart':

                $output = $this->addToCartAction($request);

                break;
            case 'print':



                break;
            case 'remove':



                break;
            case 'update':



                break;
            case 'clean':



                break;
        }

        if ($request->isXmlHttpRequest()) {
            if ($output['success']) {
                /** @var ShopCartService $shopCartService */
                $shopCartService = $this->get('app.shop_cart');
                $shoppingCart = $shopCartService->getShoppingCart($type, $this->getUserId(), $this->getSessionId(), null, true);

                $output = array_merge($output, $shoppingCart->toArray(), [
                    'html' => ''
                ]);
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
        $files = $this->getProductFiles($request, $productDocument, $contentTypeFields);

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
                ->setUri($category->getUri() . '/' . ($productDocument[$systemNameField] ?? ''))
                ->setContentTypeName($category->getContentTypeName())
                ->setCurrency($currency);

            $shoppingCart->addContent($content);
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
     * @param array $productDocument
     * @param array $contentTypeFields
     * @return array
     */
    public function getProductFiles(Request $request, $productDocument, $contentTypeFields)
    {
        /** @var User $user */
        $user = $this->getUser();
        $userId = $user ? $user->getId() : 0;
        $ownerId = ShopCartService::getCartId();

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
     * @param Request $request
     * @return Response
     */
    public function editAction(Request $request)
    {
        $action = $request->get('action');

        switch ($action) {
            case 'update':

                $countArr = $request->get('count');
                $mongoCache = $this->container->get('mongodb_cache');

                $shopCartData = $mongoCache->fetch(ShopCartService::getCartId());
                if (empty($shopCartData)
                    || empty($shopCartData['data'])
                    || empty($countArr)) {
                        return $this->redirectToRoute('shop_cart_edit');
                }

                $index = 0;
                foreach ($shopCartData['data'] as $cName => &$products) {
                    if (!isset($data['items'][$cName])) {
                        $data['items'][$cName] = [];
                    }
                    foreach ($products as $ind => &$product) {
                        if (isset($countArr[$index]) && is_numeric($countArr[$index])) {
                            $product['count'] = max(1, intval($countArr[$index]));
                        }
                        $index++;
                    }
                }

                /** @var ShopCartService $shopCartService */
                $shopCartService = $this->get('app.shop_cart');
                $shopCartService->saveContent($shopCartData);

                return $this->redirectToRoute('shop_cart_edit');

                break;
        }


        return $this->render('page_shop_cart.html.twig', [

        ]);
    }

    /**
     * @Route("/remove/{contentTypeName}/{index}", name="shop_cart_remove")
     * @param Request $request
     * @param string $contentTypeName
     * @param int $index
     * @return Response
     */
    public function removeItemAction(Request $request, $contentTypeName, $index)
    {
        $mongoCache = $this->container->get('mongodb_cache');
        $referer = $request->headers->get('referer');
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');

        $shopCartData = $mongoCache->fetch(ShopCartService::getCartId());
        if (!empty($shopCartData)
            && isset($shopCartData['data'][$contentTypeName])
            && isset($shopCartData['data'][$contentTypeName][$index])) {

            array_splice($shopCartData['data'][$contentTypeName], $index, 1);
            if (empty($shopCartData['data'][$contentTypeName])) {
                unset($shopCartData['data'][$contentTypeName]);
            }
            if (!empty($shopCartData['data'])) {
                $shopCartService->saveContent($shopCartData);
            } else {
                $shopCartService->clearContent();
            }
        }

        return new RedirectResponse($referer);
    }

    /**
     * @return int
     */
    public function getUserId()
    {
        if ($this->isGranted('ROLE_USER')) {
            return $this->getUser()->getId();
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
     * @Route("/clear", name="shop_cart_clear")
     * @param Request $request
     * @return Response
     */
    public function clearAction(Request $request)
    {
        $mongoCache = $this->container->get('mongodb_cache');
        $referer = $request->headers->get('referer');

        $mongoCache->delete(ShopCartService::getCartId());

        return new RedirectResponse($referer);
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
