<?php

namespace AppBundle\Controller;

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
        list($pageAlias, $categoryUri, $levelNum) = self::parseUri($uri);

        /** @var Category $currentCategory */
        $currentCategory = $categoriesRepository->findOneBy(['uri' => $categoryUri]);
        if (!$currentCategory) {
            throw $this->createNotFoundException();
        }

        if ($pageAlias) {
            return $this->pageProduct($currentCategory, $pageAlias, $uri);
        }

        $currentPage = $currentCategory;
        $currentId = $currentCategory->getId();

        list($breadcrumbs, $breadcrumbsIds) = $this->getBreadcrumbs($categoryUri);
        $categoriesTopLevel = $this->getChildCategories(0, $breadcrumbsIds);
        $categoriesMenu = $this->getCategoriesMenu($currentCategory, $breadcrumbsIds);

        $contentType = $currentCategory->getContentType();
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());
        $queryString = $request->getQueryString();
        $queryOptions = $this->getQueryOptions($queryString, $contentType);
        $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];

        // Get fields names
        $fields = [];
        foreach ($contentTypeFields as $field) {
            if (!empty($field)) {
                $fields[] = [
                    'name' => $field['name'],
                    'type' => $field['outputType'],
                    'outputProperties' => $field['outputProperties']
                ];
            }
        }

        // Get child products
        $items = $collection->find([
            'parentId' => $currentCategory->getId()
        ])
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
            'items' => $items,
            'fields' => $fields,
            'categoriesTopLevel' => $categoriesTopLevel,
            'categoriesSiblings' => $categoriesSiblings,
            'breadcrumbs' => $breadcrumbs,
            'breadcrumbsIds' => $breadcrumbsIds
        ]);
    }

    /**
     * @param Category $category
     * @param $pageAlias
     * @param string $uri
     * @return Response
     */
    public function pageProduct(Category $category, $pageAlias, $uri = '')
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $contentType = $category->getContentType();
        if(!$contentType){
            throw $this->createNotFoundException();
        }
        list($pageAlias, $categoryUri) = self::parseUri($uri);
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());
        list($breadcrumbs, $breadcrumbsIds) = $this->getBreadcrumbs($categoryUri, false);

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
            'breadcrumbsIds' => $breadcrumbsIds
        ]);
    }

    /**
     * @param $categoryUri
     * @param bool $pop
     * @return array
     */
    public function getBreadcrumbs($categoryUri, $pop = true)
    {
        if (empty($categoryUri)) {
            return [];
        }
        $breadcrumbs = [];
        $breadcrumbsIds = [];
        $categoryUri = trim($categoryUri, '/');
        $categoryUriArr = explode('/', $categoryUri);

        $categories = $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class)
            ->field('name')->in($categoryUriArr)
            ->sort('title', 'asc')
            ->getQuery()
            ->execute()
            ->toArray(false);

        /** @var Category $crumb */
        $crumb = $this->findOne($categories, 'parentId', 0);
        if ($crumb) {
            $breadcrumbsIds[] = $crumb->getId();
        }
        while (!empty($crumb)) {
            $breadcrumbs[] = $crumb->getMenuData();
            $crumb = $this->findOne($categories, 'parentId', $crumb->getId());
            if ($crumb) {
                $breadcrumbsIds[] = $crumb->getId();
            }
        }

        if (!empty($breadcrumbs) && $pop) {
            array_pop($breadcrumbs);
        }
        return [$breadcrumbs, $breadcrumbsIds];
    }

    /**
     * @param array $items
     * @param string $key
     * @param string $value
     * @return null | mixed
     */
    public function findOne($items, $key, $value)
    {
        $result = null;
        foreach ($items as $item) {
            $method = 'get' . ucfirst($key);
            if (method_exists($item, $method)) {
                $curVal = call_user_func([$item, $method]);
                if ($curVal === $value) {
                    $result = $item;
                    break;
                }
            }
        }
        return $result;
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

    /**
     * @param string $uri
     * @return array
     */
    public static function parseUri($uri)
    {
        if (strrpos($uri, '/') === false) {
            $pageAlias = $uri;
        } else {
            $pageAlias = strrpos($uri, '/') < strlen($uri) - 1
                ? substr($uri, strrpos($uri, '/')+1)
                : '';
        }
        $parentUri = strrpos($uri, '/') !== false
            ? substr($uri, 0, strrpos($uri, '/')+1)
            : '';
        $levelNum = substr_count($parentUri, '/');
        return [$pageAlias, $parentUri, $levelNum];
    }

}
