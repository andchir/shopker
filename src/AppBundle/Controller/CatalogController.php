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
        list($pageAlias, $categoryUri) = self::parseUri($uri);

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
        $categoriesTopLevel = $this->getCategoriesTopLevel()->toArray(false);

        $childCategories = $categoriesRepository->findBy([
            'parentId' => $currentCategory->getId()
        ], ['title' => 'asc']);

        return $this->render('catalog.html.twig', [
            'categoriesTopLevel' => $categoriesTopLevel,
            'currentCategory' => $currentCategory,
            'currentPage' => $currentPage,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'childCategories' => $childCategories
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
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $categoriesTopLevel = $this->getCategoriesTopLevel()->toArray(false);
        $childCategories = $categoriesRepository->findBy([
            'parentId' => $category->getId()
        ], ['title' => 'asc']);

        $currentPage = $collection->findOne([
            'name' => $pageAlias,
            'parentId' => $category->getId()
        ]);
        if (!$currentPage) {
            throw $this->createNotFoundException();
        }
        $currentId = $currentPage['_id'];
        $currentPage['id'] = $currentId;

        return $this->render('catalog-product.html.twig', [
            'categoriesTopLevel' => $categoriesTopLevel,
            'currentCategory' => $category,
            'currentPage' => $currentPage,
            'currentId' => $currentId,
            'currentUri' => $uri,
            'childCategories' => $childCategories
        ]);
    }

    /**
     * @return Cursor
     */
    public function getCategoriesTopLevel()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->createQueryBuilder(Category::class)
            ->field('parentId')->equals(0)
            ->field('name')->notEqual('root')
            ->sort('title', 'asc')
            ->getQuery()
            ->execute();
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
        return [$pageAlias, $parentUri];
    }

}
