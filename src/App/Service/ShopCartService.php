<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ShopCartService
{
    /** @var ContainerInterface */
    protected $container;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @return array|null
     */
    public function getContent()
    {
        $mongoCache = $this->container->get('mongodb_cache');
        return $mongoCache->fetch(self::getCartId());
    }

    /**
     * Clear shopping cart data
     */
    public function clearContent()
    {
        $mongoCache = $this->container->get('mongodb_cache');
        $mongoCache->delete(self::getCartId());
    }

    /**
     * @param $shopCartData
     */
    public function saveContent($shopCartData)
    {
        $mongoCache = $this->container->get('mongodb_cache');
        $mongoCache->save(self::getCartId(), $shopCartData, 60*60*24*7);
    }

    /**
     * @return string
     */
    public static function getCartId()
    {
        $request = Request::createFromGlobals();
        $response = new Response();
        $cookies = $request->cookies->all();
        if (isset($cookies['cart_id'])) {
            return $cookies['cart_id'];
        }
        $cartId = uniqid('shop_cart_' . mt_rand(), true);
        $response->headers->setCookie(new Cookie(
            'cart_id',
            $cartId,
            time() + (60 * 60 * 24 * 7)
        ));
        $response->sendHeaders();
        return $cartId;
    }

    /**
     * @param array|null $shopCartData
     * @return float
     */
    public function getPriceTotal($shopCartData = null)
    {
        if ($shopCartData === null) {
            $shopCartData = $this->getContent();
        }
        $priceTotal = 0;
        foreach ($shopCartData['data'] as $cName => $products) {
            foreach ($products as $product) {
                $priceTotal += ($product['price'] * $product['count']);
            }
        }
        return $priceTotal;
    }

    /**
     * @return string
     */
    public static function getCurrencyCookie()
    {
        return isset($_COOKIE['shkCurrency'])
            ? $_COOKIE['shkCurrency']
            : '';
    }
}
