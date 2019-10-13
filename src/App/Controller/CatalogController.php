<?php

namespace App\Controller;

use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Filter;
use App\Repository\CategoryRepository;
use App\Repository\ContentTypeRepository;
use App\Service\CatalogService;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\MainBundle\Document\Category;

class CatalogController extends ProductController
{

    /** @var SettingsService */
    private $settingsService;
    /** @var DocumentManager */
    private $dm;

    public function __construct(SettingsService $settingsService, DocumentManager $dm)
    {
        $this->settingsService = $settingsService;
        $this->dm = $dm;
    }

    /**
     * @Route(
     *     "/{_locale}/{uri<^[a-z0-9\/\-_\.]+\/$>}",
     *     name="catalog_category_localized",
     *     requirements={"_locale": "^[a-z]{2}$", "uri": "^[a-z0-9\/\-_\.]+\/$"},
     *     defaults={"uri": ""}
     * )
     * @Route(
     *     "/{uri<^[a-z0-9\/\-_\.]+\/$>}",
     *     name="catalog_category",
     *     requirements={"uri": "^[a-z0-9\/\-_\.]+\/$"},
     *     defaults={"uri": ""}
     * )
     * @param Request $request
     * @param string $uri
     * @param CatalogService $catalogService
     * @return Response
     */
    public function catalogCategoryAction(Request $request, $uri, CatalogService $catalogService)
    {
        return $this->catalogAction($request, $uri, 'catalog_category', $catalogService);
    }

    /**
     * @Route(
     *     "/{_locale}/{uri<[a-z0-9\/\-_\.]+>}",
     *     name="catalog_page_localized",
     *     requirements={"_locale": "^[a-z]{2}$", "uri": "[a-z0-9\/\-_\.]+"},
     *     defaults={"uri": ""}
     * )
     * @Route(
     *     "/{uri<[a-z0-9\/\-_\.]+>}",
     *     name="catalog_page",
     *     requirements={"uri": "[a-z0-9\/\-_\.]+"},
     *     defaults={"uri": ""}
     * )
     * @param Request $request
     * @param string $uri
     * @param CatalogService $catalogService
     * @return Response
     */
    public function catalogPageAction(Request $request, $uri, CatalogService $catalogService)
    {
        return $this->catalogAction($request, $uri, 'catalog_page', $catalogService);
    }

    /**
     * @param Request $request
     * @param string $uri
     * @param string $routeName
     * @param CatalogService $catalogService
     * @return Response
     */
    public function catalogAction(Request $request, $uri, $routeName, CatalogService $catalogService)
    {
        if (empty($this->getParameter('mongodb_database'))) {
            return $this->redirectToRoute('setup');
        }
        $localeDefault = $this->getParameter('locale');
        $locale = $request->getLocale();
        $categoriesRepository = $this->getCategoriesRepository();
        $filtersRepository = $this->dm->getRepository(Filter::class);
        list($pageAlias, $categoryUri, $levelNum) = Category::parseUri($uri);

        /** @var Category $currentCategory */
        if ($categoryUri) {
            $where = ['uri' => $categoryUri];
            $currentCategory = $categoriesRepository->findOneBy($where);
        } else {
            $currentCategory = $categoriesRepository->find(0);
        }
        if ($routeName === 'catalog_page') {
            if (is_null($currentCategory)) {
                throw $this->createNotFoundException();
            }
            return $this->pageProduct($currentCategory, $uri, $locale, $catalogService);
        }
        if (!$currentCategory || !$currentCategory->getIsActive()) {
            throw $this->createNotFoundException();
        }

        $listTemplate = $request->cookies->get('shkListType', 'grid');
        $catalogNavSettingsDefaults = $this->getCatalogNavSettingsDefaults();
        $currentPage = $currentCategory;
        $currentId = $currentCategory->getId();

        $breadcrumbs = $categoriesRepository->getBreadcrumbs($categoryUri, false, $locale);
        $categoriesMenu = $this->getCategoriesMenu($currentCategory, $breadcrumbs, $locale);

        $contentType = $currentCategory->getContentType();
        $priceFieldName = $contentType->getPriceFieldName();
        $headerFieldName = $contentType->getFieldByChunkName('header');
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());
        $queryString = $request->getQueryString();
        $queryOptions = UtilsService::getQueryOptions($uri, $queryString, $contentTypeFields, $catalogNavSettingsDefaults);

