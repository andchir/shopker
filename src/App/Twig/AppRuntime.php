<?php

namespace App\Twig;

use App\Controller\CatalogController;
use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\Setting;
use App\Service\SettingsService;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormBuilder;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Cache\Simple\FilesystemCache;
use Symfony\Component\Translation\TranslatorInterface;

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
        if (empty($this->container->getParameter('mongodb_database'))) {
                return '';
        }
        $data = [
            'currencySelected' => ShopCartService::getCurrencyCookie(),
            'countTotal' => 0,
            'priceTotal' => 0,
            'items' => []
        ];

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
                $product['filesString'] = $this->getCartContentfilesString($product);
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
        if (empty($this->container->getParameter('mongodb_database'))) {
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

        $properties = [
            'data' => $settingsService->getSettingsGroup(Setting::GROUP_CURRENCY)
        ];
        $templateName = 'catalog/currency_list.html.twig';

        if (count($properties['data']) <= 1) {
            $output = '';
        } else {
            $output = $environment->render($templateName, $properties);
        }
        $cache->set($cacheKey, $output, 60*60*24);

        return $output;
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $chunkName
     * @param $collectionName
     * @param array $criteria
     * @param array $orderBy
     * @param int $limit
     * @param int $groupSize
     * @param string $cacheKey
     * @param string $pageVar
     * @param string $limitVar
     * @param array $parameters
     * @return string
     */
    public function contentListFunction(
        \Twig_Environment $environment,
        $chunkName,
        $collectionName,
        $criteria,
        $orderBy = ['_id' => 'asc'],
        $limit = 20,
        $groupSize = 1,
        $cacheKey = '',
        $pageVar = 'page',
        $limitVar = 'limit',
        $parameters = []
    )
    {
        if (!$collectionName) {
            return '';
        }
        $request = $this->requestStack->getCurrentRequest();
        $localeDefault = $this->container->getParameter('locale');
        $locale = $request->getLocale();

        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');
        if (!empty($cacheKey)) {
            $cacheKey .= ".{$locale}";
            if ($cache->has("content.{$cacheKey}")) {
                return $cache->get("content.{$cacheKey}");
            }
        }

        $templateName = sprintf('catalog/%s.html.twig', $chunkName);

        $catalogController = new CatalogController();
        $catalogController->setContainer($this->container);
        $collection = $catalogController->getCollection($collectionName);

        $total = $collection->find($criteria)->count();

        $currentUri = $this->getCurrentURI();
        $queryString = $request->getQueryString();
        $options = [
            'pageVar' => $pageVar,
            'limitVar' => $limitVar
        ];
        $queryOptions = UtilsService::getQueryOptions($currentUri, $queryString, [], ['pageSizeArr' => [$limit]], $options);
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, [], $options);

        $aggregateFields = [];
        if ($locale !== $localeDefault) {
            $contentType = $catalogController->getContentTypeRepository()->findOneBy([
                'collection' => $collectionName
            ]);
            if ($contentType) {
                $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
            }
            if (!empty($parameters['headerFieldName']) || $contentType) {
                if (empty($parameters['headerFieldName'])) {
                    $parameters['headerFieldName'] = $contentType->getFieldByChunkName('header');
                }
                $catalogController->applyLocaleFilter($locale, $parameters['headerFieldName'], $criteria);
            }
        }

        $orderBy = array_map(function($orderByDir) {
            return $orderByDir === 'asc' ? 1 : -1;
        }, $orderBy);

        $pipeline = $catalogController->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            $queryOptions['limit'],
            $orderBy,
            $pagesOptions['skip']
        );
        $items = $collection->aggregate($pipeline, [
            'cursor' => []
        ]);

        $output = $environment->render($templateName, array_merge($parameters, [
            'items' => $items,
            'total' => $total,
            'groupSize' => $groupSize,
            'groupCount' => $groupSize ? ceil($items->count(true) / $groupSize) : 1,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]));
        if (!empty($cacheKey)) {
            $cache->set("content.{$cacheKey}", $output, 60*60*24);
        }
        return $output;
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $chunkName
     * @param string $collectionName
     * @param int $contentId
     * @param string $cacheKey
     * @param array $parameters
     * @return string
     */
    public function includeContentFunction(
        \Twig_Environment $environment,
        $chunkName,
        $collectionName,
        $contentId,
        $cacheKey = '',
        $parameters = []
    )
    {
        if (!$collectionName) {
            return '';
        }
        $request = $this->requestStack->getCurrentRequest();
        $localeDefault = $this->container->getParameter('locale');
        $locale = $request->getLocale();

        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');
        if (!empty($cacheKey)) {
            $cacheKey .= ".{$locale}";
            if ($cache->has("content_inc.{$cacheKey}")) {
                return $cache->get("content_inc.{$cacheKey}");
            }
        }

        $templateName = $chunkName . '.html.twig';

        $catalogController = new CatalogController();
        $catalogController->setContainer($this->container);
        $collection = $catalogController->getCollection($collectionName);
        $criteria = ['_id' => $contentId];

        $aggregateFields = [];
        if ($locale !== $localeDefault) {
            $contentType = $catalogController->getContentTypeRepository()->findOneBy([
                'collection' => $collectionName
            ]);
            if ($contentType) {
                $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
            }
            if (!empty($parameters['headerFieldName']) || $contentType) {
                if (empty($parameters['headerFieldName'])) {
                    $parameters['headerFieldName'] = $contentType->getFieldByChunkName('header');
                }
                $catalogController->applyLocaleFilter($locale, $parameters['headerFieldName'], $criteria);
            }
        }

        $pipeline = $catalogController->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            1
        );
        $document = $collection->aggregate($pipeline, [
            'cursor' => []
        ])->toArray();

        if (empty($document)) {
            return '';
        }
        $document = current($document);
        $document['id'] = $document['_id'];

        $output = $environment->render($templateName, array_merge($parameters, $document));

        if (!empty($cacheKey)) {
            $cache->set("content_inc.{$cacheKey}", $output, 60*60*24);
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
     * @param array $productData
     * @param string $fieldName
     * @return string
     */
    public function getCartContentParametersString($productData, $fieldName = 'parameters')
    {
        $parameters = isset($productData[$fieldName]) && is_array($productData[$fieldName])
            ? $productData[$fieldName]
            : [];
        if (empty($parameters)) {
            return '';
        }

        /** @var \Twig_Environment */
        $twig = $this->container->get('twig');

        return $twig->render('catalog/shop_cart_parameter.html.twig', [
            'parameters' => $parameters
        ]);
    }

    /**
     * @param $productData
     * @return string
     */
    public function getCartContentFilesString($productData)
    {
        $files = isset($productData['files']) && is_array($productData['files'])
            ? $productData['files']
            : [];
        return OrderContent::getFilesStrFromArray($files);
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
     * @param int|null $decimals
     * @param string $decPoint
     * @param string $thousandsSep
     * @return string
     */
    public function priceFilter($number, $decimals = null, $decPoint = '.', $thousandsSep = ' ')
    {
        if ($decimals === null) {
            $decimals = $number - floor($number) === (float) 0 ? 0 : 2;
        }
        $price = number_format($number, $decimals, $decPoint, $thousandsSep);
        return $price;
    }

    /**
     * @param $itemData
     * @return string
     */
    public function fileUrlFunction($itemData)
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
     * @param string $chunkName
     * @param string $chunkNamePrefix
     * @return string
     */
    public function renderOutputGalleryFunction(\Twig_Environment $environment, $itemData, $fieldsData, $fieldBaseName, $chunkName = 'gallery', $chunkNamePrefix = '')
    {
        $templateName = $this->getTemplateName($environment, 'chunks/fields/', $chunkName, $chunkNamePrefix);

        $fileFields = array_filter($itemData, function($val, $key) use ($fieldBaseName) {
            return ($key === $fieldBaseName || strpos($key, "{$fieldBaseName}__") !== false)
                && is_array($val);
        }, ARRAY_FILTER_USE_BOTH);

        return $environment->render($templateName, [
            'fieldBaseName' => $fieldBaseName,
            'fileFields' => $fileFields
        ]);
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $formName
     * @param string|null $layoutPath
     * @param string $varName
     * @return string
     */
    public function renderFormFunction(\Twig_Environment $environment, $formName = '', $layoutPath = null, $varName = 'form')
    {
        if (!$formName) {
            return '';
        }
        /** @var Request $request */
        $request = $this->requestStack->getCurrentRequest();
        /** @var TranslatorInterface $translator */
        $translator = $this->container->get('translator');
        /** @var UtilsService $utilsService */
        $utilsService = $this->container->get('app.utils');
        /** @var FormBuilder $formBuilder */
        $formBuilder = $this->container->get('form.factory')->createBuilder();
        $formOptions = $utilsService->parseYaml($formName, 'forms/');

        if (empty($formOptions) || !is_array($formOptions) || empty($formOptions['fields'])) {
            return '';
        }

        UtilsService::formAddFields($formBuilder, $formOptions['fields']);

        $form = $formBuilder->getForm();
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $emailTo = !empty($formOptions['emailTo'])
                ? $formOptions['emailTo']
                : $this->container->getParameter('app.admin_email');

            if (empty($emailTo)) {

                $form->addError(new FormError($translator->trans('email.recipient_error')));

            } else {

                $formData = $form->getData();
                $emailSubject = !empty($formOptions['emailSubject'])
                    ? $translator->trans($formOptions['emailSubject'])
                    : '';

                $formTextFields = array_filter($formOptions['fields'], function($field) {
                    return !in_array($field['type'], ['SubmitType', 'CaptchaType']);
                });
                $emailBody = $environment->render('email/email_custom_form.html.twig', [
                    'fields' => $formTextFields,
                    'formData' => $formData
                ]);

                if ($utilsService->sendMail($emailSubject, $emailBody, $emailTo)) {
                    $request->getSession()
                        ->getFlashBag()
                        ->add('messages', 'email.send_successful');

                    return '';
                }
            }
        }

        return $environment->render('form/custom_form.html.twig', [
            'form' => $form->createView(),
            'varName' => $varName,
            'layoutPath' => $layoutPath
        ]);
    }

    /**
     * @param array $itemData
     * @param array $fieldsData
     * @param string $chunkName
     * @return string
     */
    public function getFieldNameByChunkFunction($itemData, $fieldsData, $chunkName)
    {
        $fields = array_filter($fieldsData, function($field) use ($chunkName) {
            return $field['properties']['chunkName'] === $chunkName;
        });
        if (empty($fields)) {
            return '';
        }
        $fields = array_merge($fields);
        return !empty($fields) ? $fields[0]['name'] : '';
    }

    /**
     * @param array $dataArr
     * @param string $fieldName
     * @return string
     */
    public function fieldByLocaleFunction($dataArr, $fieldName)
    {
        $request = $this->requestStack->getCurrentRequest();
        $locale = $request->getLocale();
        if (empty($dataArr['translations']) || empty($dataArr['translations'][$fieldName])) {
            return $dataArr[$fieldName] ?? '';
        }
        return isset($dataArr['translations'][$fieldName][$locale])
            ? $dataArr['translations'][$fieldName][$locale]
            : $dataArr[$fieldName] ?? '';
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

