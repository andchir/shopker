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

        $contentType = $category->getContentType();
        if(!$contentType){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Content type not found.'
            ]);
        }

        $queryString = $request->getQueryString();
        $queryOptions = $this->getQueryOptions($queryString, $contentType);
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];

        $data = [];
        $results = $collection->find([
            'parent_id' => $category->getId()
        ])
            ->sort([$queryOptions['sort_by'] => $queryOptions['sort_dir']])
            ->skip($skip)
            ->limit($queryOptions['limit']);

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

        $total = $collection->count();

        return new JsonResponse([
            'success' => true,
            'data' => $data,
            'total' => $total
        ]);
    }

    /**
     * @param $data
     * @param Category $category
     * @param int $itemId
     * @return array
     */
    public function validateData($data, Category $category = null, $itemId = 0)
    {
        if(!$category){
            return [
                'success' => false,
                'msg' => 'Category not found.'
            ];
        }

        $contentType = $category->getContentType();

        if(!$contentType){
            return [
                'success' => false,
                'msg' => 'Content type not found.'
            ];
        }

        $collectionName = $contentType->getCollection();
        $contentTypeFields = $contentType->getFields();
        $error = '';

        foreach ($contentTypeFields as $field){
            $inputProperties = isset($field['input_properties'])
                ? $field['input_properties']
                : [];
            if(!empty($field['required']) && empty($data[$field['name']])){
                $error = "Field \"{$field['title']}\" is required.";
            }
            switch ($field['input_type']){
                case 'system_name':

                    if(!empty($data[$field['name']]) && $this->checkNameExists($data[$field['name']], $collectionName, $itemId)){
                        $error = 'System name already exists.';
                    }

                    break;
            }
            if(!empty($error)){
                break;
            }
        }

        return [
            'success' => empty($error),
            'msg' => $error
        ];
    }

    /**
     * @param $data
     * @param Category $category
     * @param int $itemId
     * @return array
     */
    public function createUpdate($data, Category $category = null, $itemId = 0)
    {
        $parentId = !empty($data['parent_id']) ? $data['parent_id'] : 0;
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return [
                'success' => false,
                'msg' => 'Content type not found.'
            ];
        }

        $collection = $this->getCollection($contentType->getCollection());

        if($itemId){
            $document = $collection->findOne(['_id' => $itemId]);
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

        if($itemId){
            $result = $collection->update(['_id' => $itemId], ['$set' => $document]);
        }
        else {
            $result = $collection->insert($document);
        }

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
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data, $category);
        if(!$output['success']){
            return new JsonResponse($output);
        }

        return new JsonResponse($this->createUpdate($data, $category));
    }

    /**
     * @Route("/{categoryId}/{itemId}")
     * @Method({"PUT"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     */
    public function updateItem(Request $request, Category $category = null, $itemId)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data, $category, $itemId);
        if(!$output['success']){
            return new JsonResponse($output);
        }

        return new JsonResponse($this->createUpdate($data, $category, $itemId));
    }

    /**
     * @Route("/{categoryId}/{itemId}")
     * @Method({"DELETE"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     */
    public function deleteItem(Category $category = null, $itemId)
    {
        if(!$category){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Category not found.'
            ]);
        }
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Content type not found.'
            ]);
        }

        $collectionName = $contentType->getCollection();
        $collection = $this->getCollection($collectionName);
        $document = $collection->findOne(['_id' => $itemId]);

        if(!$document){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Document not found.'
            ]);
        }

        $result = $collection->remove(['_id' => $itemId]);

        return new JsonResponse([
            'success' => !empty($result['ok'])
        ]);
    }

    /**
     * @Route("/{categoryId}/{itemId}", name="category_product")
     * @Method({"GET"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     */
    public function getOneByCategory(Request $request, Category $category = null, $itemId)
    {
        if(!$category){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Category not found.'
            ]);
        }

        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Content type not found.'
            ]);
        }

        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $entry = $collection->findOne(['_id' => $itemId]);
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
            'content_type' => $contentType->getName()
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
     * @param string $collectionName
     * @return int
     */
    public function getNextId($collectionName)
    {
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
     * @param string $name
     * @param string $collectionName
     * @param int $itemId
     * @return mixed
     */
    public function checkNameExists($name, $collectionName, $itemId = 0)
    {
        $collection = $this->getCollection($collectionName);
        $itemId = intval($itemId);
        $where = [
            'name' => $name
        ];
        if($itemId){
            $where['_id'] = ['$ne' => $itemId];
        }

        return $collection->count($where);
    }

    /**
     * @param $queryString
     * @param ContentType $contentType
     * @return array
     */
    public function getQueryOptions($queryString, ContentType $contentType)
    {
        $queryOptionsDefault = [
            'page' => 1,
            'limit' => 10,
            'sort_by' => '_id',
            'sort_dir' => 1,
            'full' => 1,
            'only_active' => 1
        ];
        parse_str($queryString, $queryOptions);

        $queryOptions = array_merge($queryOptionsDefault, $queryOptions);

        //Field names array
        $fields = $contentType->getFields();
        $fieldNames = array_map(function($field){
            return $field['name'];
        }, $fields);
        $fieldNames[] = '_id';

        if($queryOptions['sort_by'] == 'id'){
            $queryOptions['sort_by'] = '_id';
        }
        if(!in_array($queryOptions['sort_by'], $fieldNames)){
            $opts['sort_by'] = $queryOptionsDefault['sort_by'];
        }
        if(!is_numeric($queryOptions['sort_dir'])){
            $queryOptions['sort_dir'] = $queryOptions['sort_dir'] == 'asc' ? 1 : -1;
        }
        if(!is_numeric($queryOptions['limit'])){
            $queryOptions['limit'] = $queryOptionsDefault['limit'];
        }
        if(!is_numeric($queryOptions['page'])){
            $queryOptions['page'] = $queryOptionsDefault['page'];
        }

        return $queryOptions;
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