<?php

namespace App\Twig;

use App\Controller\CatalogController;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Setting;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Cache\Simple\FilesystemCache;
use Symfony\Component\HttpFoundation\RequestStack;

class AppExtension extends AbstractExtension
{
    /** @var ContainerInterface */
    protected $container;
    /** @var  RequestStack */
    protected $requestStack;
    /** @var array */
    protected $cache = [];

    /**
     * AppExtension constructor.
     * @param ContainerInterface $container
     * @param RequestStack $requestStack
     */
    public function __construct(ContainerInterface $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->requestStack = $requestStack;
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
            new TwigFunction('outputFilter', [$this, 'outputFilterFunction'], [
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
            new TwigFunction('categoriesTree', [$this, 'categoriesTreeFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('twigNextPass', [$this, 'twigNextPassFunction']),
            new TwigFunction('shopCart', [AppRuntime::class, 'shopCartFunction'], [
                'is_safe' => ['html'],
                'needs_environment' => true
            ]),
            new TwigFunction('currencyList', [AppRuntime::class, 'currencyListFunction'], [
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
            $path .= '/' . $parentUri;
        }
        $path .= $systemName;
        return $path;
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
     * @param \Twig_Environment $environment
     * @param $value
     * @param $type
     * @param array $properties
     * @param array $options
     * @param array $fieldProperties
     * @param array $data
     * @return mixed
     */
    public function renderOutputTypeFunction(\Twig_Environment $environment,
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

        return $environment->render($templateName, $properties);
    }

    /**
     * @param \Twig_Environment $environment
     * @param $itemData
     * @param $fieldsData
     * @param string $chunkNamePrefix
     * @param array $data
     * @return string
     */
    public function renderOutputTypeArrayFunction(\Twig_Environment $environment, $itemData, $fieldsData, $chunkNamePrefix = '', $data = [])
    {
        if (empty($itemData)) {
            return '';
        }
        $output = '';
        foreach ($fieldsData as $field) {
            if (!isset($itemData[$field['name']])) {
                continue;
            }
            $output .= $this->renderOutputTypeFunction(
                $environment,
                $itemData[$field['name']],
                $field['type'],
                array_merge($field['properties'], ['chunkNamePrefix' => $chunkNamePrefix]),
                $itemData,
                $field,
                $data
            );
        }
        return $output;
    }

    /**
     * @param \Twig_Environment $environment
     * @param $filtersData
     * @param string $chunkNamePrefix
     * @return string
     */
    public function outputFilterFunction(\Twig_Environment $environment, $filtersData, $chunkNamePrefix = '')
    {
        if (empty($filtersData)) {
            return '';
        }
        $templateName = $this->getTemplateName($environment, 'chunks/filters/', $filtersData['outputType'], $chunkNamePrefix);
        return $environment->render($templateName, ['filter' => $filtersData]);
    }

    /**
     * @param \Twig_Environment $environment
     * @param $itemData
     * @param $fieldsData
     * @param $chunkName
     * @param string $chunkNamePrefix
     * @param array $data
     * @param int $limit
     * @return string
     */
    public function renderOutputTypeChunkFunction(\Twig_Environment $environment, $itemData, $fieldsData, $chunkName, $chunkNamePrefix = '', $data = [], $limit = 0)
    {
        $fields = array_filter($fieldsData, function($field) use ($chunkName) {
            return $field['properties']['chunkName'] === $chunkName;
        });
        if (empty($fields)) {
            return '';
        }
        $fields = array_merge($fields);
        $output = '';
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
                ]
            ];
            if (is_array($value)) {
                $propertiesDefault['value'] = '';
                $propertiesDefault['data'] = $value;
            } else {
                $propertiesDefault['value'] = $value;
            }
            $properties = array_merge($field['properties'], $propertiesDefault, $data);
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
            if ($count > 0) {
                $output .= PHP_EOL;
            }
            $output .= $environment->render($templateName, $properties);
            $count++;
            if ($limit && $count >= $limit) {
                break;
            }
        }
        return $output;
    }

    /**
     * @param \Twig_Environment $environment
     * @param $itemData
     * @param $fieldsData
     * @param $fieldName
     * @return string
     */
    public function renderOutputTypeFieldFunction(\Twig_Environment $environment, $itemData, $fieldsData, $fieldName)
    {
        $fIndex = array_search($fieldName, array_column($fieldsData, 'name'));
        if ($fIndex === false) {
            return $environment->render('chunks/fields/default.html.twig', [
                'itemData' => $itemData,
                'value' => isset($itemData[$fieldName])
                    ? (is_array($itemData[$fieldName]) ? json_encode($itemData[$fieldName]) : '')
                    : ''
            ]);
        }
        $outputType = $this->getFieldOptionFunction($fieldsData, $fieldName, 'type');
        $outputTypeProperties = $this->getFieldOptionFunction($fieldsData, $fieldName, 'properties');
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
     * @param \Twig_Environment $environment
     * @param int $parentId
     * @param string $chunkName
     * @param array|null $data
     * @param array|null $activeCategoriesIds
     * @param bool $cacheEnabled
     * @param string $activeClassName
     * @return string
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public function categoriesTreeFunction(\Twig_Environment $environment, $parentId = 0, $chunkName = 'menu_tree', $data = null, $activeCategoriesIds = null, $cacheEnabled = false, $activeClassName = 'active')
    {
        $request = $this->requestStack->getCurrentRequest();
        $currentUri = substr($request->getPathInfo(), 1);
        $uriArr = UtilsService::getUriArray($currentUri);
        $locale = $request->getLocale();

        $cacheKey = "tree.{$chunkName}.{$locale}";
        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');
        $output = '';

        if ($data === null) {
            if ($cacheEnabled && $cache->has($cacheKey)) {
                $output = $cache->get($cacheKey);
            } else {
                $catalogController = new CatalogController();
                $catalogController->setContainer($this->container);
                $categoriesTree = $catalogController->getCategoriesTree($parentId, $locale);
                $data = !empty($categoriesTree) ? $categoriesTree[0] : [];
                if ($activeCategoriesIds === null) {
                    $activeCategoriesIds = $catalogController->getCategoriesActiveIds($data, $uriArr);
                }
            }
        }

        if (!$output) {
            $templateName = $this->getTemplateName($environment, 'nav/', $chunkName);
            if (empty($data['children'])) {
                return '';
            }
            $data['currentUri'] = $currentUri;
            $data['uriArr'] = $uriArr;
            $data['activeCategoriesIds'] = $activeCategoriesIds;
            $output = $environment->render($templateName, $data);

            if ($cacheEnabled) {
                 $cache->set($cacheKey, $output, 60*60*24);
            }
        }

        if ($cacheEnabled && !empty($activeCategoriesIds)) {
            $output = str_replace(
                array_map(function($id) {return "active{$id}-"; }, $activeCategoriesIds),
                $activeClassName,
                $output
            );
        }

        return $output;
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
