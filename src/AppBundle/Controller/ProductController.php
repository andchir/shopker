<?php

namespace AppBundle\Controller;

use AppBundle\Document\Product;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProductController extends Controller
{

    /**
     * @Route("/app/product", name="product_post")
     * @Method({"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createItem( Request $request )
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        var_dump( $data );


        $output = [
            'success' => true,
            'data' => []
        ];

        return new JsonResponse( $output );
    }

}