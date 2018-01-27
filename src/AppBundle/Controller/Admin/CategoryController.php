<?php

namespace AppBundle\Controller\Admin;

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
     * @param $queryString
     * @return mixed
     */
    public function getQueryOptions($queryString)
    {
        parse_str($queryString, $options);
        if (!isset($options['limit'])) {
            $options['limit'] = 0;
        }
        return $options;
    }

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
            return ['success' => false, 'msg' => 'Title is required.'];
        }
        if (empty($data['name'])) {
            return ['success' => false, 'msg' => 'System name is required.'];
        }
        if (empty($data['contentTypeName'])) {
            return ['success' => false, 'msg' => 'Content type is required.'];
        }
        if ($this->checkNameExists($data['name'], $itemId, intval($data['parentId']))) {
            return ['success' => false, 'msg' => 'System name already exists.'];
        }

        return ['success' => true];
    }

    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     */
    public function createUpdate($data, $itemId = null)
    {
        $previousParentId = 0;
        if($itemId === null || !is_numeric($itemId)){
            $item = new Category();
        } else {
            /** @var Category $item */
            $item = $this->getRepository()->find($itemId);
            if(!$item && $data['name'] == 'root'){
                $item = new Category();
                $item
                    ->setId(0)
                    ->setIsFolder(true);
            }
            if(!$item){
                return $this->setError('Item not found.');
            }
            $previousParentId = $item->getParentId();
        }

        /** @var ContentType $contentType */
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $data['contentTypeName']
            ]);

        if(!$contentType){
            return $this->setError('Content type not found.');
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

        // Dispatch event
        $evenDispatcher = $this->get('event_dispatcher');
        $event = new CategoryUpdatedEvent($this->container, $item, $previousParentId);
        $item = $evenDispatcher->dispatch(CategoryUpdatedEvent::NAME, $event)->getCategory();

        return new JsonResponse($item->toArray());
    }

    /**
     * @Route("/tree")
     * @Method({"GET"})
     * @return JsonResponse
     */
    public function getTree()
    {
        $repository = $this->getRepository();
        $categories = $repository->findBy([], ['title' => 'asc']);

        $data = [];
        $root = [
            'id' => 0,
            'label' => 'Catalog',
            'parentId' => 0
        ];
        /** @var Category $category */
        foreach ($categories as $category) {
            if (!$category->getId()) {
                continue;
            }
            $row = [
                'id' => $category->getId(),
                'label' => $category->getTitle(),
                'parentId' => $category->getParentId()
            ];
            $data[$row['parentId']][] = $row;
        }

        $tree = $this->createTree($data, [$root]);

        return new JsonResponse($tree);
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
            return $this->setError('Item not found.');
        }

        $previousParentId = $item->getParentId();

        $this->deleteProductsByCategory($item);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        //Dispatch event
        $evenDispatcher = $this->get('event_dispatcher');
        $event = new CategoryUpdatedEvent($this->container, null, $previousParentId);
        $evenDispatcher->dispatch(CategoryUpdatedEvent::NAME, $event);

        return new JsonResponse([]);
    }

    /**
     * Delete category nested products
     * @param Category $category
     * @return bool
     */
    public function deleteProductsByCategory(Category $category)
    {
        $contentType = $category->getContentType();
        if ($contentType) {
            $collectionName = $contentType->getCollection();
            $collection = $this->getCollection($collectionName);
            $result = $collection->remove(['parentId' => $category->getId()]);
            return !empty($result['ok']);
        }
        return false;
    }


    public function createTree(&$list, $parent){
        $tree = array();
        foreach ($parent as $k=>$l){
            if(isset($list[$l['id']])){
                $l['children'] = $this->createTree($list, $list[$l['id']]);
            }
            $tree[] = $l;
        }
        return $tree;
    }

    /**
     * @param string $collectionName
     * @return \Doctrine\MongoDB\Collection
     */
    public function getCollection($collectionName)
    {
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($this->getParameter('mongodb_database'));
        return $db->createCollection($collectionName);
    }

    /**
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
    }

}