        $options = [
            'currentCategoryUri' => $currentCategory->getUri(),
            'systemNameField' => $contentType->getSystemNameField(),
            'needSortFields' => true
        ];
        /** @var Filter $filters */
        $filters = $filtersRepository->findByCategory($currentCategory->getId());
        $filtersArr = !empty($filters) ? $filters->getValues() : [];
        $filtersData = !empty($filters) ? $filters->getValuesData() : [];
        list($filters, $fieldsAll) = $this->getFieldsData($contentTypeFields, $options,'page', $filtersArr, $filtersData, $queryOptions);
        $fields = array_filter($fieldsAll, function($v) {
            return $v['showInList'];
        });

        // Get child products
        $criteria = [
            'isActive' => true
        ];
        $this->applyFilters($queryOptions['filter'], $filters, $criteria);
        $catalogService->applyCategoryFilter($currentCategory, $contentTypeFields, $criteria);
        if ($locale !== $localeDefault && $headerFieldName) {
            $catalogService->applyLocaleFilter($locale, $headerFieldName, $criteria);
        }
        $total = $collection->countDocuments($criteria);

        /* pages */
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, $catalogNavSettingsDefaults);
        $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);

        $pipeline = $catalogService->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            $queryOptions['limit'],
            $queryOptions['sortOptionsAggregation'],
            $pagesOptions['skip']
        );
        $items = $collection->aggregate($pipeline, [
            'cursor' => []
        ])->toArray();

        $categoriesSiblings = [];
        if (count($categoriesMenu) === 0 && $levelNum > 1) {
            $categoriesSiblings = $catalogService->getChildCategories($currentCategory->getParentId(), $breadcrumbs, false, '', $locale);
        }

        $activeCategoriesIds = array_map(function($item) {
            return $item['id'];
        }, $breadcrumbs);

        $breadcrumbs = array_filter($breadcrumbs, function($entry) use ($uri) {
            return $entry['uri'] !== $uri;
        });
        $currency = $this->settingsService->getCurrency();

        return $this->render($this->getTemplateName('category', $contentType->getName()), [
            'currentCategory' => $currentCategory,
            'activeCategoriesIds' => $activeCategoriesIds,
            'currentPage' => $currentPage,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'currency' => $currency,
            'categoriesMenu' => $categoriesMenu,
            'listTemplate' => $listTemplate,
            'items' => $items,
            'priceFieldName' => $priceFieldName,
            'fields' => $fields,
            'fieldsAll' => $fieldsAll,
            'filters' => $filters,
            'categoriesSiblings' => $categoriesSiblings,
            'breadcrumbs' => $breadcrumbs,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]);
    }

    /**
     * @param null|Category $category
     * @param string $uri
     * @param string $locale
     * @param CatalogService $catalogService
     * @return Response
     */
    public function pageProduct(Category $category = null, $uri = '', $locale = '', CatalogService $catalogService)
    {
        $categoriesRepository = $this->getCategoriesRepository();
        list($pageAlias, $categoryUri) = Category::parseUri($uri);

        if (empty($category)) {
            $category = $categoriesRepository->find(0);
        }
        $contentType = $category ? $category->getContentType() : null;
        if(!$contentType){
            throw $this->createNotFoundException();
        }

        $localeDefault = $this->getParameter('locale');
        $collectionName = $contentType->getCollection();
        $contentTypeFields = $contentType->getFields();
        $priceFieldName = $contentType->getPriceFieldName();
        $collection = $this->getCollection($collectionName);
        $breadcrumbs = $categoriesRepository->getBreadcrumbs($categoryUri, false, $locale);

        $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
        $pipeline = $catalogService->createAggregatePipeline(
            [
                'name' => $pageAlias,
                'parentId' => $category->getId(),
                'isActive' => true
            ],
            $aggregateFields,
            1
        );

        $currentPage = $collection->aggregate($pipeline, [
            'cursor' => []
        ])->toArray();
        if (empty($currentPage)) {
            throw $this->createNotFoundException();
        }
        $currentPage = current($currentPage);
        $currentId = $currentPage['_id'];
        $currentPage['id'] = $currentId;

        // Get fields options
        $options = [
            'currentCategoryUri' => $category->getUri(),
            'systemNameField' => $contentType->getSystemNameField(),
            'needSortFields' => false
        ];
        list($filters, $fields) = $this->getFieldsData($contentTypeFields, $options);

        // Get categories menu
        $categoriesMenu = $this->getCategoriesMenu($category, $breadcrumbs, $locale);
        $currency = $this->settingsService->getCurrency();

        $activeCategoriesIds = array_map(function($item) {
            return $item['id'];
        }, $breadcrumbs);
        if ($category && $category->getId() === 0) {
            $activeCategoriesIds[] = 0 - $currentPage['id'];
        }

        return $this->render($this->getTemplateName('content-page', $contentType->getName()), [
            'currentCategory' => $category,
            'activeCategoriesIds' => $activeCategoriesIds,
            'currentPage' => $currentPage,
            'contentType' => $contentType,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'currency' => $currency,
            'categoriesMenu' => $categoriesMenu,
            'breadcrumbs' => $breadcrumbs,
            'fields' => $fields,
            'priceFieldName' => $priceFieldName
        ]);
    }

    /**
     * Get catalog default settings
     * @return array
     */
    public function getCatalogNavSettingsDefaults()
    {
        $catalogNavSettingsDefaults = [];
        $catalogNavSettingsDefaults['pageSizeArr'] = $this->getParameter('app.catalog_page_size');
        $catalogNavSettingsDefaults['orderBy'] = $this->getParameter('app.catalog_default_order_by');
        if (!is_array($catalogNavSettingsDefaults['pageSizeArr'])) {
            $catalogNavSettingsDefaults['pageSizeArr'] = explode(',', $catalogNavSettingsDefaults['pageSizeArr']);
            $catalogNavSettingsDefaults['pageSizeArr'] = array_map('trim', $catalogNavSettingsDefaults['pageSizeArr']);
            $catalogNavSettingsDefaults['pageSizeArr'] = array_map('intval', $catalogNavSettingsDefaults['pageSizeArr']);
        }
        return $catalogNavSettingsDefaults;
    }

    /**
     * @param $contentTypeFields
     * @param array $options
     * @param string $type
     * @param array $filtersArr
     * @param array $filtersData
     * @param array $queryOptions
     * @return array
     */
    public function getFieldsData($contentTypeFields, $options = [], $type = 'page', $filtersArr = [], $filtersData = [], $queryOptions = [])
    {
        $filters = [];
        $fields = [];
        $filterIndex = 0;
        $queryOptionsFilter = !empty($queryOptions['filter']) ? $queryOptions['filter'] : [];
        foreach ($contentTypeFields as $field) {
            if ($type != 'list' || !empty($field['showInList'])) {
                if (!isset($field['outputProperties']['chunkName'])) {
                    $field['outputProperties']['chunkName'] = '';
                }
                $fields[] = array_merge($field, [
                    'listOrder' => $field['listOrder'] ?? 0,
                    'outputProperties' => array_merge($field['outputProperties'], $options)
                ]);
            }
            if (!empty($field['isFilter'])) {
                if (!empty($filtersArr[$field['name']])) {
                    $filters[] = [
                        'name' => $field['name'],
                        'title' => $field['title'],
                        'outputType' => $field['outputType'],
                        'values' => $filtersArr[$field['name']],
                        'fieldValues' => $filtersArr[$field['name']],
                        'index' => $filterIndex,
                        'order' => !empty($field['filterOrder']) ? $field['filterOrder'] : 0,
                        'selected' => isset($queryOptionsFilter[$field['name']])
                            ? is_array($queryOptionsFilter[$field['name']])
                                ? $queryOptionsFilter[$field['name']]
                                : [$queryOptionsFilter[$field['name']]]
                            : []
                    ];
                    $filterIndex++;
                } else if (!empty($filtersData)) {
                    $fieldFilterData = array_filter($filtersData, function($item) use ($field) {
                        return $item['fieldName'] === $field['name'];
                    });
                    foreach ($fieldFilterData as $fData) {
                        $fValues = array_map(function($value) use ($fData) {
                            return $fData['name'] . '__' . $value;
                        }, $fData['values']);
                        $filters[] = [
                            'name' => $field['name'],
                            'title' => $fData['name'],
                            'outputType' => $field['outputType'],
                            'values' => $fData['values'],
                            'fieldValues' => $fValues,
                            'index' => $filterIndex,
                            'order' => !empty($field['filterOrder']) ? $field['filterOrder'] : 0,
                            'selected' => isset($queryOptionsFilter[$field['name']])
                                ? is_array($queryOptionsFilter[$field['name']])
                                    ? $queryOptionsFilter[$field['name']]
                                    : [$queryOptionsFilter[$field['name']]]
                                : []
                        ];
                        $filterIndex++;
                    }
                }
            }
        }

        usort($filters, function($a, $b) {
            if ($a['order'] == $b['order']) {
                return 0;
            }
            return ($a['order'] < $b['order']) ? -1 : 1;
        });

        if (!empty($options['needSortFields'])) {
            usort($fields, function($a, $b) {
                if ($a['listOrder'] == $b['listOrder']) {
                    return 0;
                }
                return ($a['listOrder'] < $b['listOrder']) ? -1 : 1;
            });
        }

        return [$filters, $fields];
    }

    /**
     * @param Category|null $currentCategory
     * @param array $breadcrumbs
     * @param string $locale
     * @return array
     */
    public function getCategoriesMenu(Category $currentCategory = null, $breadcrumbs = [], $locale = '')
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $categories = [];
        $currentId = $currentCategory ? $currentCategory->getId() : 0;
        $topIdsArr = [];
        $breadcrumbsUriArr = array_column($breadcrumbs, 'uri');
        if (!in_array($currentCategory->getUri(), $breadcrumbsUriArr)) {
            array_unshift($breadcrumbsUriArr, $currentCategory->getUri());
        }

        // Get top categories
        $results = $categoriesRepository->findBy([
            'parentId' => $currentId,
            'isActive' => true
        ], ['title' => 'asc']);
        /** @var Category $category */
        foreach ($results as $category) {
            $categories[] = $category->getMenuData($breadcrumbsUriArr, $locale);
            $topIdsArr[] = $category->getId();
        }

        // Get child categories
        $results = $categoriesRepository
            ->findActiveAll('title', 'asc', null, $topIdsArr);

        /** @var Category $category */
        foreach ($results as $category) {
            $index = array_search($category->getParentId(), $topIdsArr);
            if ($index !== false) {
                $categories[$index]['children'][] = $category->getMenuData($breadcrumbsUriArr, $locale);
            }
        }

        return $categories;
    }

    /**
     * @param array $treeData
     * @param array $uriArr
     * @param array $idsArr
     * @return array
     */
    public function getCategoriesActiveIds($treeData, $uriArr, $idsArr = [])
    {
        if (empty($treeData['children'])) {
            return $idsArr;
        }
        foreach ($treeData['children'] as $category) {
            if (in_array($category['uri'], $uriArr)) {
                $idsArr[] = $category['id'];
            }
            if (!empty($category['children'])) {
                $idsArr = $this->getCategoriesActiveIds($category, $uriArr, $idsArr);
            }
        }
        return $idsArr;
    }

    /**
     * @return CategoryRepository|ObjectRepository
     */
    public function getCategoriesRepository()
    {
        return $this->dm->getRepository(Category::class);
    }

    /**
     * @return ContentTypeRepository|ObjectRepository
     */
    public function getContentTypeRepository()
    {
        return $this->dm->getRepository(ContentType::class);
    }
}
