<?php

namespace App\Service;

use App\MainBundle\Document\Order;
use App\MainBundle\Document\ShoppingCart;
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
     * @param string $type
     * @param null|int $userId
     * @param null|string $sessionId
     * @param null|int $id
     * @param bool $create
     * @return ShoppingCart|null
     */
    public function getShoppingCart($type, $userId = null, $sessionId = null, $id = null, $create = false)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        $currency = $settingsService->getCurrency();
        $lifeTime = $this->container->hasParameter('app.shopping_cart_lifetime')
            ? (int) $this->container->getParameter('app.shopping_cart_lifetime')
            : 172800;// 48 hours

        if ($id) {
            $shoppingCart = $this->getRepository()->find((int) $id);
        } else if ($userId || $sessionId || $id) {
            $shoppingCart = $this->getRepository()->findByUserOrSession($type, $userId, $sessionId);
        } else {
            return null;
        }
        if (!$shoppingCart && $create) {
            /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
            $dm = $this->container->get('doctrine_mongodb')->getManager();

            $shoppingCart = new ShoppingCart();
            $shoppingCart
                ->setSessionId($sessionId)
                ->setOwnerId($userId)
                ->setCurrency($currency)
                ->setType($type);

            if ($lifeTime) {
                $shoppingCart->setExpiresOn((new \DateTime())->setTimestamp(time() + $lifeTime));
            }

            $dm->persist($shoppingCart);
            $dm->flush();
        }
        return $shoppingCart;
    }

    /**
     * @return string
     */
    public function getSessionId()
    {
        if (!empty($_COOKIE[ShoppingCart::SESSION_KEY])) {
            return $_COOKIE[ShoppingCart::SESSION_KEY];
        }
        $sessionId = UtilsService::generatePassword(26);
        $lifeTime = $this->container->hasParameter('app.shopping_cart_lifetime')
            ? (int) $this->container->getParameter('app.shopping_cart_lifetime')
            : 172800;// 48 hours
        setcookie(ShoppingCart::SESSION_KEY, $sessionId, time() + $lifeTime, '/');
        return $sessionId;
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

    /**
     * @param Order $order
     * @return array
     */
    public function createReceipt(Order $order) {
        $receipt = [];
        switch ($order->getPaymentValue()) {
            case 'RoboKassa':
                if ($this->container->getParameter('app.tax_system')) {
                    $receipt['sno'] = $this->container->getParameter('app.tax_system');
                }
                $receipt['items'] = $order->getReceipt(
                    [
                        'priceName' => 'sum'
                    ],
                    [
                        'payment_method' => $this->container->hasParameter('app.payment_method')
                            ? $this->container->getParameter('app.payment_method')
                            : 'full_prepayment',
                        'payment_object' => $this->container->hasParameter('app.payment_object')
                            ? $this->container->getParameter('app.payment_object')
                            : 'commodity',
                        'tax' => $this->container->getParameter('app.nds_rate')
                    ],
                    [
                        'payment_method' => $this->container->hasParameter('app.payment_method')
                            ? $this->container->getParameter('app.payment_method')
                            : 'full_prepayment',
                        'payment_object' => 'service',
                        'tax' => 'none'
                    ]
                );
                break;
            default:// YandexMoney
                $receipt['customerContact'] = $order->getPhone()
                    ? preg_replace("/[^\d]/", '', $order->getPhone())
                    : $order->getEmail();
                $receipt['items'] = $order->getReceipt(
                    [
                        'priceName' => 'price.amount',
                        'titleName' => 'text'
                    ],
                    [
                        'tax' => $this->container->getParameter('app.nds_rate')
                    ],
                    [
                        'tax' => 1
                    ]
                );
                if ($this->container->getParameter('app.tax_system')) {
                    $receipt['taxSystem'] = $this->container->getParameter('app.tax_system');
                }
                break;
        }
        return $receipt;
    }

    /**
     * @return \App\Repository\ShoppingCartRepository
     */
    public function getRepository()
    {
        return $this->container->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ShoppingCart::class);
    }
}
