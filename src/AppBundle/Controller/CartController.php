<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Repository\CategoryRepository;
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
        /** @var SessionInterface $session */
        $session = $request->getSession();
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

            $shopCartData = $session->get('shop_cart');
            if (!$shopCartData) {
                $shopCartData = [];
            }

            if (isset($shopCartData[$contentTypeName])
                && in_array($itemId, array_column($shopCartData[$contentTypeName], 'id'))) {
                    $index = array_search($itemId, array_column($shopCartData[$contentTypeName], 'id'));
                    $shopCartData[$contentTypeName][$index]['count'] += $count;
                    $shopCartData[$contentTypeName][$index]['price'] += $priceValue;
            } else {
                $shopCartData[$contentTypeName][] = [
                    'id' => $productDocument['_id'],
                    'title' => $productDocument['title'],
                    'count' => $count,
                    'price' => $priceValue
                ];
            }

            $session->set('shop_cart', $shopCartData);
            $this->updateCartCookie($shopCartData);
        }

        return new RedirectResponse($referer);
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
        /** @var SessionInterface $session */
        $session = $request->getSession();
        $referer = $request->headers->get('referer');

        $shopCartData = $session->get('shop_cart');
        if (!empty($shopCartData)
            && isset($shopCartData[$contentTypeName])
            && isset($shopCartData[$contentTypeName][$index])) {

            array_splice($shopCartData[$contentTypeName], $index, 1);
            if (empty($shopCartData[$contentTypeName])) {
                unset($shopCartData[$contentTypeName]);
            }
            $session->set('shop_cart', $shopCartData);
            $this->updateCartCookie($shopCartData);
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
        /** @var SessionInterface $session */
        $session = $request->getSession();
        $categoriesRepository = $this->getCategoriesRepository();
        $referer = $request->headers->get('referer');

        $session->remove('shop_cart');

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
