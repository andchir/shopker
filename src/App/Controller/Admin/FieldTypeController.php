<?php

namespace App\Controller\Admin;

use Symfony\Component\Routing\Annotation\Route;
use App\MainBundle\Document\FieldType;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class FieldTypeController
 * @package App\Controller
 * @Route("/admin/field_types")
 */
class FieldTypeController extends StorageControllerAbstract
{

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function validateData($data, $itemId = null)
    {
        if (empty($data)) {
            return ['success' => false, 'msg' => 'Data is empty.'];
        }
        if (empty($data['title'])) {
            return ['success' => false, 'msg' => 'Title is empty.'];
        }
        if (empty($data['name'])) {
            return ['success' => false, 'msg' => 'System name is empty.'];
        }
        if ($this->checkNameExists($data['name'], $itemId)) {
            return ['success' => false, 'msg' => 'System name already exists.'];
        }

        return ['success' => true];
    }

    /**
     * @param $data
     * @param int $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function createUpdate($data, $itemId = null){

        if(empty($data['inputProperties'])){
            $data['inputProperties'] = [];
        }
        if(empty($data['outputProperties'])){
            $data['outputProperties'] = [];
        }

        if($itemId){
            $item = $this->getRepository()->find($itemId);
            if(!$item){
                return $this->setError('Item not found.');
            }
        } else {
            $item = new FieldType();
        }

        $item
            ->setTitle($data['title'])
            ->setName($data['name'])
            ->setDescription($data['description'])
            ->setIsActive($data['isActive'])
            ->setInputProperties($data['inputProperties'])
            ->setOutputProperties($data['outputProperties']);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        if (!$item->getId()) {
            $dm->persist($item);
        }
        $dm->flush();

        return new JsonResponse($item->toArray());
    }

    /**
     * @return \App\Repository\FieldTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(FieldType::class);
    }

}