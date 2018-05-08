<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Repository\CategoryRepository;
use AppBundle\Service\ShopCartService;
use Doctrine\ODM\MongoDB\Cursor;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * @Route("/shop_cart")
 */
class CartController extends ProductController
{

    /**
     * @Route("/add", name="shop_cart_add")
     * @param Request $request
     * @return Response
     */
    public function addAction(Request $request)
    {
        $mongoCache = $this->container->get('mongodb_cache');
        $categoriesRepository = $this->getCategoriesRepository();
        $referer = $request->headers->get('referer');

        $itemId = intval($request->get('item_id'));
        $count = intval($request->get('count'));
        $categoryId = intval($request->get('category_id'));

        /** @var Category $category */
        $category = $categoriesRepository->findOneBy([
            'id' => $categoryId,
            'isActive' => true
        ]);
        if (!$category) {
            return new RedirectResponse($referer);
        }

        $contentType = $category->getContentType();
        $contentTypeName = $contentType->getName();
        $collectionName = $contentType->getCollection();
        $collection = $this->getCollection($collectionName);
        $systemNameField = $contentType->getSystemNameField();

        $productDocument = $collection->findOne([
            '_id' => $itemId,
            'isActive' => true
        ]);
        if ($productDocument) {

            $priceFieldName = '';
            $contentTypeFields = $contentType->getFields();
            foreach ($contentTypeFields as $contentTypeField) {
                if (isset($contentTypeField['outputProperties'])
                    && isset($contentTypeField['outputProperties']['chunkName'])
                    && $contentTypeField['outputProperties']['chunkName'] === 'price') {
                        $priceFieldName = $contentTypeField['name'];
                }
            }
            $priceValue = $priceFieldName && isset($productDocument[$priceFieldName])
                ? $productDocument[$priceFieldName]
                : 0;

            $shopCartData = $mongoCache->fetch(ShopCartService::getCartId());
            if (!$shopCartData) {
                $shopCartData = [];
            }

            $parentUri = $category->getUri();
            $systemName = '';
            if ($systemNameField && isset($productDocument[$systemNameField])) {
                $systemName = $productDocument[$systemNameField];
            }

            $parameters = $this->getProductParameters($request, $productDocument, $contentTypeFields);

            $productIndex = isset($shopCartData[$contentTypeName])
                && in_array($itemId, array_column($shopCartData[$contentTypeName], 'id'))
                ? array_search($itemId, array_column($shopCartData[$contentTypeName], 'id'))
                : -1;

            $currentProduct = null;
            if ($productIndex > -1) {
                $currentProduct = &$shopCartData[$contentTypeName][$productIndex];
            }

            if (!empty($currentProduct) && $currentProduct['parameters'] == $parameters) {
                $currentProduct['count'] += $count;
            } else {
                $shopCartData[$contentTypeName][] = [
                    'id' => $productDocument['_id'],
                    'title' => $productDocument['title'],
                    'parentUri' => $parentUri,
                    'systemName' => $systemName,
                    'image' => '',
                    'count' => $count,
                    'price' => $priceValue,
                    'parameters' => $parameters
                ];
            }

            $mongoCache->save(ShopCartService::getCartId(), $shopCartData, 60*60*24*7);
        }

        return new RedirectResponse($referer);
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
            if (strpos($key, 'param__') !== false) {
                $paramArr = explode('__', $key);
                $paramName = isset($paramArr[1]) ? $paramArr[1] : '';
                $index = array_search($paramName, array_column($contentTypeFields, 'name'));
                if ($index === false
                    || !isset($productDocument[$paramName])
                    || !is_array($productDocument[$paramName])) {
                    continue;
                }
                $contentTypeField = $contentTypeFields[$index];
                if ($contentTypeField['inputType'] != 'parameters') {
                    continue;
                }
                $paramIndex = array_search($value, array_column($productDocument[$paramName], 'value'));
                $outputType = isset($contentTypeField['outputProperties']) && isset($contentTypeField['outputProperties']['type'])
                    ? $contentTypeField['outputProperties']['type']
                    : 'radio';
                switch ($outputType) {
                    case 'checkbox':
                    case 'select':
                    case 'radio':
                        if ($paramIndex !== false) {
                            $parameters[] = $productDocument[$paramName][$paramIndex];
                        }
                        break;
                }
            }
        }
        return $parameters;
    }

    /**
     * @Route("/edit", name="shop_cart_edit")
     * @param Request $request
     * @return Response
     */
    public function editAction(Request $request)
    {



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

        $shopCartData = $mongoCache->fetch(ShopCartService::getCartId());
        if (!empty($shopCartData)
            && isset($shopCartData[$contentTypeName])
            && isset($shopCartData[$contentTypeName][$index])) {

            array_splice($shopCartData[$contentTypeName], $index, 1);
            if (empty($shopCartData[$contentTypeName])) {
                unset($shopCartData[$contentTypeName]);
            }
            if (!empty($shopCartData)) {
                $mongoCache->save(ShopCartService::getCartId(), $shopCartData, 60*60*24*7);
            } else {
                $mongoCache->delete(ShopCartService::getCartId());
            }
        }

        return new RedirectResponse($referer);
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

        foreach ($shopCartData as $cName => $products) {
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
}
