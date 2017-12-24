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
    public function indexAction()
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
        $productsController = new ProductController();
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
            'currentName' => 'home',
            'description' => $description,
            'countCategories' => $countCategories,
            'countProducts' => $countProducts
        ]);
    }

}
