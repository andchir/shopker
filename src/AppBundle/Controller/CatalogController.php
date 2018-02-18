<?php

namespace AppBundle\Controller;

use AppBundle\Document\Filter;
use AppBundle\Repository\CategoryRepository;
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
     * @Route("/{uri}", name="catalog", requirements={"uri": "[a-z1-9\/\-_\.]+"})
     * @param Request $request
     * @param string $uri
     * @return Response
     */
    public function catalogAction(Request $request, $uri)
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $filtersRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Filter::class);
        list($pageAlias, $categoryUri, $levelNum) = Category::parseUri($uri);

        /** @var Category $currentCategory */
        $currentCategory = $categoriesRepository->findOneBy(['uri' => $categoryUri]);
        if (!$currentCategory) {
            throw $this->createNotFoundException();
        }

        if ($pageAlias) {
            return $this->pageProduct($currentCategory, $uri);
        }

        $listTemplate = $request->cookies->get('shkListType', 'grid');
        $pageSizeArr = $this->getParameter('catalog_page_size');
        $currentPage = $currentCategory;
        $currentId = $currentCategory->getId();

        list($breadcrumbs, $breadcrumbsIds) = $categoriesRepository->getBreadcrumbs($categoryUri);
        $categoriesTopLevel = $this->getChildCategories(0, $breadcrumbsIds);
        $categoriesMenu = $this->getCategoriesMenu($currentCategory, $breadcrumbsIds);

        $contentType = $currentCategory->getContentType();
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());
        $queryString = $request->getQueryString();
        $queryOptions = $this->getQueryOptions($queryString, $contentType, $pageSizeArr);

        $options = [
            'currentCategoryUri' => $currentCategory->getUri(),
            'systemNameField' => $this->getSystemNameField($contentTypeFields)
        ];
        $filtersData = [];
        /** @var Filter $filters */
        $filters = $filtersRepository->findByCategory($currentCategory->getId());
        if (!empty($filters)) {
            $filtersData = $filters->getValues();
        }
        list($filters, $fields) = $this->getFieldsData($request, $contentTypeFields,'list', $filtersData, $options, $queryOptions);

        // Get child products
        $criteria = [
            'parentId' => $currentCategory->getId()
        ];
        $this->applyFilters($queryOptions['filter'], $filters, $criteria);

        $total = $collection->find($criteria)->count();

        /* pages */
        $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];
        $pagesOptions = $this->getPagesoptions($queryOptions, $total, $pageSizeArr);

        $items = $collection->find($criteria)
            ->sort([$queryOptions['sort_by'] => $queryOptions['sort_dir']])
            ->skip($skip)
            ->limit($queryOptions['limit']);

        $categoriesSiblings = [];
        if (count($categoriesMenu) === 0 && $levelNum > 1) {
            $categoriesSiblings = $this->getChildCategories($currentCategory->getParentId(), $breadcrumbsIds);
        }

        return $this->render('catalog.html.twig', [
            'currentCategory' => $currentCategory,
            'currentPage' => $currentPage,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'categoriesMenu' => $categoriesMenu,
            'listTemplate' => $listTemplate,
            'items' => $items,
            'fields' => $fields,
            'filters' => $filters,
            'categoriesTopLevel' => $categoriesTopLevel,
            'categoriesSiblings' => $categoriesSiblings,
            'breadcrumbs' => $breadcrumbs,
            'breadcrumbsIds' => $breadcrumbsIds,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]);
    }

    /**
     * @param Category $category
     * @param string $uri
     * @return Response
     */
    public function pageProduct(Category $category, $uri = '')
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $contentType = $category->getContentType();
        if(!$contentType){
            throw $this->createNotFoundException();
        }
        list($pageAlias, $categoryUri) = Category::parseUri($uri);
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());
        list($breadcrumbs, $breadcrumbsIds) = $categoriesRepository->getBreadcrumbs($categoryUri, false);

        $categoriesTopLevel = $this->getChildCategories(0, $breadcrumbsIds);

        $currentPage = $collection->findOne([
            'name' => $pageAlias,
            'parentId' => $category->getId()
        ]);
        if (!$currentPage) {
            throw $this->createNotFoundException();
        }
        $currentId = $currentPage['_id'];
        $currentPage['id'] = $currentId;

        // Get fields options
        $fields = [];
        $options = [
            'currentCategoryUri' => $category->getUri(),
            'systemNameField' => $this->getSystemNameField($contentTypeFields)
        ];
        foreach ($contentTypeFields as $field) {
            if (!empty($field)) {
                if (!isset($field['outputProperties']['chunkName'])) {
                    $field['outputProperties']['chunkName'] = '';
                }
                $fields[] = [
                    'name' => $field['name'],
                    'type' => $field['outputType'],
                    'properties' => array_merge($field['outputProperties'], $options)
                ];
            }
        }

        // Get categories menu
        $categoriesMenu = $this->getCategoriesMenu($category, $breadcrumbsIds);

        return $this->render('catalog-product.html.twig', [
            'categoriesTopLevel' => $categoriesTopLevel,
            'currentCategory' => $category,
            'currentPage' => $currentPage,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'categoriesMenu' => $categoriesMenu,
            'breadcrumbs' => $breadcrumbs,
            'breadcrumbsIds' => $breadcrumbsIds,
            'fields' => $fields
        ]);
    }

    /**
     * @param Request $request
     * @param $contentTypeFields
     * @param $type
     * @param array $filtersData
     * @param array $options
     * @param array $queryOptions
     * @return array
     */
    public function getFieldsData(Request $request, $contentTypeFields, $type, $filtersData = [], $options = [], $queryOptions = [])
    {
        $filters = [];
        $fields = [];
        $queryOptionsFilter = !empty($queryOptions['filter']) ? $queryOptions['filter'] : [];
        foreach ($contentTypeFields as $field) {
            if (!empty($field['showInList'])) {
                $fields[] = [
                    'name' => $field['name'],
                    'type' => $field['outputType'],
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
     * @param array $breadcrumbsIds
     * @return array
     */
    public function getCategoriesMenu(Category $currentCategory = null, $breadcrumbsIds = [])
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $categories = [];
        $currentId = $currentCategory ? $currentCategory->getId() : 0;

        $topIdsArr = [];

        // Get top categories
        $results = $categoriesRepository->findBy([
            'parentId' => $currentId
        ], ['title' => 'asc']);
        /** @var Category $category */
        foreach ($results as $category) {
            $categories[] = $category->getMenuData($breadcrumbsIds);
            $topIdsArr[] = $category->getId();
        }

        // Get child categories
        $results = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class)
            ->field('parentId')->in($topIdsArr)
            ->sort('title', 'asc')
            ->getQuery()
            ->execute()
            ->toArray(false);

        /** @var Category $category */
        foreach ($results as $category) {
            $index = array_search($category->getParentId(), $topIdsArr);
            if ($index !== false) {
                $categories[$index]['children'][] = $category->getMenuData($breadcrumbsIds);
            }
        }

        return $categories;
    }

    /**
     * @param array $breadcrumbsIds
     * @return array
     */
    public function getChildCategories($parentId = 0, $breadcrumbsIds = [])
    {
        $categories = [];
        $query = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class);

        if ($parentId) {
            $query = $query
                ->field('parentId')->equals($parentId);
        } else {
            $query = $query
                ->field('parentId')->equals(0)
                ->field('name')->notEqual('root');
        }

        $results = $query
            ->sort('title', 'asc')
            ->getQuery()
            ->execute();

        /** @var Category $category */
        foreach ($results as $category) {
            $categories[] = $category->getMenuData($breadcrumbsIds);
        }
        return $categories;
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

}
