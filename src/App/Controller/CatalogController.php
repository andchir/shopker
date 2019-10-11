<?php

namespace App\Controller;

use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Filter;
use App\Repository\CategoryRepository;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Doctrine\ODM\MongoDB\Cursor;
use Doctrine\ODM\MongoDB\Query\Builder as QueryBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\MainBundle\Document\Category;

class CatalogController extends ProductController
{
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
     * @return Response
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function catalogCategoryAction(Request $request, $uri)
    {
        return $this->catalogAction($request, $uri, 'catalog_category');
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
     * @return Response
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function catalogPageAction(Request $request, $uri)
    {
        return $this->catalogAction($request, $uri, 'catalog_page');
    }

    /**
     * @param Request $request
     * @param string $uri
     * @param string $routeName
     * @return Response
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function catalogAction(Request $request, $uri, $routeName)
    {
        if (empty($this->getParameter('mongodb_database'))) {
            return $this->redirectToRoute('setup');
        }
        $localeDefault = $this->getParameter('locale');
        $locale = $request->getLocale();
        $categoriesRepository = $this->getCategoriesRepository();
        $filtersRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Filter::class);
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
            return $this->pageProduct($currentCategory, $uri, $locale);
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
        $this->applyCategoryFilter($currentCategory, $contentTypeFields, $criteria);
        if ($locale !== $localeDefault && $headerFieldName) {
            $this->applyLocaleFilter($locale, $headerFieldName, $criteria);
        }
        $total = $collection->countDocuments($criteria);

        /* pages */
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, $catalogNavSettingsDefaults);
        $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);

        $pipeline = $this->createAggregatePipeline(
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
            $categoriesSiblings = $this->getChildCategories($currentCategory->getParentId(), $breadcrumbs, false, '', $locale);
        }

        $activeCategoriesIds = array_map(function($item) {
            return $item['id'];
        }, $breadcrumbs);

        $breadcrumbs = array_filter($breadcrumbs, function($entry) use ($uri) {
            return $entry['uri'] !== $uri;
        });
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $currency = $settingsService->getCurrency();

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
     * @return Response
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function pageProduct(Category $category = null, $uri = '', $locale = '')
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
        $pipeline = $this->createAggregatePipeline(
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
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $currency = $settingsService->getCurrency();

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
        $results = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class)
            ->field('parentId')->in($topIdsArr)
            ->field('isActive')->equals(true)
            ->sort('title', 'asc')
            ->getQuery()
            ->execute()
            ->toArray(false);

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
     * @param int|Category $parent
     * @param array $breadcrumbs
     * @param bool $getChildContent
     * @param string $currentUri
     * @param string $locale
     * @return array
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function getChildCategories($parent = 0, $breadcrumbs = [], $getChildContent = false, $currentUri = '', $locale = '')
    {
        $parentCategory = null;
        /** @var Category $parentCategory */
        if ($parent instanceof Category) {
            $parentCategory = $parent;
            $parentId = $parent->getId();
        } else {
            $parentId = $parent;
            $categoriesRepository = $this->getCategoriesRepository();
            $parentCategory = $parentId ? $categoriesRepository->find($parentId) : null;
        }
        unset($parent);

        $breadcrumbsUriArr = array_column($breadcrumbs, 'uri');
        if ($currentUri && !in_array($currentUri, $breadcrumbsUriArr)) {
            array_push($breadcrumbsUriArr, $currentUri);
        }

        $categories = [];
        /** @var QueryBuilder $query */
        $query = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class);

        $results = $query
            ->field('parentId')->equals($parentId)
            ->field('name')->notEqual('root')
            ->field('isActive')->equals(true)
            ->sort('title', 'asc')
            ->getQuery()
            ->execute();

        /** @var Category $category */
        foreach ($results as $category) {
            $categories[] = $category->getMenuData($breadcrumbsUriArr, $locale);
        }

        // Get category content
        if ($getChildContent && $parentCategory) {
            $childContent = $this->getCategoryContent($parentCategory, $breadcrumbsUriArr, $locale);
            $categories = array_merge($categories, $childContent);
        }
        array_multisort(
            array_column($categories, 'menuIndex'),  SORT_ASC,
            array_column($categories, 'title'), SORT_ASC,
            $categories
        );

        return $categories;
    }

    /**
     * @param Category $parentCategory
     * @param array $breadcrumbsUriArr
     * @param string $locale
     * @return array
     */
    public function getCategoryContent(Category $parentCategory, $breadcrumbsUriArr = [], $locale = '')
    {
        $categories = [];
        /** @var ContentType $contentType */
        $contentType = $parentCategory->getContentType();
        $collection = $this->getCollection($contentType->getCollection());
        $parentUri = $parentCategory->getUri();
        $items = $collection->find([
            'parentId' => $parentCategory->getId(),
            'isActive' => true
        ]);
        $systemNameField = $contentType->getSystemNameField();
        foreach ($items as $item) {
            $category = [
                'id' => $item['_id'],
                'title' => ContentType::getValueByLocale($item, $locale),
                'name' => $item[$systemNameField] ?? '',
                'description' => '',
                'uri' => !empty($item[$systemNameField]) ? $parentUri . $item[$systemNameField] : '',
                'href' => !empty($item['href']) ? $item['href'] : '',
                'menuIndex' => $item['menuIndex'] ?? 0,
                'translations' => $item['translations'] ?? [],
                'children' => []
            ];
            $category['isActive'] = in_array($category['uri'], $breadcrumbsUriArr);
            $categories[] = $category;
        }
        return $categories;
    }

    /**
     * @param int $parentId
     * @param string $locale
     * @return array
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function getCategoriesTree($parentId = 0, $locale = '')
    {
        $data = [];
        $categoriesRepository = $this->getCategoriesRepository();
        /** @var Category $parentCategory */
        $parentCategory = $categoriesRepository->find($parentId);
        if ($parentId && !$parentCategory) {
            return [];
        }

        $query = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class);

        $results = $query
            ->field('name')->notEqual('root')
            ->field('isActive')->equals(true)
            ->sort('menuIndex', 'asc')
            ->getQuery()
            ->execute();

        $parentIdsArr = [$parentId];
        /** @var Category $category */
        foreach ($results as $category) {
            $pId = $category->getParentId();
            if (!in_array($category->getId(), $parentIdsArr)) {
                $parentIdsArr[] = $category->getId();
            }
            if (!isset($data[$pId])) {
                $data[$pId] = [];
            }
            $data[$pId][] = $category->getMenuData([], $locale);
        }

        $childContent = $parentCategory ? $this->getCategoryContent($parentCategory, [], $locale) : [];

        // Content pages (not categories)
        if (!empty($childContent)) {
            foreach ($childContent as $content) {
                $content['id'] = 0 - $content['id'];// This is not categories
                $data[0][] = $content;
            }
            array_multisort(
                array_column($data[0], 'menuIndex'),  SORT_ASC,
                array_column($data[0], 'title'), SORT_ASC,
                $data[0]
            );
        }

        if (empty($data)) {
            return [];
        }

        if (!$parentId) {
            return self::createTree($data, [[
                'id' => 0,
                'title' => 'Root'
            ]]);
        }
        else {
            return self::createTree($data, [$parentCategory->getMenuData([], $locale)]);
        }
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
     * @param $criteria
     * @param $aggregateFields
     * @param $limit
     * @param $sort
     * @param $skip
     * @return array
     */
    public function createAggregatePipeline($criteria, $aggregateFields, $limit = 1, $sort = [], $skip = 0)
    {
        $pipeline = [['$match' => $criteria]];
        if (!empty($aggregateFields)) {
            $pipeline[] = ['$addFields' => $aggregateFields];
        }
        if (!empty($sort)) {
            $pipeline[] = ['$sort' => $sort];
        }
        if (!empty($skip)) {
            $pipeline[] = ['$skip' => $skip];
        }
        if (!empty($limit)) {
            $pipeline[] = ['$limit' => $limit];
        }
        return $pipeline;
    }

    /**
     * @return CategoryRepository
     */
    public function getCategoriesRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
    }

    /**
     * @return \App\Repository\ContentTypeRepository
     */
    public function getContentTypeRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class);
    }
}
