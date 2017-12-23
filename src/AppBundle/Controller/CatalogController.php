<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class CatalogController
 * @package AppBundle\Controller
 * @Route("/catalog")
 */
class CatalogController extends Controller
{
    /**
     * @Route("", name="catalog_home")
     */
    public function indexAction(Request $request)
    {

        return $this->render('catalog.html.twig', []);
    }

}
