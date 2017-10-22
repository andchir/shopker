<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Event\CategoryUpdatedEvent;

use AppBundle\Document\Category;
use AppBundle\Document\ContentType;

/**
 * Class ContentTypeController
 * @package AppBundle\Controller
 * @Route("/admin/categories")
 */
class CategoryController extends StorageControllerAbstract
{

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function validateData($data, $itemId = 0)
    {
        if( empty($data) ){
            return ['success' => false, 'msg' => 'Data is empty.'];
        }
        if( empty($data['title']) ){
            return ['success' => false, 'msg' => 'Title is required.'];
        }
        if( empty($data['name']) ){
            return ['success' => false, 'msg' => 'System name is required.'];
        }
        if( empty($data['contentTypeName']) ){
            return ['success' => false, 'msg' => 'Content type is required.'];
        }
        if($this->checkNameExists($data['name'], $itemId)){
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
    public function createUpdate($data, $itemId = '')
    {
        $previousParentId = 0;
        if($itemId){
            /** @var Category $item */
            $item = $this->getRepository()->find($itemId);
            if(!$item){
                return [
                    'success' => false,
                    'msg' => 'Item not found.'
                ];
            }
            $previousParentId = $item->getParentId();
        } else {
            $item = new Category();
        }

        /** @var ContentType $contentType */
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $data['contentTypeName']
            ]);

        if(!$contentType){
            return [
                'success' => false,
                'msg' => 'Content type not found.'
            ];
        }

        $item
            ->setTitle($data['title'])
            ->setName($data['name'])
            ->setDescription(isset($data['description']) ? $data['description'] : '')
            ->setIsActive(isset($data['isActive']) ? $data['isActive'] : true)
            ->setParentId(isset($data['parentId']) ? intval( $data['parentId'] ) : 0)
            ->setContentTypeName($data['contentTypeName'])
            ->setContentType($contentType);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($item);
        $dm->flush();

        //Dispatch event
        $evenDispatcher = $this->get('event_dispatcher');
        $event = new CategoryUpdatedEvent($this->container, $item, $previousParentId);
        $item = $evenDispatcher->dispatch(CategoryUpdatedEvent::NAME, $event)->getCategory();

        return [
            'success' => true,
            'data' => $item->toArray()
        ];
    }

    /**
     * @Route("/{itemId}")
     * @Method({"DELETE"})
     * @param int $itemId
     * @return JsonResponse
     */
    public function deleteItem($itemId)
    {
        $repository = $this->getRepository();

        /** @var Category $item */
        $item = $repository->find($itemId);
        if(!$item){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        $previousParentId = $item->getParentId();

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        //Dispatch event
        $evenDispatcher = $this->get('event_dispatcher');
        $event = new CategoryUpdatedEvent($this->container, null, $previousParentId);
        $evenDispatcher->dispatch(CategoryUpdatedEvent::NAME, $event);

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Category');
    }

}
