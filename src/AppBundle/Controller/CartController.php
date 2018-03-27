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
 * Class CartController
 * @package AppBundle\Controller
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

            $shopCartData = $session->get('shop_cart');
            if (!$shopCartData) {
                $shopCartData = [];
            }

            if (isset($shopCartData[$contentTypeName]) && isset($shopCartData[$contentTypeName][$itemId])) {
                $shopCartData[$contentTypeName][$itemId]['count'] += $count;
            } else {
                $shopCartData[$contentTypeName][$itemId] = [
                    'id' => $productDocument['_id'],
                    'title' => $productDocument['title'],
                    'count' => $count,
                    'price' => 0
                ];
            }

            $session->set('shop_cart', $shopCartData);
            $this->updateCartCookie($shopCartData);
        }

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
