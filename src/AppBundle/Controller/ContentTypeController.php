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
    public function getList( Request $request )
    {
        $repository = $this->getRepository();
        $results = $repository->findAllOrderedByTitle();
        $full = !empty( $request->get('full') ) ? true : false;

        $data = [];
        /** @var ContentType $item */
        foreach ($results as $item) {
            $data[] = $item->toArray( $full );
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @param $data
     * @param string $itemId
     * @return array
     */
    public function validateData( $data, $itemId = '' )
    {
        if( empty($data) ){
            return ['success' => false, 'msg' => 'Data is empty.'];
        }
        if( empty($data['title']) ){
            return ['success' => false, 'msg' => 'Title is empty.'];
        }
        if( empty($data['name']) ){
            return ['success' => false, 'msg' => 'System name is empty.'];
        }
        if( empty($data['collection']) ){
            return ['success' => false, 'msg' => 'Collection name is empty.'];
        }
        if( empty($data['fields']) ){
            return ['success' => false, 'msg' => 'Please create fields for content type.'];
        }

        //Check unique name
        $repository = $this->getRepository();
        $query = $repository->createQueryBuilder()
            ->field('name')->equals($data['name']);

        if( $itemId ){
            $query = $query->field('id')->notEqual( $itemId );
        }

        $count = $query->getQuery()
            ->execute()
            ->count();

        if( $count > 0 ){
            return ['success' => false, 'msg' => 'System name already exists.'];
        }

        return ['success' => true];
    }

    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return array
     */
    public function createUpdate( $data, $itemId = '' )
    {
        if( empty($data) || empty($data['title']) || empty($data['name']) || empty($data['fields']) ){
            return [
                'success' => false,
                'msg' => 'Data is empty.'
            ];
        }

        if( !$itemId ){
            $contentType = new ContentType();
        } else {
            $repository = $this->getRepository();
            $contentType = $repository->find( $itemId );
            if( !$contentType ){
                $contentType = new ContentType();
            }
        }
        $contentType
            ->setTitle( $data['title'] )
            ->setName( $data['name'] )
            ->setDescription( isset($data['description']) ? $data['description'] : '' )
            ->setCollection( isset($data['collection']) ? $data['collection'] : 'products' )
            ->setFields( $data['fields'] )
            ->setGroups( isset($data['groups']) ? $data['groups'] : [] )
            ->setIsActive( isset($data['is_active']) ? $data['is_active'] : true );

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist( $contentType );
        $dm->flush();

        return [
            'success' => true,
            'data' => $contentType->toArray()
        ];
    }

    /**
     * @Route("/app/content_type", name="content_type_post")
     * @Method({"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createItem( Request $request )
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData( $data );
        if( !$output['success'] ){
            return new JsonResponse( $output );
        }

        $output = $this->createUpdate( $data );

        return new JsonResponse( $output );
    }

    /**
     * @Route("/app/content_type/{itemId}", name="content_type_put")
     * @Method({"PUT"})
     * @param Request $request
     * @param string $itemId
     * @return JsonResponse
     */
    public function editItem( Request $request, $itemId )
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData( $data, $itemId );
        if( !$output['success'] ){
            return new JsonResponse( $output );
        }

        $output = $this->createUpdate( $data, $itemId );

        return new JsonResponse( $output );
    }

    /**
     * @Route("/app/content_type/{itemId}", name="content_type_delete")
     * @Method({"DELETE"})
     * @param Request $request
     * @param $itemId
     * @return JsonResponse
     */
    public function deleteItem( Request $request, $itemId )
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
    public function getItem( Request $request, $itemId )
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