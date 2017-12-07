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
            return new JsonResponse([]);
        }

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $queryString = $request->getQueryString();
        $queryOptions = $this->getQueryOptions($queryString, $contentType);
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];

        $data = [];
        $results = $collection->find([
            'parentId' => $category->getId()
        ])
            ->sort([$queryOptions['sort_by'] => $queryOptions['sort_dir']])
            ->skip($skip)
            ->limit($queryOptions['limit']);

        foreach ($results as $entry) {
            $row = [
                'id' => $entry['_id'],
                'parentId' => $entry['parentId'],
                'isActive' => $entry['isActive']
            ];
            foreach ($contentTypeFields as $field){
                $row[$field['name']] = isset($entry[$field['name']])
                    ? $entry[$field['name']]
                    : '';
            }
            $data[] = $row;
        }

        $total = $collection->count([
            'parentId' => $category->getId()
        ]);

        return new JsonResponse([
            'items' => $data,
            'total' => $total
        ]);
    }

    /**
     * @param $data
     * @param Category $category
     * @param int $itemId
     * @return array
     */
    public function validateData($data, Category $category = null, $itemId = null)
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
            if($error = $this->validateField($data[$field['name']], $field, [], $collectionName, $category->getId(), $itemId)){
                break;
            }
        }

        return [
            'success' => empty($error),
            'msg' => $error
        ];
    }

    /**
     * @param $value
     * @param $field
     * @param array $properties
     * @param string|null $collectionName
     * @param string|null $categoryId
     * @param int|null $itemId
     * @return string
     */
    public function validateField($value, $field, $properties = [], $collectionName = null, $categoryId = null, $itemId = null)
    {
        $inputProperties = isset($field['inputProperties'])
            ? $field['inputProperties']
            : [];
        if (!empty($field['required']) && empty($value)) {
            return "Field \"{$field['title']}\" is required.";
        }
        $error = '';

        // Validation by input properties
        switch ($field['inputType']){
            case 'system_name':

                if(
                    !empty($value)
                    && $this->checkNameExists($field['name'], $value, $collectionName, $categoryId, $itemId)
                ){
                    $error = 'System name already exists.';
                }

                break;
            case 'file':

                if (!empty($value) && !empty($inputProperties['allowed_extensions'])) {

                    // Validate by file extension
                    if (strpos($inputProperties['allowed_extensions'], '/') !== false) {

                        if (!empty($properties['mimeType'])
                            && !self::isMimeTypeAllowed(explode(',', $inputProperties['allowed_extensions']), $properties['mimeType'])) {

                            $error = 'File type is not allowed.';
                        }

                    } else {
                        $allowedExtensions = explode(',', $inputProperties['allowed_extensions']);
                        $ext = !empty($value['extension']) ? $value['extension'] : null;
                        if ($ext !== null && !in_array('.' . $ext, $allowedExtensions)) {
                            $error = 'File type is not allowed.';
                        }
                    }

                }

                break;
        }
        return $error;
    }

    /**
     * @param array $allowedMimeTypes
     * @param string $mimeType
     * @return bool
     */
    public static function isMimeTypeAllowed($allowedMimeTypes, $mimeType)
    {
        $output = false;
        foreach ($allowedMimeTypes as $allowedMimeType) {
            if (strpos($allowedMimeType, '/*') !== false) {
                $allowedMimeType = str_replace('/*', '/', $allowedMimeType);
                if (strpos($mimeType, $allowedMimeType) === 0) {
                    $output = true;
                    break;
                }
            } else if ($allowedMimeType === $mimeType) {
                $output = true;
                break;
            }
        }
        return $output;
    }

    /**
     * @param $data
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     */
    public function createUpdate($data, Category $category = null, $itemId = null)
    {
        $parentId = !empty($data['parentId']) ? $data['parentId'] : 0;
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $collection = $this->getCollection($contentType->getCollection());
        $isEdit = false;

        if($itemId){
            $document = $collection->findOne(['_id' => $itemId]);
            if(!$document){
                return $this->setError('Item not found.');
            }
            $isEdit = true;
        } else {
            $document = [
                '_id' => $this->getNextId($contentType->getCollection())
            ];
        }

        $document['parentId'] = intval($parentId);
        $document['isActive'] = isset($data['isActive'])
            ? $data['isActive']
            : true;

        foreach ($contentType->getFields() as $field){

            // Files will be saved later by a separate request
            if ($field['inputType'] == 'file') {

                // Delete file
                if ($itemId && empty($data[$field['name']]) && !empty($document[$field['name']])) {
                    $fileData = $document[$field['name']];
                    if (!empty($fileData['fileId'])) {
                        $this->deleteFile($fileData['fileId'], $contentType->getName());
                    }
                }
            }
            $document[$field['name']] = isset($data[$field['name']])
                ? $data[$field['name']]
                : null;
        }

        if($itemId){
            $result = $collection->update(['_id' => $itemId], ['$set' => $document]);
        }
        else {
            $result = $collection->insert($document);
        }

        if (!empty($result['ok'])) {
            return new JsonResponse($document);
        } else {
            return $this->setError('Item not saved.');
        }
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
            return $this->setError($output['msg']);
        }

        return $this->createUpdate($data, $category);
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
            return $this->setError($output['msg']);
        }

        return $this->createUpdate($data, $category, $itemId);
    }

    /**
     * @Route("/{categoryId}/batch")
     * @Method({"POST"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function deleteBatch(Request $request, Category $category = null)
    {
        if (!$category) {
            return $this->setError('Category not found.');
        }

        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        if(empty($data['ids'])){
            return $this->setError('Bad data.');
        }

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $collection = $this->getCollection($contentType->getCollection());
//        foreach ($collection as $document) {
//            $this->onDeleteItem($contentType, $document);
//        }
        $result = $collection->remove([
            '_id' => ['$in' => $data['ids']]
        ]);

        if (!empty($result['ok'])) {
            return new JsonResponse([]);
        } else {
            return $this->setError('Error.');
        }
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
        if (!$category) {
            return new JsonResponse([
                'success' => false,
                'msg' => 'Category not found.'
            ]);
        }
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if (!$contentType) {
            return $this->setError('Content type not found.');
        }

        $collectionName = $contentType->getCollection();
        $collection = $this->getCollection($collectionName);
        $document = $collection->findOne(['_id' => $itemId]);

        if(!$document){
            return $this->setError('Document not found.');
        }

        $this->onDeleteItem($contentType, $document);

        $result = $collection->remove(['_id' => $itemId]);

        if (!empty($result['ok'])) {
            return new JsonResponse([]);
        } else {
            return $this->setError('Error.');
        }
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
            return $this->setError('Category not found.');
        }

        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $entity = $collection->findOne(['_id' => $itemId]);
        if(!$entity){
            return $this->setError('Product not found.');
        }

        $data = [
            'id' => $entity['_id'],
            'parentId' => $entity['parentId'],
            'isActive' => $entity['isActive']
        ];
        foreach ($contentTypeFields as $field){
            $data[$field['name']] = isset($entity[$field['name']])
                ? $entity[$field['name']]
                : '';
        }

        return new JsonResponse($data);
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
     * @param string $fieldName
     * @param string $name
     * @param string $collectionName
     * @param int $categoryId
     * @param int $itemId
     * @return mixed
     */
    public function checkNameExists($fieldName, $name, $collectionName, $categoryId, $itemId = null)
    {
        $collection = $this->getCollection($collectionName);
        $itemId = intval($itemId);
        $where = [
            $fieldName => $name,
            'parentId' => $categoryId
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
     * @param ContentType $contentType
     * @param $itemData
     */
    public function onDeleteItem(ContentType $contentType, $itemData)
    {
        $contentTypeName = $contentType->getName();
        foreach ($contentType->getFields() as $field){

            // Files will be saved later by a separate request
            if ($field['inputType'] == 'file') {

                // Delete file
                if (!empty($itemData[$field['name']])) {
                    $fileData = $itemData[$field['name']];
                    if (!empty($fileData['fileId'])) {

                        // TODO: Check if file is not used anymore

                        //$this->deleteFile($fileData['fileId'], $contentTypeName);
                    }
                }
            }
        }
    }

    /**
     * @param $itemId
     * @param $ownerType
     * @param $ownerId
     * @return bool
     */
    public function deleteFile($itemId, $ownerType, $ownerId = 0)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $fileDocumentRepository = $this->getFileDocumentRepository();

        $where = [
            'id' => $itemId,
            'ownerType' => $ownerType
        ];
        if ($ownerId) {
            $where['ownerId'] = $ownerId;
        }

        $fileDocument = $fileDocumentRepository->findOneBy($where);

        $filesDirPath = $this->getParameter('files_dir_path');

        if ($fileDocument) {
            $fileDocument->setUploadRootDir($filesDirPath);
            $dm->remove($fileDocument);
            $dm->flush();
        }

        return true;
    }

    /**
     * Get file extension
     * @param $filePath
     * @return string
     */
    public static function getExtension($filePath)
    {
        $temp_arr = $filePath ? explode('.', $filePath) : [];
        $ext = !empty($temp_arr) ? end($temp_arr) : '';
        return strtolower($ext);
    }

    /**
     * @return \AppBundle\Repository\FileDocumentRepository
     */
    public function getFileDocumentRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:FileDocument');
    }

}