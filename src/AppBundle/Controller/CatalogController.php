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

class CatalogController extends Controller
{
    /**
     * @Route("/{uri}", name="catalog", requirements={"uri": "[a-z1-9\/-_\.]+"})
     * @param Request $request
     * @param string $uri
     * @return Response
     */
    public function catalogAction(Request $request, $uri)
    {



        return new Response($uri);
    }

//    /**
//     * @Route("/{route}", name="catalog")
//     */
//    public function catalogAction(Request $request, $route)
//    {
//        $categoriesRepository = $this->getCategoriesRepository();
//        $categoriesTopLevel = $this->getCategoriesTopLevel()->toArray(false);
//        $currentCategory = $categoriesRepository->findOneBy(['name' => $route]);
//
//        $childCategories = [];
//        if ($currentCategory) {
//            $childCategories = $categoriesRepository->findBy([
//                'parentId' => $currentCategory->getId()
//            ], ['title' => 'asc']);
//        }
//
//        return $this->render('catalog.html.twig', [
//            'categoriesTopLevel' => $categoriesTopLevel,
//            'currentCategory' => $currentCategory,
//            'currentName' => $route,
//            'childCategories' => $childCategories
//        ]);
//    }

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

}
