<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Document\ContentType;

class ContentTypeController extends Controller
{

    /**
     * @Route("/app/content_type_list", name="content_type_get_list")
     * @Method({"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getList(Request $request)
    {
        $repository = $this->getRepository();
        $results = $repository->findAllOrderedByTitle();

        $data = [];
        /** @var ContentType $item */
        foreach ($results as $item) {
            $data[] = $item->toArray();
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @Route("/app/content_type", name="content_type_post")
     * @Method({"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function record(Request $request)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];
        if( empty($data['title']) || empty($data['name']) || empty($data['fields']) ){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Data is empty.'
            ]);
        }

        if( empty( $data['id'] ) ){
            $contentType = new ContentType();
        } else {
            $repository = $this->getRepository();
            $contentType = $repository->find( $data['id'] );
            if( !$contentType ){
                $contentType = new ContentType();
            }
        }
        $contentType
            ->setTitle( $data['title'] )
            ->setName( $data['name'] )
            ->setDescription( !empty($data['description']) ? $data['description'] : '' )
            ->setCollection( !empty($data['collection']) ? $data['collection'] : 'products' )
            ->setFields( $data['fields'] )
            ->setGroups( !empty($data['groups']) ? $data['groups'] : [] );

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist( $contentType );
        $dm->flush();

        return new JsonResponse([
            'success' => true,
            'data' => $contentType->toArray()
        ]);
    }

    /**
     * @Route("/app/content_type/{itemId}", name="content_type_delete")
     * @Method({"DELETE"})
     * @param Request $request
     * @param $itemId
     * @return JsonResponse
     */
    public function deleteItem(Request $request, $itemId)
    {
        $repository = $this->getRepository();

        /** @var ContentType $contentType */
        $contentType = $repository->find( $itemId );
        if( !$contentType ){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove( $contentType );
        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @Route("/app/content_type/{itemId}", name="content_type_get")
     * @Method({"GET"})
     * @param Request $request
     * @param $itemId
     * @return JsonResponse
     */
    public function getItem(Request $request, $itemId)
    {
        $repository = $this->getRepository();

        /** @var ContentType $contentType */
        $contentType = $repository->find( $itemId );
        if( !$contentType ){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        return new JsonResponse([
            'success' => true,
            'data' => $contentType->toArray(true)
        ]);
    }

    /**
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:ContentType');
    }

}