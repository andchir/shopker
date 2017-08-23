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

        $fieldType = new FieldType();
        $fieldType
            ->setTitle($data['title'])
            ->setName($data['name'])
            ->setDescription($data['description']);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($fieldType);
        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

}