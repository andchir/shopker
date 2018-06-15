<?php

namespace AppBundle\Controller;

use AppBundle\Document\ContentType;
use AppBundle\Document\Filter;
use AppBundle\Repository\CategoryRepository;
use AppBundle\Service\UtilsService;
use Doctrine\ODM\MongoDB\Cursor;
use Doctrine\ODM\MongoDB\DocumentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Document\Category;

class CatalogController extends ProductController
{
    /**
     * @Route("/{uri}", name="catalog", requirements={"uri": "[a-z0-9\/\-_\.]+"})
     * @param Request $request
     * @param string $uri
     * @return Response
     */
    public function catalogAction(Request $request, $uri)
    {
        if (empty($this->getParameter('mongodb_database'))
            || empty($this->getParameter('mongodb_user'))) {
                return $this->redirectToRoute('setup');
        }
        $categoriesRepository = $this->getCategoriesRepository();
        $filtersRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Filter::class);
        list($pageAlias, $categoryUri, $levelNum) = Category::parseUri($uri);

        /** @var Category $currentCategory */
        if ($categoryUri) {
            $currentCategory = $categoriesRepository->findOneBy([
                'uri' => $categoryUri,
                'isActive' => true
            ]);
        } else {
            $currentCategory = $categoriesRepository->find(0);
        }

        if ($pageAlias) {
            return $this->pageProduct($currentCategory, $uri);
        }
        if (!$currentCategory) {
            throw $this->createNotFoundException();
        }

        $listTemplate = $request->cookies->get('shkListType', 'grid');
        $pageSizeArr = $this->getParameter('catalog_page_size');
        $currentPage = $currentCategory;
        $currentId = $currentCategory->getId();

        $breadcrumbs = $categoriesRepository->getBreadcrumbs($categoryUri, false);
        $categoriesMenu = $this->getCategoriesMenu($currentCategory, $breadcrumbs);

