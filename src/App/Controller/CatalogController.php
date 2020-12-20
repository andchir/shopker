<?php

namespace App\Controller;

use App\Events;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Filter;
use App\MainBundle\Document\User;
use App\Repository\CategoryRepository;
use App\Repository\ContentTypeRepository;
use App\Service\CatalogService;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Persistence\ObjectRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\MainBundle\Document\Category;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment as TwigEnvironment;

class CatalogController extends BaseController
{

    /** @var SettingsService */
    protected $settingsService;
    /** @var CatalogService */
    protected $catalogService;
    /** @var TwigEnvironment */
    protected $twig;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        TranslatorInterface $translator,
        SettingsService $settingsService,
        CatalogService $catalogService,
        TwigEnvironment $twig
    )
    {
        parent::__construct($params, $dm, $translator);
        $this->settingsService = $settingsService;
        $this->catalogService = $catalogService;
        $this->twig = $twig;
    }
    
    /**
     * @Route(
     *     "/api/{_locale}/user_content/{categoryId}",
     *     name="user_content_create_api",
     *     requirements={"_locale"="^[a-z]{2}$"},
     *     condition="request.headers.get('Content-Type') === 'application/json'",
     *     methods={"POST"}
     * )
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param EventDispatcherInterface $eventDispatcher
     * @param Category $category
     * @return JsonResponse
     */
    public function createUserContentAction(Request $request, EventDispatcherInterface $eventDispatcher, Category $category = null)
    {
        if(!$category){
            return $this->setError($this->translator->trans('Category not found.', [], 'validators'));
        }
        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError($this->translator->trans('Content type not found.', [], 'validators'));
        }
        if (!$contentType->getIsCreateByUsersAllowed()) {
            return $this->setError($this->translator->trans('You are not allowed to create this page.', [], 'validators'));
        }
        
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);
    
        $collection = $this->catalogService->getCollection($contentType->getCollection());
        if (!$collection) {
            return $this->setError('Item not saved.');
        }

        try {
            $document = $this->catalogService->createContentItemData($category, $data, $user->getId());
        } catch (\Exception $e) {
            $msg = unserialize($e->getMessage());
            if (is_array($msg) && isset($msg['msg'])) {
                return $this->setError($this->translator->trans($msg['msg'], $msg, 'validators'));
            } else {
                return $this->setError($this->translator->trans($e->getMessage()));
            }
        }
    
        try {
            $result = $collection->insertOne($document);
        } catch (\Exception $e) {
            return $this->setError($this->translator->trans('Item not saved.'));
        }

        if (!$result || !$result->getInsertedCount()) {
            return $this->setError($this->translator->trans('Item not saved.'));
        }
    
        $event = new GenericEvent($document, ['contentType' => $contentType]);
        $eventDispatcher->dispatch($event, Events::PRODUCT_CREATED);
        $eventDispatcher->dispatch($event, Events::PRODUCT_UPDATED);
        
        return $this->json([
            'success' => true,
            'result' => $document
        ]);
    }

    /**
     * @Route(
     *     "/api/{_locale}/user_content/{categoryId}/{itemId}",
     *     name="user_content_update_api",
     *     requirements={"_locale"="^[a-z]{2}$"},
     *     condition="request.headers.get('Content-Type') === 'application/json'",
     *     methods={"PUT"}
     * )
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param EventDispatcherInterface $eventDispatcher
     * @param Category $category
     * @param int|string $itemId
     * @return JsonResponse
     */
    public function updateUserContentAction(Request $request, EventDispatcherInterface $eventDispatcher, Category $category = null, $itemId = 0)
    {
        if(!$category){
            return $this->setError($this->translator->trans('Category not found.', [], 'validators'));
        }

        /** @var User $user */
        $user = $this->getUser();

        try {
            $doc = $this->catalogService->getContentItem($category, [
                '_id' => (int) $itemId,
                'parentId' => $category->getId(),
                'userId' => $user->getId()
            ]);
        } catch (\Exception $e) {
            return $this->setError($this->translator->trans($e->getMessage()));
        }

        $contentType = $category->getContentType();
        $collection = $this->catalogService->getCollection($contentType->getCollection());

        $data = json_decode($request->getContent(), true);

        try {
            $document = $this->catalogService->createContentItemData($category, $data, $user->getId(), (int) $itemId);
        } catch (\Exception $e) {
            $msg = unserialize($e->getMessage());
            if (is_array($msg) && isset($msg['msg'])) {
                return $this->setError($this->translator->trans($msg['msg'], $msg, 'validators'));
            } else {
                return $this->setError($this->translator->trans($e->getMessage()));
            }
        }

        try {
            $result = $collection->updateOne(
                ['_id' => (int) $itemId],
                ['$set' => $document]
            );
        } catch (\Exception $e) {
            return $this->setError($this->translator->trans('Item not saved.'));
        }

        if (!$result || !$result->getModifiedCount()) {
            return $this->setError($this->translator->trans('Item not saved.'));
        }

        $event = new GenericEvent($document, ['contentType' => $contentType]);
        $eventDispatcher->dispatch($event, Events::PRODUCT_UPDATED);

        return $this->json([
            'success' => true,
            'result' => $document
        ]);
    }
    
    /**
     * @Route(
     *     "/api/{_locale}/user_content/{categoryId}/{itemId}",
     *     name="user_content_item_api",
     *     requirements={"_locale"="^[a-z]{2}$"},
     *     condition="request.headers.get('Content-Type') === 'application/json'",
     *     methods={"GET"}
     * )
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @param string|int $itemId
     * @return JsonResponse
     */
    public function getUserContentAction(Request $request, Category $category = null, $itemId = 0)
    {
        if(!$category){
            return $this->setError($this->translator->trans('Category not found.', [], 'validators'));
        }
        
        /** @var User $user */
        $user = $this->getUser();
        
        if ($itemId) {
    
            try {
                $document = $this->catalogService->getContentItem($category, [
                    '_id' => (int) $itemId,
                    'parentId' => $category->getId(),
                    'userId' => $user->getId()
                ]);
            } catch (\Exception $e) {
                return $this->setError($this->translator->trans($e->getMessage()));
            }
    
            return $this->json([
                'success' => true,
                'result' => $document
            ]);
            
        } else {
    
            $contentType = $category->getContentType();
            $collection = $this->catalogService->getCollection($contentType->getCollection());
    
            $queryString = $request->getQueryString();
            $queryOptions = UtilsService::getQueryOptions('', $queryString, $contentType->getFields());
            $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];
            
            $data = $this->catalogService->getContentList($contentType, $queryOptions, [
                'parentId' => $category->getId(),
                'userId' => $user->getId()
            ], $skip);
    
            $total = $collection->countDocuments([
                'parentId' => $category->getId(),
                'userId' => $user->getId()
            ]);
    
            return $this->json([
                'items' => $data,
                'total' => $total
            ]);
        }
    }
    
    /**
     * @Route(
     *     "/api/{_locale}/user_content/{categoryId}/{itemId}",
     *     name="user_content_delete_item_api",
     *     requirements={"_locale"="^[a-z]{2}$"},
     *     condition="request.headers.get('Content-Type') === 'application/json'",
     *     methods={"DELETE"}
     * )
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param EventDispatcherInterface $eventDispatcher
     * @param Category $category
     * @param string|int $itemId
     * @return JsonResponse
     */
    public function deleteUserContentAction(EventDispatcherInterface $eventDispatcher, Category $category, $itemId)
    {
        if(!$category){
            return $this->setError($this->translator->trans('Category not found.', [], 'validators'));
        }
    
        /** @var User $user */
        $user = $this->getUser();
        
        try {
            $document = $this->catalogService->getContentItem($category, [
                '_id' => (int) $itemId,
                'parentId' => $category->getId(),
                'userId' => $user->getId()
            ]);
        } catch (\Exception $e) {
            return $this->setError($this->translator->trans($e->getMessage()));
        }
    
        $contentType = $category->getContentType();
        $collection = $this->catalogService->getCollection($contentType->getCollection());
    
        try {
            $result = $collection->deleteOne([
                '_id' => (int) $itemId
            ]);
        } catch (\Exception $e) {
            $result = false;
        }
        
        if (empty($result) || !$result->getDeletedCount()) {
            return $this->setError($this->translator->trans('Deletion error. Please try again later.'));
        }
        
        // Dispatch event
        $event = new GenericEvent($document, ['contentType' => $contentType]);
        $eventDispatcher->dispatch($event, Events::PRODUCT_DELETED);
        $eventDispatcher->dispatch($event, Events::PRODUCT_UPDATED);
    
        return $this->json([
            'success' => true
        ]);
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
        if (empty($this->params->get('mongodb_database'))) {
            return $this->redirectToRoute('setup');
        }
        $localeDefault = $this->params->get('locale');
        $showAllChildren = $this->params->has('app.catalog_show_all_children')
            ? $this->params->get('app.catalog_show_all_children')
            : false;
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
        $collection = $this->catalogService->getCollection($contentType->getCollection());
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

        if ($showAllChildren && $currentCategory->getParentId()) {
            $categoriesIdsArr = $categoriesRepository->getChildrenIdsByUri($categoryUri);
        } else {
            $categoriesIdsArr = [$currentCategory->getId()];
        }
        $this->catalogService->applyCategoryFilter($categoriesIdsArr, $contentTypeFields, $criteria);
        if ($locale !== $localeDefault && $headerFieldName) {
            $this->catalogService->applyLocaleFilter($locale, $headerFieldName, $criteria);
        }
        $total = $collection->countDocuments($criteria);

        /* pages */
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, $catalogNavSettingsDefaults);
        $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);

        $pipeline = $this->catalogService->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            abs($queryOptions['limit']),
            $queryOptions['sortOptionsAggregation'],
            abs($pagesOptions['skip'])
        );
        $items = $collection->aggregate($pipeline, [
            'cursor' => []
        ])->toArray();

        $categoriesSiblings = [];
        if (count($categoriesMenu) === 0 && $levelNum > 1) {
            $categoriesSiblings = $this->catalogService->getChildCategories($currentCategory->getParentId(), $breadcrumbs, false, '', $locale);
        }

        $activeCategoriesIds = array_map(function($item) {
            return $item['id'];
        }, $breadcrumbs);

        $breadcrumbs = array_filter($breadcrumbs, function($entry) use ($uri) {
            return $entry['uri'] !== $uri;
        });
        $currency = $this->settingsService->getCurrency();

        return $this->render($this->getTemplateName($this->twig, 'category', $contentType->getName()), [
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

        $localeDefault = $this->params->get('locale');
        $collectionName = $contentType->getCollection();
        $contentTypeFields = $contentType->getFields();
        $priceFieldName = $contentType->getPriceFieldName();
        $collection = $this->catalogService->getCollection($collectionName);
        $breadcrumbs = $categoriesRepository->getBreadcrumbs($categoryUri, false, $locale);

        $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
        $pipeline = $this->catalogService->createAggregatePipeline(
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

        return $this->render($this->getTemplateName($this->twig, 'content-page', $contentType->getName()), [
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
        $catalogNavSettingsDefaults['pageSizeArr'] = $this->params->get('app.catalog_page_size');
        $catalogNavSettingsDefaults['orderBy'] = $this->params->get('app.catalog_default_order_by');
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
     * @param $filters
     * @param $filtersData
     * @param $criteria
     */
    public function applyFilters($filters, $filtersData, &$criteria)
    {
        if (empty($filters)) {
            return;
        }
        foreach ($filters as $name => $filter) {
            if (empty($filter)) {
                continue;
            }
            if (!is_array($filter)) {
                $filter = [$filter];
            }
            $index = array_search($name, array_column($filtersData, 'name'));
            $outputType = '';
            if ($index !== false) {
                $flt = $filtersData[$index];
                $outputType = $flt['outputType'];
                // Process color filter
                if ($outputType === 'color') {
                    foreach ($filter as &$val) {
                        $val = '#' . $val;
                    }
                }
            }
            if (isset($filter['from']) && isset($filter['to'])) {
                if ($outputType === 'date') {
                    if (!empty($filter['from'])) {
                        $criteria[$name] = ['$gte' => $filter['from']];
                    }
                    if (!empty($filter['to'])) {
                        if (!isset($criteria[$name])) {
                            $criteria[$name] = [];
                        }
                        $criteria[$name]['$lte'] = $filter['to'];
                    }
                } else {
                    $criteria[$name] = ['$gte' => floatval($filter['from']), '$lte' => floatval($filter['to'])];
                }
            } else if ($outputType === 'parameters') {
                $fData = [];
                foreach ($filter as $fValue) {
                    $fValueArr = explode('__', $fValue);
                    if (count($fValueArr) < 2) {
                        continue;
                    }
                    $index = array_search($fValueArr[0], array_column($fData, 'name'));
                    if ($index === false) {
                        $fData[] = [
                            'name' => $fValueArr[0],
                            'values' => []
                        ];
                        $index = count($fData) - 1;
                    }
                    if (!in_array($fValueArr[1], $fData[$index]['values'])) {
                        $fData[$index]['values'][] = $fValueArr[1];
                    }
                }
                if (!empty($fData)) {
                    $criteria[$name] = ['$all' => []];
                    foreach ($fData as $k => $v) {
                        $criteria[$name]['$all'][] = [
                            '$elemMatch' => [
                                'name' => $v['name'],
                                'value' => ['$in' => $v['values']]
                            ]
                        ];
                    }
                }
            } else {
                $criteria[$name] = ['$in' => $filter];
            }
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
