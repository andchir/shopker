<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Document\ContentType;
use AppBundle\Document\Product;
use Doctrine\ORM\Query\Expr\Base;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class ProductController
 * @package AppBundle\Controller
 * @Route("/admin/products")
 */
class ProductController extends BaseController
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
        $parentId = !empty($data['parent_id']) ? $data['parent_id'] : 0;
        $contentTypeName = !empty($data['content_type']) ? $data['content_type'] : '';

        /** @var Category $category */
        $category = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Category')
            ->find($parentId);

        if(!$category){
            return [
                'success' => false,
                'msg' => 'Category not found.'
            ];
        }

        /** @var ContentType $contentType */
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $contentTypeName
            ]);

        if(!$contentType){
            return [
                'success' => false,
                'msg' => 'Content type not found.'
            ];
        }

        //TODO: check system collections
        $collection = $this->getCollection($contentType->getCollection());

        if($itemId){
            $document = $collection->find(['_id' => $itemId]);

            var_dump($document); exit;

        } else {
            $document = [
                '_id' => $this->getNextId($contentType->getCollection())
            ];
        }

        $document['parent_id'] = $parentId;
        $document['is_active'] = isset($data['is_active'])
            ? $data['is_active']
            : true;

        foreach ($contentType->getFields() as $field){
            $document[$field['name']] = !empty($data[$field['name']])
                ? $data[$field['name']]
                : '';
        }

        $result = $collection->insert($document);

        //$result = $collection->update(['_id' => $document['id']], ['$set' => $document]);

        return [
            'success' => !empty($result['ok']),
            'data' => $document
        ];
    }

    /**
     * @Route("/{categoryId}")
     * @Method({"POST"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function createItem(Request $request, Category $category = null)
    {
        if(!$category){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Category not found.'
            ]);
        }

        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data);
        if(!$output['success']){
            return new JsonResponse($output);
        }

        return new JsonResponse($this->createUpdate($data));
    }

    /**
     * @Route("/{categoryId}/{productId}", name="category_product")
     * @Method({"GET"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @param int $productId
     * @return JsonResponse
     */
    public function getOneByCategory(Request $request, Category $category = null, $productId)
    {
        if(!$category){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Category not found.'
            ]);
        }

        $productId = intval($productId);
        $contentTypeName = $category->getContentType();

        /** @var ContentType $contentType */
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $contentTypeName
            ]);

        if(!$contentType){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Content type not found.'
            ]);
        }

        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $entry = $collection->findOne(['_id' => $productId]);
        if(!$entry){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Product not found.'
            ]);
        }

        $data = [
            'id' => $entry['_id'],
            'parent_id' => $entry['parent_id'],
            'is_active' => $entry['is_active'],
            'content_type' => $contentTypeName
        ];
        foreach ($contentTypeFields as $field){
            $data[$field['name']] = !empty($entry[$field['name']])
                ? $entry[$field['name']]
                : '';
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @Route("/{categoryId}", name="category_product_list")
     * @Method({"GET"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function getListByCategory(Request $request, Category $category = null)
    {
        if(!$category){
            return new JsonResponse([
                'success' => true,
                'data' => []
            ]);
        }

        $contentTypeName = $category->getContentType();

        /** @var ContentType $contentType */
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $contentTypeName
            ]);

        if(!$contentType){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Content type not found.'
            ]);
        }

        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $data = [];
        $results = $collection->find([
            'parent_id' => $category->getId()
        ]);

        foreach ($results as $entry) {
            $row = [
                'id' => $entry['_id'],
                'parent_id' => $entry['parent_id'],
                'is_active' => $entry['is_active']
            ];
            foreach ($contentTypeFields as $field){
                $row[$field['name']] = !empty($entry[$field['name']])
                    ? $entry[$field['name']]
                    : '';
            }
            $data[] = $row;
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @param string $collectionName
     * @return \Doctrine\MongoDB\Collection
     */
    public function getCollection($collectionName){
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($this->getParameter('mongodb_database'));
        return $db->createCollection($collectionName);
    }

    /**
     * @param string $collectionName
     * @return int
     */
    public function getNextId($collectionName){
        $autoincrementCollection = $this->getCollection('doctrine_increment_ids');
        $count = $autoincrementCollection->count(['_id' => $collectionName]);
        if(!$count){
            $record = [
                '_id' => $collectionName,
                'current_id' => 0
            ];
            $autoincrementCollection->insert($record);
        }
        $ret = $autoincrementCollection->findAndUpdate(
            ['_id' => $collectionName],
            ['$inc' => ['current_id' => 1]],
            ['new' => true]
        );
        return $ret['current_id'];
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