        $contentType = $currentCategory->getContentType();
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());
        $queryString = $request->getQueryString();
        $queryOptions = $this->getQueryOptions($queryString, $contentType, $pageSizeArr);

        $options = [
            'currentCategoryUri' => $currentCategory->getUri(),
            'systemNameField' => $contentType->getSystemNameField()
        ];
        $filtersData = [];
        /** @var Filter $filters */
        $filters = $filtersRepository->findByCategory($currentCategory->getId());
        if (!empty($filters)) {
            $filtersData = $filters->getValues();
        }
        list($filters, $fieldsAll) = $this->getFieldsData($contentTypeFields, $options,'page', $filtersData, $queryOptions);
        $fields = array_filter($fieldsAll, function($v) {
            return $v['showInList'];
        });

        // Get child products
        $criteria = [
            'parentId' => $currentCategory->getId(),
            'isActive' => true
        ];
        $this->applyFilters($queryOptions['filter'], $filters, $criteria);

        $total = $collection->find($criteria)->count();

        /* pages */
        $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, $pageSizeArr);

        $items = $collection->find($criteria)
            ->sort($queryOptions['sortOptions'])
            ->skip($skip)
            ->limit($queryOptions['limit']);

        $categoriesSiblings = [];
        if (count($categoriesMenu) === 0 && $levelNum > 1) {
            $categoriesSiblings = $this->getChildCategories($currentCategory->getParentId(), $breadcrumbs);
        }

        $breadcrumbs = array_filter($breadcrumbs, function($entry) use ($uri) {
            return $entry['uri'] !== $uri;
        });

        return $this->render($this->getTemplateName('catalog', $contentType->getName()), [
            'currentCategory' => $currentCategory,
            'currentPage' => $currentPage,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'categoriesMenu' => $categoriesMenu,
            'listTemplate' => $listTemplate,
            'items' => $items,
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
     * @return Response
     */
    public function pageProduct(Category $category = null, $uri = '')
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

        $collectionName = $contentType->getCollection();
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($collectionName);
        $breadcrumbs = $categoriesRepository->getBreadcrumbs($categoryUri, false);

        $currentPage = $collection->findOne([
            'name' => $pageAlias,
            'parentId' => $category->getId(),
            'isActive' => true
        ]);
        if (!$currentPage) {
            throw $this->createNotFoundException();
        }
        $currentId = $currentPage['_id'];
        $currentPage['id'] = $currentId;

        // Get fields options
        $options = [
            'currentCategoryUri' => $category->getUri(),
            'systemNameField' => $contentType->getSystemNameField()
        ];
        list($filters, $fields) = $this->getFieldsData($contentTypeFields, $options);

        // Get categories menu
        $categoriesMenu = $this->getCategoriesMenu($category, $breadcrumbs);

        return $this->render($this->getTemplateName('product-page', $contentType->getName()), [
            'currentCategory' => $category,
            'currentPage' => $currentPage,
            'contentType' => $contentType,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'categoriesMenu' => $categoriesMenu,
            'breadcrumbs' => $breadcrumbs,
            'fields' => $fields
        ]);
    }

    /**
     * @param $contentTypeFields
     * @param array $options
     * @param $type
     * @param array $filtersData
     * @param array $queryOptions
     * @return array
     */
    public function getFieldsData($contentTypeFields, $options = [], $type = 'page', $filtersData = [], $queryOptions = [])
    {
        $filters = [];
        $fields = [];
        $queryOptionsFilter = !empty($queryOptions['filter']) ? $queryOptions['filter'] : [];
        foreach ($contentTypeFields as $field) {
            if ($type != 'list' || !empty($field['showInList'])) {
                if (!isset($field['outputProperties']['chunkName'])) {
                    $field['outputProperties']['chunkName'] = '';
                }
                $fields[] = [
                    'name' => $field['name'],
                    'title' => $field['title'],
                    'description' => $field['description'],
                    'type' => $field['outputType'],
                    'showInList' => $field['showInList'],
                    'properties' => array_merge($field['outputProperties'], $options)
                ];
            }
            if (!empty($field['isFilter']) && !empty($filtersData[$field['name']])) {
                $filters[] = [
                    'name' => $field['name'],
                    'title' => $field['title'],
                    'outputType' => $field['outputType'],
                    'values' => $filtersData[$field['name']],
                    'selected' => isset($queryOptionsFilter[$field['name']])
                        ? is_array($queryOptionsFilter[$field['name']])
                            ? $queryOptionsFilter[$field['name']]
                            : [$queryOptionsFilter[$field['name']]]
                        : []
                ];
            }
        }
        return [$filters, $fields];
    }

    /**
     * @param Category|null $currentCategory
     * @param array $breadcrumbs
     * @return array
     */
    public function getCategoriesMenu(Category $currentCategory = null, $breadcrumbs = [])
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
            $categories[] = $category->getMenuData($breadcrumbsUriArr);
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
                $categories[$index]['children'][] = $category->getMenuData($breadcrumbsUriArr);
            }
        }

        return $categories;
    }

    /**
     * @param int|Category $parent
     * @param array $breadcrumbs
     * @param bool $getChildContent
     * @param string $currentUri
     * @return array
     */
    public function getChildCategories($parent = 0, $breadcrumbs = [], $getChildContent = false, $currentUri = '')
    {
        $parentCategory = null;
        /** @var Category $parentCategory */
        if ($parent instanceof Category) {
            $parentCategory = $parent;
            $parentId = $parent->getId();
        } else {
            $parentId = $parent;
            $categoriesRepository = $this->getCategoriesRepository();
            $parentCategory = $categoriesRepository->find($parentId);
        }
        unset($parent);

        $breadcrumbsUriArr = array_column($breadcrumbs, 'uri');
        if ($currentUri && !in_array($currentUri, $breadcrumbsUriArr)) {
            array_push($breadcrumbsUriArr, $currentUri);
        }

        $categories = [];
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
            $categories[] = $category->getMenuData($breadcrumbsUriArr);
        }

        // Get category content
        if ($getChildContent && $parentCategory) {
            $childContent = $this->getCategoryContent($parentCategory, $breadcrumbsUriArr);
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
     * @return array
     */
    public function getCategoryContent(Category $parentCategory, $breadcrumbsUriArr = [])
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
                'title' => !empty($item['title']) ? $item['title'] : '',
                'name' => !empty($item[$systemNameField]) ? $item[$systemNameField] : '',
                'description' => '',
                'uri' => !empty($item[$systemNameField])
                    ? $parentUri . $item[$systemNameField]
                    : '',
                'menuIndex' => !empty($item['menuIndex']) ? $item['menuIndex'] : 0,
                'children' => []
            ];
            $category['isActive'] = in_array($category['uri'], $breadcrumbsUriArr);
            $categories[] = $category;
        }
        return $categories;
    }

    /**
     * @param int $parentId
     * @return array
     */
    public function getCategoriesTree($parentId)
    {
        $output = [];
        $data = [];
        $uri = '';
        $categoriesRepository = $this->getCategoriesRepository();
        /** @var Category $parentCategory */
        $parentCategory = $categoriesRepository->find(0);
        $childContent = $parentCategory ? $this->getCategoryContent($parentCategory) : [];

        $query = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class);

        $results = $query
            ->field('name')->notEqual('root')
            ->field('isActive')->equals(true)
            ->sort('menuIndex', 'asc')
            ->sort('title', 'asc')
            ->getQuery()
            ->execute();

        /** @var Category $category */
        foreach ($results as $category) {
            $parentId = $category->getParentId();
            if (!isset($data[$parentId])) {
                $data[$parentId] = [];
            }
            $data[$parentId][] = $category->getMenuData();
        }

        if (!empty($childContent)) {
            foreach ($childContent as $content) {
                $content['id'] = -1;// This is not categories
                $data[0][] = $content;
            }
            array_multisort(
                array_column($data[0], 'menuIndex'),  SORT_ASC,
                array_column($data[0], 'title'), SORT_ASC,
                $data[0]
            );
        }

        return self::createTree($data, [[
            'id' => 0,
            'title' => 'Root'
        ]]);
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
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getContentTypeRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class);
    }

}
