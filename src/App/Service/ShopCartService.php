<?php

namespace App\Service;

use App\MainBundle\Document\Order;
use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\Setting;
use App\MainBundle\Document\ShoppingCart;
use App\Repository\ShoppingCartRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig\Environment as TwigEnvironment;

class ShopCartService
{
    /** @var ContainerInterface */
    protected $container;
    /** @var DocumentManager */
    protected $dm;
    
    public function __construct(ContainerInterface $container, DocumentManager $dm)
    {
        $this->container = $container;
        $this->dm = $dm;
    }

    /**
     * @param string $type
     * @return ArrayCollection|null
     */
    public function getContent($type = ShoppingCart::TYPE_MAIN)
    {
        $shoppingCart = $this->getShoppingCartByType($type);
        return $shoppingCart ? $shoppingCart->getContentSorted() : null;
    }

    /**
     * Clear shopping cart data
     * @param string $type
     * @param bool $cleanFiles
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function clearContent($type = ShoppingCart::TYPE_MAIN, $cleanFiles = false)
    {
        $result = false;

        $shoppingCart = $this->getShoppingCartByType($type);
        if ($shoppingCart) {
            if ($cleanFiles) {
                $shoppingCartContent = $shoppingCart->getContent();
                /** @var OrderContent $content */
                foreach ($shoppingCartContent as $content) {
                    $content->setFiles([]);
                }
            }
            $this->dm->remove($shoppingCart);
            $this->dm->flush();
            $result = true;
        }

        // Remove expired shopping carts
        $this->removeExpired();

        return $result;
    }

    /**
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function removeExpired()
    {
        /** @var ShoppingCartRepository $repository */
        $repository = $this->dm->getRepository(ShoppingCart::class);
        $date_timezone = date_default_timezone_get();
        $shoppingCartsExpired = $repository->findExpired($date_timezone);
        /** @var ShoppingCart $shoppingCartExpired */
        foreach ($shoppingCartsExpired as $shoppingCartExpired) {
            $this->dm->remove($shoppingCartExpired);
        }
        $this->dm->flush();
        
        return count($shoppingCartsExpired->toArray()) > 0;
    }

    /**
     * @param string $type
     * @return ShoppingCart|null
     */
    public function getShoppingCartByType($type = ShoppingCart::TYPE_MAIN)
    {
        return $this->getShoppingCart($type, $this->getUserId(), $this->getSessionId($type));
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
        $lifeTime = $this->getLifetime($type);

        if ($id) {
            $shoppingCart = $this->getRepository()->find((int) $id);
        } else if ($userId || $sessionId || $id) {
            $shoppingCart = $this->getRepository()->findByUserOrSession($type, $userId, $sessionId);
        } else {
            return null;
        }
        if (!$shoppingCart && $create) {
            $shoppingCart = new ShoppingCart();
            $shoppingCart
                ->setSessionId($sessionId)
                ->setOwnerId($userId)
                ->setCurrency($currency)
                ->setType($type);

            if ($lifeTime) {
                $shoppingCart->setExpiresOn((new \DateTime())->setTimestamp(time() + $lifeTime));
            }

            $this->dm->persist($shoppingCart);
            $this->dm->flush();
        }
        return $shoppingCart;
    }

    /**
     * @param ShoppingCart|null $shoppingCart
     * @param string $templateName
     * @param string $type
     * @return string
     * @throws \Twig\Error\RuntimeError
     */
    public function renderShopCart($shoppingCart, $templateName, $type = ShoppingCart::TYPE_MAIN)
    {
        /** @var TwigEnvironment $twig */
        $twig = $this->container->get('twig');

        $output = $twig->getRuntime(\App\Twig\AppRuntime::class)
            ->shopCartFunction($twig, $templateName, $type, '', $shoppingCart);

        return $output;
    }

    /**
     * @param string $type
     * @return string
     */
    public function getSessionId($type = ShoppingCart::TYPE_MAIN)
    {
        if (!empty($_COOKIE[ShoppingCart::SESSION_KEY])) {
            return $_COOKIE[ShoppingCart::SESSION_KEY];
        }
        $sessionId = UtilsService::generatePassword(26);
        $lifeTime = $this->getLifetime($type);
        setcookie(ShoppingCart::SESSION_KEY, $sessionId, time() + $lifeTime, '/');
        return $sessionId;
    }

    /**
     * Get shopping cart life time
     * @param string $type
     * @return int
     */
    public function getLifetime($type = ShoppingCart::TYPE_MAIN)
    {
        if ($this->container->hasParameter('app.shopping_cart_lifetime_' . $type)) {
            $lifeTime = (int) $this->container->getParameter('app.shopping_cart_lifetime_' . $type);
        } else {
            $lifeTime = $this->container->hasParameter('app.shopping_cart_lifetime')
                ? (int) $this->container->getParameter('app.shopping_cart_lifetime')
                : 172800;// 48 hours
        }
        return $lifeTime;
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
     * @param string $promoCode
     * @param string $type
     * @return array
     */
    public function promoCodeApply($promoCode, $type = ShoppingCart::TYPE_MAIN)
    {
        if (!$promoCode) {
            return ['success' => false, 'message' => 'Promo code not found.'];
        }
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        $promoCodesSettings = $settingsService->getSettingsGroup(Setting::GROUP_PROMOCODES);
        
        $settingPromoCode = array_filter($promoCodesSettings, function($item) use ($promoCode) {
            /** @var Setting $item */
            return $item->getName() === $promoCode;
        });
        if (empty($settingPromoCode)) {
            return ['success' => false, 'message' => 'Promo code not found.'];
        }
    
        /** @var ShoppingCart $shoppingCart */
        $shoppingCart = $this->getShoppingCartByType($type);
    
        /** @var Setting $settingPromoCode */
        $settingPromoCode = current($settingPromoCode);
        $value = (string) $settingPromoCode->getOption('value');
        $quantity = (int) $settingPromoCode->getOption('quantity');
        
        if ($quantity === 0) {
            $shoppingCart
                ->setDiscountPercent(null)
                ->setDiscount(null)
                ->setPromoCode('');
            $this->dm->flush();
            return ['success' => false, 'message' => 'The promo code has expired.'];
        }
    
        $shoppingCart->setPromoCode($promoCode);
        if (strpos($value, '%') !== false) {
            $shoppingCart->setDiscountPercent(intval(str_replace('%', '', $value)));
        } else {
            $shoppingCart->setDiscount(intval($value));
        }
    
        $settingPromoCode->updateOptionsValues([
            'quantity' => [
                'value' => $quantity - 1
            ]
        ]);
        
        $this->dm->flush();
        
        return ['success' => true];
    }

    /**
     * @param $productDocument
     * @param $parameters
     * @param $imageFieldName
     * @return string
     */
    public function getImageUrl($productDocument, $parameters, $imageFieldName)
    {
        if (!$imageFieldName) {
            return '';
        }
        $imageNum = 1;
        if (!empty($parameters) && is_array($parameters)) {
            foreach ($parameters as $parameter) {
                if (!empty($parameter['imageNum']) && is_numeric($parameter['imageNum'])) {
                    $imageNum = (int) $parameter['imageNum'];
                    break;
                }
            }
        }
        if ($imageNum > 1 && !empty($productDocument[$imageFieldName . '__' . ($imageNum - 1)])) {
            $imageData = $productDocument[$imageFieldName . '__' . ($imageNum - 1)];
        } else {
            $imageData = $productDocument[$imageFieldName] ?? [];
        }
        return self::getImageUrlFromArray($imageData);
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
     * @return mixed
     */
    protected function getUser()
    {
        if (!$this->container->has('security.token_storage')) {
            throw new \LogicException('The SecurityBundle is not registered in your application. Try running "composer require symfony/security-bundle".');
        }
        if (null === $token = $this->container->get('security.token_storage')->getToken()) {
            return null;
        }
        if (!\is_object($user = $token->getUser())) {
            // e.g. anonymous authentication
            return null;
        }
        return $user;
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

    /**
     * @param mixed $document
     * @param string $fieldName
     * @param string $locale
     * @param string $localeDefault
     * @return string
     */
    public static function getTranslatedField($document, $fieldName, $locale, $localeDefault)
    {
        $translations = $document['translations'] ?? [];
        if ($locale !== $localeDefault
            && isset($translations[$fieldName])
            && isset($translations[$fieldName][$locale])) {
                return $translations[$fieldName][$locale];
        }
        return $document[$fieldName] ?? '';
    }

    /**
     * Get image URL string from data array
     * @param $itemData
     * @return string
     */
    public static function getImageUrlFromArray($itemData)
    {
        if (!isset($itemData['dirPath']) || !isset($itemData['fileName']) || !isset($itemData['extension'])) {
            return '';
        }
        $format = !empty($itemData['fileId']) ? '/uploads/%s/%s.%s' : '%s/%s.%s';
        return sprintf(
            $format,
            $itemData['dirPath'],
            $itemData['fileName'],
            $itemData['extension']
        );
    }
    
    /**
     * @param $dateStr
     * @param $format
     * @return bool
     */
    public static function validateDateTime($dateStr, $format)
    {
        $date = \DateTime::createFromFormat($format, $dateStr);
        return $date && ($date->format($format) === $dateStr);
    }
    
    /**
     * @param string $dateStr
     * @param $outputDateFormat
     * @param bool $returnArray
     * @return array|\DateTime|false
     */
    public static function createDateObject($dateStr, $outputDateFormat, $returnArray = false)
    {
        $hasTime = true;
        $date = \DateTime::createFromFormat($outputDateFormat, $dateStr);
        if (!$date) {
            $outputDateFormatDays = trim(str_replace(['\TH:i:sP', 'H:i:s', 'H:i'], '', $outputDateFormat));
            $date = \DateTime::createFromFormat($outputDateFormatDays, $dateStr);
            $hasTime = false;
        }
        return $returnArray ? [$date, $hasTime] : $date;
    }
    
    /**
     * @param \DateInterval $interval
     * @return float|int
     */
    public static function getTotalMinutes(\DateInterval $interval){
        return ($interval->d * 24 * 60) + ($interval->h * 60) + $interval->i;
    }
}
