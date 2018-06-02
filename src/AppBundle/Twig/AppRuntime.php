<?php

namespace AppBundle\Twig;

use AppBundle\Document\OrderContent;
use AppBundle\Document\Setting;
use AppBundle\Service\SettingsService;
use AppBundle\Service\ShopCartService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Cache\Simple\FilesystemCache;

class AppRuntime
{
    /** @var ContainerInterface */
    protected $container;
    /** @var \Twig_Environment */
    protected $twig;
    /** @var  RequestStack */
    protected $requestStack;

    public function __construct(ContainerInterface $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->twig = $this->container->get('twig');
        $this->requestStack = $requestStack;
    }

    /**
     * @param string $chunkName
     * @param string $emptyChunkName
     * @return string
     */
    public function shopCartFunction($chunkName = 'shop_cart', $emptyChunkName = '')
    {
        if (empty($this->container->getParameter('mongodb_database'))
            || empty($this->container->getParameter('mongodb_user'))) {
                return '';
        }
        $data = [
            'countTotal' => 0,
            'priceTotal' => 0,
            'items' => []
        ];

        $request = $this->requestStack->getCurrentRequest();
        $mongoCache = $this->container->get('mongodb_cache');

        $shopCartData = $mongoCache->fetch(ShopCartService::getCartId());
        if (empty($shopCartData)) {
            if ($emptyChunkName) {
                $templateName = $this->getTemplateName('catalog/', $emptyChunkName);
                return $this->twig->render($templateName, $data);
            } else {
                return '';
            }
        }

        $data['currency'] = $shopCartData['currency'];

        $templateName = $this->getTemplateName('catalog/', $chunkName);

        foreach ($shopCartData['data'] as $cName => $products) {
            if (!isset($data['items'][$cName])) {
                $data['items'][$cName] = [];
            }
            foreach ($products as $product) {
                $product['priceTotal'] = $this->getCartContentPriceTotal($product);
                $product['parametersString'] = $this->getCartContentParametersString($product);
                $data['items'][$cName][] = $product;
                $data['countTotal'] += $product['count'];
                $data['priceTotal'] += $product['price'] * $product['count'];
                if (!empty($product['parameters'])) {
                    foreach ($product['parameters'] as $parameters) {
                        if (!empty($parameters['price'])) {
                            $data['priceTotal'] += $parameters['price'] * $product['count'];
                        }
                    }
                }
            }
        }

        return $this->twig->render($templateName, $data);
    }

    /**
     * @return string
     */
    public function currencyListFunction()
    {
        if (empty($this->container->getParameter('mongodb_database'))
            || empty($this->container->getParameter('mongodb_user'))) {
                return '';
        }
        $cacheKey = 'currency.list';
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');

        if ($cache->has($cacheKey)) {
            return $this->twig->createTemplate($cache->get($cacheKey))->render([]);
        }

        $templateName = 'catalog/currency_list.html.twig';
        $properties = [
            'data' => $settingsService->getSettingsGroup(Setting::GROUP_CURRENCY)
        ];

        $output = $this->twig->render($templateName, $properties);
        $cache->set($cacheKey, $output, 60*60*24);

        return $output;
    }

    /**
     * @param $productData
     * @return float
     */
    public function getCartContentPriceTotal($productData)
    {
        $priceTotal = $productData['price'] * $productData['count'];
        if (!empty($productData['parameters'])) {
            foreach ($productData['parameters'] as $parameters) {
                if (!empty($parameters['price'])) {
                    $priceTotal += $parameters['price'] * $productData['count'];
                }
            }
        }
        return $priceTotal;
    }

    /**
     * @param $productData
     * @return string
     */
    public function getCartContentParametersString($productData)
    {
        $parameters = isset($productData['parameters']) && is_array($productData['parameters'])
            ? $productData['parameters']
            : [];
        return OrderContent::getParametersStrFromArray($parameters);
    }

    /**
     * @param $path
     * @param string $chunkName
     * @param string $chunkNamePrefix
     * @param string $chunkNameSuffix
     * @param string $defaultName
     * @return string
     */
    public function getTemplateName($path, $chunkName, $chunkNamePrefix = '', $chunkNameSuffix = '', $defaultName = 'default')
    {
        $templateName = sprintf($path . '%s%s%s.html.twig', $chunkNamePrefix, $chunkName, $chunkNameSuffix);
        if (!$this->twig->getLoader()->exists($templateName)) {
            $templateName = $path . $defaultName . '.html.twig';
        }
        return $templateName;
    }

    /**
     * @param $number
     * @param int $decimals
     * @param string $decPoint
     * @param string $thousandsSep
     * @return string
     */
    public function priceFilter($number, $decimals = 0, $decPoint = '.', $thousandsSep = ' ')
    {
        $price = number_format($number, $decimals, $decPoint, $thousandsSep);
        return $price;
    }

    /**
     * @param $itemData
     * @return string
     */
    public function imageUrlFunction($itemData)
    {
        return sprintf(
            '/uploads/%s/%s.%s',
            $itemData['dirPath'],
            $itemData['fileName'],
            $itemData['extension']
        );
    }
}

