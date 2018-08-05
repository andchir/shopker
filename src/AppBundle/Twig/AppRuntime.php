<?php

namespace AppBundle\Twig;

use AppBundle\Controller\CatalogController;
use AppBundle\Document\OrderContent;
use AppBundle\Document\Setting;
use AppBundle\Service\SettingsService;
use AppBundle\Service\ShopCartService;
use AppBundle\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Cache\Simple\FilesystemCache;

class AppRuntime
{
    /** @var ContainerInterface */
    protected $container;
    /** @var  RequestStack */
    protected $requestStack;

    public function __construct(ContainerInterface $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->requestStack = $requestStack;
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $chunkName
     * @param string $emptyChunkName
     * @return string
     */
    public function shopCartFunction(\Twig_Environment $environment, $chunkName = 'shop_cart', $emptyChunkName = '')
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
                $templateName = $this->getTemplateName($environment, 'catalog/', $emptyChunkName);
                return $environment->render($templateName, $data);
            } else {
                return '';
            }
        }

        $data['currency'] = $shopCartData['currency'];

        $templateName = $this->getTemplateName($environment, 'catalog/', $chunkName);

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

        return $environment->render($templateName, $data);
    }

    /**
     * @param \Twig_Environment $environment
     * @return string
     */
    public function currencyListFunction(\Twig_Environment $environment)
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
            return $environment->createTemplate($cache->get($cacheKey))->render([]);
        }

        $templateName = 'catalog/currency_list.html.twig';
        $properties = [
            'data' => $settingsService->getSettingsGroup(Setting::GROUP_CURRENCY)
        ];

        $output = $environment->render($templateName, $properties);
        $cache->set($cacheKey, $output, 60*60*24);

        return $output;
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $chunkName
     * @param $collectionName
     * @param array $criteria
     * @param $orderBy
     * @param int $limit
     * @param int $groupSize
     * @param string $cacheKey
     * @param string $pageVar
     * @param string $limitVar
     * @return string
     */
    public function contentListFunction(
        \Twig_Environment $environment,
        $chunkName = 'content_list',
        $collectionName,
        $criteria,
        $orderBy = ['_id' => 'asc'],
        $limit = 20,
        $groupSize = 1,
        $cacheKey = '',
        $pageVar = 'page',
        $limitVar = 'limit'
    )
    {
        if (!$collectionName) {
            return '';
        }
        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');
        if (!empty($cacheKey) && $cache->has("content.{$cacheKey}")) {
            return $cache->get("content.{$cacheKey}");
        }

        $templateName = sprintf('catalog/%s.html.twig', $chunkName);

        $catalogController = new CatalogController();
        $catalogController->setContainer($this->container);
        $collection = $catalogController->getCollection($collectionName);

        $total = $collection->find($criteria)->count();

        $request = $this->requestStack->getCurrentRequest();
        $currentUri = $this->getCurrentURI();
        $queryString = $request->getQueryString();
        $options = [
            'pageVar' => $pageVar,
            'limitVar' => $limitVar
        ];
        $queryOptions = UtilsService::getQueryOptions($currentUri, $queryString, [], [$limit], $options);
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, [], $options);

        $items = $collection
            ->find($criteria)
            ->sort($orderBy)
            ->skip($pagesOptions['skip'])
            ->limit($limit);

        $output = $environment->render($templateName, [
            'items' => $items,
            'total' => $total,
            'groupSize' => $groupSize,
            'groupCount' => ceil($items->count(true) / $groupSize),
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]);
        if (!empty($cacheKey)) {
            $cache->set("content.{$cacheKey}", $output, 60*60*24);
        }
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
     * @param \Twig_Environment $environment
     * @param $path
     * @param $chunkName
     * @param string $chunkNamePrefix
     * @param string $chunkNameSuffix
     * @param string $defaultName
     * @return string
     */
    public function getTemplateName(
        \Twig_Environment $environment,
        $path,
        $chunkName,
        $chunkNamePrefix = '',
        $chunkNameSuffix = '',
        $defaultName = 'default'
    )
    {
        $templateName = sprintf($path . '%s%s%s.html.twig', $chunkNamePrefix, $chunkName, $chunkNameSuffix);
        if (!$environment->getLoader()->exists($templateName)) {
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

    /**
     * @param $pagesOptions
     * @param int $pageNumber
     * @param int $limit
     * @param string $orderBy
     * @return string
     */
    public function pageUrlFunction($pagesOptions, $pageNumber = 0, $limit = 0, $orderBy = '')
    {
        $currentUri = $this->getCurrentURI();
        if (!$orderBy) {
            $orderBy = isset($_GET[$pagesOptions['orderByVar']])
                ? $_GET[$pagesOptions['orderByVar']]
                : 'id_desc';
        }
        if (!$pageNumber) {
            $pageNumber = isset($_GET[$pagesOptions['pageVar']])
                ? $_GET[$pagesOptions['pageVar']]
                : $pagesOptions['current'];
        }
        if (!$limit) {
            $limit = isset($_GET[$pagesOptions['limitVar']])
                ? $_GET[$pagesOptions['limitVar']]
                : $pagesOptions['limit'];
        }
        $output = $currentUri;
        $output .= "?{$pagesOptions['limitVar']}={$limit}";
        $output .= "&{$pagesOptions['pageVar']}={$pageNumber}";
        $output .= "&{$pagesOptions['orderByVar']}={$orderBy}";
        return $output;
    }

    /**
     * @param \Twig_Environment $environment
     * @param $itemData
     * @param $fieldsData
     * @param $fieldBaseName
     * @param string $chunkNamePrefix
     * @return string
     */
    public function renderOutputImageGalleryFunction(\Twig_Environment $environment, $itemData, $fieldsData, $fieldBaseName, $chunkNamePrefix = '')
    {
        $templateName = $this->getTemplateName($environment, 'chunks/fields/', 'gallery', $chunkNamePrefix);

        $imageFields = array_filter($itemData, function($key) use ($fieldBaseName) {
            return $key === $fieldBaseName
                || strpos($key, "{$fieldBaseName}__") !== false;
        }, ARRAY_FILTER_USE_KEY);

        return $environment->render($templateName, [
            'fieldBaseName' => $fieldBaseName,
            'imageFields' => $imageFields
        ]);
    }

    /**
     * @param mixed $needle
     * @param array $haystack
     * @return int
     */
    public function arraySearchFunction($needle, $haystack)
    {
        $index = array_search($needle, $haystack);
        if ($index === false) {
            return -1;
        }
        return $index;
    }

    /**
     * @param $input
     * @param $caseArr
     * @param $valuesArr
     * @return mixed
     */
    public function switchFunction($input, $caseArr, $valuesArr)
    {
        $index = array_search($input, $caseArr);
        if ($index === false) {
            return end($valuesArr);
        }
        return $valuesArr[$index];
    }

    /**
     * @return string
     */
    public function getCurrentURI()
    {
        $request = $this->requestStack->getCurrentRequest();
        $currentUri = $request->getRequestUri();
        if (strpos($currentUri, '?') !== false) {
            $currentUri = substr($currentUri, 0, strpos($currentUri, '?'));
        }
        return $currentUri;
    }
}

