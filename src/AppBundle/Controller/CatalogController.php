<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Document\Category;

class CatalogController extends Controller
{
    /**
     * @Route("/{name}", name="catalog")
     */
    public function catalogAction(Request $request, $name)
    {
        $categoriesTopLevel = $this->getCategoriesTopLevel();

        return $this->render('catalog.html.twig', [
            'categoriesTopLevel' => $categoriesTopLevel,
            'currentName' => $name
        ]);
    }

    public function getCategoriesTopLevel()
    {
        $categoriesRepository = $this->getCategoriesRepository();
        return $categoriesRepository->findBy([
            'parentId' => 0
        ], ['id' => 'asc']);
    }

    public function getCategoriesRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
    }

}
