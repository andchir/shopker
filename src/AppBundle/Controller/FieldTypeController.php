<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use AppBundle\Document\FieldType;

/**
 * Class FieldTypeController
 * @package AppBundle\Controller
 * @Route("/admin/field_types")
 */
class FieldTypeController extends StorageControllerAbstract
{

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function validateData($data, $itemId = 0)
    {

        return ['success' => true];
    }

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function createUpdate($data, $itemId = 0){

        if(empty($data['properties'])){
            $data['properties'] = [];
        }

        if($itemId){
            $item = $this->getRepository()->find($itemId);
            if(!$item){
                return [
                    'success' => false,
                    'msg' => 'Item not found.'
                ];
            }
        } else {
            $item = new FieldType();
        }

        $item
            ->setTitle($data['title'])
            ->setName($data['name'])
            ->setDescription($data['description'])
            ->setProperties($data['properties']);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($item);
        $dm->flush();

        return [
            'success' => true,
            'data' => $item->toArray()
        ];
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