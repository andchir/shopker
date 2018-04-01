<?php

namespace AppBundle\Service;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ShopCartService
{

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
}
