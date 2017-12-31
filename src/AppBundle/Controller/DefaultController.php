<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Document\ContentType;

class DefaultController extends CatalogController
{
    /**
     * @Route("/", name="homepage")
     */
    public function homepageAction()
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $categoriesTopLevel = $this->getCategoriesTopLevel()->toArray(false);

        // Get categorits count
        $countCategories = $categoriesRepository
            ->createQueryBuilder()
            ->getQuery()
            ->execute()
            ->count();

        // Get products count
        $productsController = new Admin\ProductController();
        $productsController->setContainer($this->container);
        $collection = $productsController->getCollection('products');
        $countProducts = $collection->count();

        // Get page description
        $description = '';
        /** @var Category $rootCategory */
        $rootCategory = $categoriesRepository->findOneBy(['name' => 'root']);
        if ($rootCategory) {
            $description = $rootCategory->getDescription();
        }

        return $this->render('homepage.html.twig', [
            'categoriesTopLevel' => $categoriesTopLevel,
            'currentUri' => 'home',
            'description' => $description,
            'countCategories' => $countCategories,
            'currentId' => 0,
            'countProducts' => $countProducts
        ]);
    }

    /**
     * @Route("/404", name="404")
     */
    public function pageNotFoundAction()
    {
        $categoriesTopLevel = $this->getCategoriesTopLevel()->toArray(false);

        return $this->render('404.html.twig', [
            'currentUri' => '404',
            'categoriesTopLevel' => $categoriesTopLevel
        ]);
    }

}
