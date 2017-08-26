<?php

namespace AppBundle\Controller;

use AppBundle\Document\FieldType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Document\ContentType;

class FieldTypeController extends Controller
{

    /**
     * @Route("/admin/field_types", name="admin_field_types")
     * @Method({"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getList(Request $request)
    {
        $repository = $this->getRepository();
        $results = $repository->findAllOrderedByName();

        $data = [];
        /** @var FieldType $item */
        foreach ($results as $item) {
            $data[] = $item->toArray();
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @Route("/admin/field_types", name="field_types_post")
     * @Method({"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createItem(Request $request)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        //TODO: Add validation
        /*
        $output = $this->validateData( $data );
        if( !$output['success'] ){
            return new JsonResponse( $output );
        }
        */

        if(empty($data['properties'])){
            $data['properties'] = [];
        }

        if(!empty($data['id'])){
            $fieldType = $this->getRepository()->find($data['id']);
            if(!$fieldType){
                return new JsonResponse([
                    'success' => false,
                    'msg' => 'Item not found.'
                ]);
            }
        } else {
            $fieldType = new FieldType();
        }

        $fieldType
            ->setTitle($data['title'])
            ->setName($data['name'])
            ->setDescription($data['description'])
            ->setProperties($data['properties']);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($fieldType);
        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @Route("/admin/field_types/{itemId}", name="admin_field_type")
     * @Method({"GET"})
     * @param Request $request
     * @param $itemId
     * @return JsonResponse
     */
    public function getItem(Request $request, $itemId)
    {
        $repository = $this->getRepository();

        /** @var FieldType $fieldType */
        $fieldType = $repository->find($itemId);
        if (!$fieldType) {
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        return new JsonResponse([
            'success' => true,
            'data' => $fieldType->toArray()
        ]);
    }

    /**
     * @Route("/admin/field_types/{itemId}", name="admin_field_type_delete")
     * @Method({"DELETE"})
     * @param Request $request
     * @param int $itemId
     * @return JsonResponse
     */
    public function deleteItem(Request $request, $itemId)
    {
        $repository = $this->getRepository();

        /** @var FieldType $item */
        $item = $repository->find($itemId);
        if( !$item ){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @return \AppBundle\Repository\FieldTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:FieldType');
    }

}