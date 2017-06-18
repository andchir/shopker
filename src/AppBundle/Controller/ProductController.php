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
     * @Route("/app/products_list/{categoryId}", name="product_list")
     * @Method({"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getList( Request $request, $categoryId )
    {
        $repository = $this->getRepository();
        $results = $repository->findAll($categoryId);

        $data = [];
        /** @var Product $item */
        foreach ($results as $item) {
            $data[] = $item->toArray();
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

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

        $product = new Product();
        $product
            ->setParentId( !empty($data['parent_id']) ? $data['parent_id'] : 0 )
            ->setName( !empty($data['name']) ? $data['name'] : '' )
            ->setTitle( !empty($data['title']) ? $data['title'] : 'Untitled' )
            ->setPrice( !empty($data['price']) ? $data['price'] : 0 )
            ->setDescription( !empty($data['description']) ? $data['description'] : '' );

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist( $product );
        $dm->flush();

        $output = [
            'success' => true,
            'data' => $product->toArray()
        ];

        return new JsonResponse( $output );
    }

    /**
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Product');
    }

}