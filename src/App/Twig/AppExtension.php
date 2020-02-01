<?php

namespace App\Twig;

use Psr\Cache\CacheItemInterface;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Twig\Environment as TwigEnvironment;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class AppExtension extends AbstractExtension
{
    /** @var ContainerInterface */
    protected $container;
    /** @var  RequestStack */
    protected $requestStack;
    /** @var UrlGeneratorInterface $generator */
    protected $generator;
    /** @var array */
    protected $cache = [];

    /**
     * AppExtension constructor.
     * @param ContainerInterface $container
     * @param RequestStack $requestStack
     * @param UrlGeneratorInterface $generator
     */
    public function __construct(ContainerInterface $container, RequestStack $requestStack, UrlGeneratorInterface $generator)
    {
        $this->container = $container;
        $this->requestStack = $requestStack;
        $this->generator = $generator;
    }

    /**
     * @return array
     */
    public function getFilters()
    {
        return [
            new TwigFilter('price', [AppRuntime::class, 'priceFilter'])
        ];
    }

    /**
     * @return array
     */
    public function getFunctions()
    {
        return [
            new TwigFunction('catalogPath', array($this, 'catalogPathFunction')),
            new TwigFunction('pathLocalized', array($this, 'pathLocalizedFunction')),
            new TwigFunction('outputFilter', [$this, 'outputFilterFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('outputFilters', [$this, 'outputFiltersFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('getFieldOption', [$this, 'getFieldOptionFunction']),
            new TwigFunction('renderOutputType', [$this, 'renderOutputTypeFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('renderOutputTypeArray', [$this, 'renderOutputTypeArrayFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('renderOutputTypeField', [$this, 'renderOutputTypeFieldFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('renderOutputTypeChunk', [$this, 'renderOutputTypeChunkFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('getFieldNameByChunk', [AppRuntime::class, 'getFieldNameByChunkFunction']),
            new TwigFunction('renderOutputGallery', [AppRuntime::class, 'renderOutputGalleryFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('categoriesTree', [AppRuntime::class, 'categoriesTreeFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('twigNextPass', [$this, 'twigNextPassFunction']),
            new TwigFunction('shopCart', [AppRuntime::class, 'shopCartFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('shopCartProductCount', [AppRuntime::class, 'shopCartProductCountFunction']),
            new TwigFunction('isPaidProduct', [AppRuntime::class, 'isPaidProductFunction']),
            new TwigFunction('currencyList', [AppRuntime::class, 'currencyListFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('settingsList', [AppRuntime::class, 'settingsListFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('imageUrl', [AppRuntime::class, 'fileUrlFunction']),
            new TwigFunction('fileUrl', [AppRuntime::class, 'fileUrlFunction']),
            new TwigFunction('pageUrl', [AppRuntime::class, 'pageUrlFunction']),
            new TwigFunction('contentList', [AppContentList::class, 'contentListFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('includeContent', [AppContentList::class, 'includeContentFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('arraySearch', [AppRuntime::class, 'arraySearchFunction']),
            new TwigFunction('switch', [AppRuntime::class, 'switchFunction'], [
                'is_safe' => ['html']
            ]),
            new TwigFunction('renderForm', [AppRuntime::class, 'renderFormFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('fieldByLocale', [AppRuntime::class, 'fieldByLocaleFunction'])
        ];
    }

    /**
     * @param string $parentUri
     * @param string $systemName
     * @param array $itemData
     * @param string $categoriesField
     * @param string $linkField
     * @return string
     */
    public function catalogPathFunction($parentUri = '', $systemName = '', $itemData = [], $categoriesField = '', $linkField = 'href')
    {
        $baseUrl = $this->container->get('router')->getContext()->getBaseUrl();
        $path = $baseUrl;
        if ($linkField && !empty($itemData[$linkField])) {
            return $itemData[$linkField];
        }
        if ($categoriesField && !empty($itemData[$categoriesField])) {
            $parentUri = '';
        }
        if (!$parentUri || !$systemName) {
            $parentId = isset($itemData['parentId']) ? $itemData['parentId'] : 0;
            if ($parentId) {
                if (!isset($this->cache['categoryUriData'])) {
                    $this->cache['categoryUriData'] = [];
                }
                if (isset($this->cache['categoryUriData'][$parentId])) {
                    $parentUri = $this->cache['categoryUriData'][$parentId]['uri'];
                    if (!$systemName) {
                        $systemNameField = isset($this->cache['categoryUriData'][$parentId]['systemNameField'])
                            ? $this->cache['categoryUriData'][$parentId]['systemNameField']
                            : '';
                        $systemName = $systemNameField && !empty($itemData[$systemNameField])
                            ? $itemData[$systemNameField]
                            : '';
                    }
                } else {
                    /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
                    $dm = $this->container->get('doctrine_mongodb')->getManager();
                    $categoryRepository = $dm->getRepository(Category::class);
                    /** @var Category $category */
                    $category = $categoryRepository->findOneBy([
                        'id' => $parentId,
                        'isActive' => true
                    ]);
                    $systemNameField = '';
                    if ($category) {
                        $parentUri = $category->getUri();
                        if (!$systemName) {
                            $systemNameField = $category->getContentType()->getSystemNameField();
                            $systemName = $systemNameField && !empty($itemData[$systemNameField])
                                ? $itemData[$systemNameField]
                                : '';
                        }
                    }
                    $this->cache['categoryUriData'][$parentId] = [
                        'uri' => $parentUri,
                        'systemNameField' => $systemNameField
                    ];
                }
            }
        }
        if ($parentUri) {
            $path .= $parentUri;
        }
        $path .= $systemName;

        $request = $this->requestStack->getCurrentRequest();
        $localeUrlPrefix = $request->attributes->has('locale_url_prefix')
            ? $request->attributes->get('locale_url_prefix')
            : '/';
        return $localeUrlPrefix . $path;
    }

    /**
     * @param $routeName
     * @param array $parameters
     * @return string
     */
    public function pathLocalizedFunction($routeName, $parameters = [])
    {
        $request = $this->requestStack->getCurrentRequest();
        $localeDefault = $this->container->getParameter('locale');
        $locale = $request->getLocale();
        if ($localeDefault === $locale) {
            return $this->generator->generate($routeName, $parameters);
        }
        $routeName .= '_localized';
        $parameters['_locale'] = $locale;
        return $this->generator->generate($routeName, $parameters);
    }

    /**
     * @param $fieldsData
     * @param $fieldName
     * @param string $optionName
     * @return string|array
     */
    public function getFieldOptionFunction($fieldsData, $fieldName, $optionName = 'type')
    {
        $index = array_search($fieldName, array_column($fieldsData, 'name'));
        if ($index === false) {
            return '';
        }
        return isset($fieldsData[$index][$optionName]) ? $fieldsData[$index][$optionName] : '';
    }

    /**
     * @param TwigEnvironment $environment
     * @param $value
     * @param $type
     * @param array $properties
     * @param array $options
     * @param array $fieldProperties
     * @param array $data
     * @return mixed
     */
    public function renderOutputTypeFunction(TwigEnvironment $environment,
        $value,
        $type,
        $properties = [],
        $options = [],
        $fieldProperties = [],
        $data = []
    )
    {
        if (empty($value)) {
            $value = '';
        }
        $chunkName = !empty($properties['chunkName']) ? $properties['chunkName'] : $type;
        $chunkNamePrefix = !empty($properties['chunkNamePrefix'])
            ? $properties['chunkNamePrefix']
            : '';

        if (is_array($value)) {
            $properties = array_merge($properties, ['value' => '', 'data' => $value], $data);
        } else {
            $properties = array_merge($properties, ['value' => $value], $data);
        }
        if (!isset($properties['systemNameField'])) {
            $properties['systemNameField'] = '';
        }
        if (!isset($properties['currentCategoryUri'])) {
            $properties['currentCategoryUri'] = '';
        }
        $properties['systemName'] = !empty($options[$properties['systemNameField']])
            ? $options[$properties['systemNameField']]
            : '';
        $properties['itemData'] = $options;
        if (!empty($fieldProperties)) {
            $properties['fieldData'] = [
                'name' => $fieldProperties['name'],
                'title' => $fieldProperties['title'],
                'description' => $fieldProperties['description']
            ];
        }

        if (!empty($value)) {
            $templateName = $this->getTemplateName(
                $environment,
                'chunks/fields/',
                $chunkName,
                $chunkNamePrefix,
                '',
                'text'
            );
        } else {
            $templateName = $this->getTemplateName(
                $environment,
                'chunks/fields/',
                $chunkName,
                $chunkNamePrefix,
                '_empty',
                'empty'
            );
        }

        $properties['fieldProperties'] = $fieldProperties;
        try {
            return $environment->render($templateName, $properties);
        } catch (\Exception $e) {
            return $this->twigAddError($e->getMessage());
        }
    }

    /**
     * @param TwigEnvironment $environment
     * @param $itemData
     * @param $fieldsData
     * @param string $chunkNamePrefix
     * @param array $data
     * @return string
     */
    public function renderOutputTypeArrayFunction(TwigEnvironment $environment, $itemData, $fieldsData, $chunkNamePrefix = '', $data = [])
    {
        if (empty($itemData)) {
            return '';
        }
        $output = '';
        foreach ($fieldsData as $field) {
            if (!isset($itemData[$field['name']])) {
                $itemData[$field['name']] = '';
            }
            $output .= $this->renderOutputTypeFunction(
                $environment,
                $itemData[$field['name']],
                $field['outputType'],
                array_merge($field['outputProperties'], ['chunkNamePrefix' => $chunkNamePrefix]),
                $itemData,
                $field,
                $data
            );
        }
        return $output;
    }

    /**
     * @param TwigEnvironment $environment
     * @param array $filterData
     * @param string $chunkNamePrefix
     * @return string
     */
    public function outputFilterFunction(TwigEnvironment $environment, $filterData, $chunkNamePrefix = '')
    {
        if (empty($filterData)) {
            return '';
        }
        $templateName = $this->getTemplateName($environment, 'chunks/filters/', $filterData['outputType'], $chunkNamePrefix);
        try {
            return $environment->render($templateName, ['filter' => $filterData]);
        } catch (\Exception $e) {
            return $this->twigAddError($e->getMessage());
        }
    }

    /**
     * @param TwigEnvironment $environment
     * @param array $filtersData
     * @param string $chunkNamePrefix
     * @param string $cacheKey
     * @return string
     */
    public function outputFiltersFunction(TwigEnvironment $environment, $filtersData, $chunkNamePrefix = '', $cacheKey = '')
    {
        if (empty($filtersData) || !is_array($filtersData)) {
            return '';
        }
        $request = $this->requestStack->getCurrentRequest();
        $locale = $request->getLocale();

        $cacheItemHtml = null;
        if (!empty($cacheKey)) {
            /** @var FilesystemAdapter $cache */
            $cache = $this->container->get('app.filecache');
            /** @var CacheItemInterface $cacheItemHtml */
            $cacheItemHtml = $cache->getItem("content.{$cacheKey}.{$locale}");
            if ($cacheItemHtml && $cacheItemHtml->isHit()) {
                return $cacheItemHtml->get();
            }
        }
        
        $output = '';
        foreach ($filtersData as  $filterData) {
            $output .= $this->outputFilterFunction($environment, $filterData, $chunkNamePrefix) . PHP_EOL;
        }
        if ($cacheItemHtml) {
            $cacheItemHtml->set($output);
            $cache->save($cacheItemHtml);
        }
        return $output;
    }

    /**
     * @param TwigEnvironment $environment
     * @param $itemData
     * @param $fieldsData
     * @param $chunkName
     * @param string $chunkNamePrefix
     * @param array $data
     * @param int $limit
     * @return string
     */
    public function renderOutputTypeChunkFunction(TwigEnvironment $environment, $itemData, $fieldsData, $chunkName, $chunkNamePrefix = '', $data = [], $limit = 0)
    {
        $fields = array_filter($fieldsData, function($field) use ($chunkName, &$itemData) {
            if (!isset($itemData[$field['name']])) {
                $itemData[$field['name']] = '';
            }
            return isset($field['outputProperties']['chunkName'])
                && $field['outputProperties']['chunkName'] === $chunkName;
        });
        if (empty($fields)) {
            return '';
        }
        $fields = array_merge($fields);
        $outputArr = [];
        $count = 0;
        foreach ($itemData as $key => $value) {
            if (in_array($key, ['id', '_id', 'parentId', 'isActive'])) {
                continue;
            }
            $fieldBaseName = ContentType::getCleanFieldName($key);
            $fIndex = array_search($fieldBaseName, array_column($fields, 'name'));
            if ($fIndex === false) {
                continue;
            }
            $field = $fields[$fIndex];

            $propertiesDefault = [
                'fieldData' => [
                    'name' => $key,
                    'title' => $field['title'],
                    'description' => $field['description']
                ],
                'groupByName' => '',
                'className' => ''
            ];
            if (is_array($value)) {
                $propertiesDefault['value'] = '';
                $propertiesDefault['data'] = $value;
            } else {
                $propertiesDefault['value'] = $value;
            }
            if (!isset($data['systemNameField'])) {
                $data['systemNameField'] = '';
            }
            if (!isset($data['currentCategoryUri'])) {
                $data['currentCategoryUri'] = '';
            }
            $properties = array_merge($propertiesDefault, $field['outputProperties'], $data);
            $properties['systemName'] = !empty($itemData[$properties['systemNameField']])
                ? $itemData[$properties['systemNameField']]
                : '';
            $properties['fieldProperties'] = $field;
            $properties['itemData'] = $itemData;
            if (!empty($value)) {
                $templateName = $this->getTemplateName($environment, 'chunks/fields/', $chunkName, $chunkNamePrefix);
            } else {
                $templateName = $this->getTemplateName(
                    $environment,
                    'chunks/fields/',
                    $chunkName,
                    $chunkNamePrefix,
                    '_empty',
                    'empty'
                );
            }
            $output = '';
            if ($count > 0) {
                $output .= PHP_EOL;
            }
            try {
                $output .= $environment->render($templateName, $properties);
            } catch (\Exception $e) {
                $output .= $this->twigAddError($e->getMessage());
            }
            if (!isset($outputArr[$fieldBaseName])) {
                $outputArr[$fieldBaseName] = '';
            }
            $outputArr[$fieldBaseName] .= $output;
            $count++;
            if ($limit && $count >= $limit) {
                break;
            }
        }
        $sortedNames = array_column($fields, 'name');
        uksort($outputArr, function($key) use ($sortedNames) {
            return array_search($key, $sortedNames);
        });
        return implode('', array_values($outputArr));
    }

    /**
     * @param TwigEnvironment $environment
     * @param $itemData
     * @param $fieldsData
     * @param $fieldName
     * @return string
     */
    public function renderOutputTypeFieldFunction(TwigEnvironment $environment, $itemData, $fieldsData, $fieldName)
    {
        $fIndex = array_search($fieldName, array_column($fieldsData, 'name'));
        if ($fIndex === false) {
            try {
                return $environment->render('chunks/fields/default.html.twig', [
                    'itemData' => $itemData,
                    'value' => isset($itemData[$fieldName])
                        ? (is_array($itemData[$fieldName]) ? json_encode($itemData[$fieldName]) : '')
                        : ''
                ]);
            } catch (\Exception $e) {
                return $this->twigAddError($e->getMessage());
            }
        }
        $outputType = $this->getFieldOptionFunction($fieldsData, $fieldName, 'outputType');
        $outputTypeProperties = $this->getFieldOptionFunction($fieldsData, $fieldName, 'outputProperties');
        if (empty($outputTypeProperties['chunkName'])) {
            return '';
        }
        return $this->renderOutputTypeFunction(
            $environment,
            $itemData[$fieldName],
            $outputType,
            $outputTypeProperties,
            $itemData,
            $fieldsData[$fIndex]
        );
    }

    /**
     * @param $errorMessage
     * @return string
     */
    public function twigAddError($errorMessage)
    {
        if (!empty($this->container->getParameter('app.display_errors'))) {
            $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
            $errorMessage = str_replace($rootPath, '', $errorMessage);
            return sprintf('<div class="alert alert-danger py-1 px-2">%s</div>', $errorMessage);
        }
        return '';
    }

    /**
     * @param string $string
     * @return string
     */
    public function twigNextPassFunction($string)
    {
        $vars = func_get_args();
        array_splice($vars, 0, 1);
        $output = '{% '. $string . ' %}';
        foreach ($vars as $ind => $var) {
            $output = str_replace('$'.($ind+1), "'{$var}'", $output);
        }
        return str_replace('$', '', $output);
    }

    /**
     * @param TwigEnvironment $environment
     * @param $path
     * @param $chunkName
     * @param string $chunkNamePrefix
     * @param string $chunkNameSuffix
     * @param string $defaultName
     * @return string
     */
    public function getTemplateName(
        TwigEnvironment $environment,
        $path, $chunkName,
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

}
