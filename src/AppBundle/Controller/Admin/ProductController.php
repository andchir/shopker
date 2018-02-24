<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Controller\ProductController as BaseProductController;
use AppBundle\Document\Category;
use AppBundle\Document\ContentType;
use AppBundle\Document\FileDocument;
use AppBundle\Document\Filter;
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
class ProductController extends BaseProductController
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

                    if (!$this->fileUploadAllowed($value, $properties, $inputProperties['allowed_extensions'])) {
                        $error = 'File type is not allowed.';
                    }

                }

                break;
        }
        return $error;
    }

    /**
     * @param string | array $value
     * @param array $properties
     * @param string $allowedExtensions
     * @return bool
     */
    public function fileUploadAllowed($value, $properties, $allowedExtensions = '')
    {
        $filesExtBlacklist = $this->getParameter('files_ext_blacklist');
        if (is_array($value)) {
            $ext = !empty($value['extension']) ? $value['extension'] : null;
        } else {
            $ext = self::getExtension($value);
        }

        // Validate by file extension
        if (strpos($allowedExtensions, '/') !== false) {

            if (!empty($properties['mimeType'])
                && !self::isMimeTypeAllowed(explode(',', $allowedExtensions), $properties['mimeType'])) {

                return false;
            }

        } else {
            $allowedExtensions = explode(',', $allowedExtensions);
            if ($ext !== null && !in_array('.' . $ext, $allowedExtensions)) {
                return false;
            }
        }
        if (in_array($ext, $filesExtBlacklist)) {
            return false;
        }

        return true;
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

        if($itemId){
            $document = $collection->findOne(['_id' => $itemId]);
            if(!$document){
                return $this->setError('Item not found.');
            }
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

        $this->updateFiltersData($category);

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
        $documents = $collection->find([
            '_id' => ['$in' => $data['ids']]
        ]);

        $deleted = 0;
        foreach ($documents as $document) {
            $this->onBeforeDeleteItem($contentType, $document, $data['ids']);
            $result = $collection->remove([
                '_id' => $document['_id']
            ]);
            if (!empty($result['ok'])) {
                $deleted++;
            }
        }

        if ($deleted === count($data['ids'])) {
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

        $this->onBeforeDeleteItem($contentType, $document);

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
     * @param ContentType $contentType
     * @param $itemData
     * @param array $ids
     */
    public function onBeforeDeleteItem(ContentType $contentType, $itemData, $ids = [])
    {
        if (empty($ids)) {
            array_push($ids, $itemData['_id']);
        }
        $contentTypeName = $contentType->getName();
        foreach ($contentType->getFields() as $field){

            // Files will be saved later by a separate request
            if ($field['inputType'] == 'file') {

                // Delete file
                if (!empty($itemData[$field['name']])) {
                    $fileData = $itemData[$field['name']];
                    if (!empty($fileData['fileId'])) {

                        $usedTotal = $this->getUsedOtherTotal($contentType, $field['name'], $fileData['fileId'], $ids);

                        // Delete if not used by other
                        if (!$usedTotal) {
                            $this->deleteFile($fileData['fileId'], $contentTypeName);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param ContentType $contentType
     * @param string $fieldName
     * @param int $fileId
     * @param array $ids
     * @return int
     */
    public function getUsedOtherTotal(ContentType $contentType, $fieldName, $fileId, $ids = []) {
        $collection = $this->getCollection($contentType->getCollection());
        return $collection->find([
            '_id' => ['$nin' => $ids],
            $fieldName . '.fileId' =>  $fileId
        ])->count();
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

    /***
     * @param Category $category
     * @return bool
     */
    public function updateFiltersData(Category $category)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $categoriesRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);

        $filterRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Filter::class);

        $breadcrumbs = $categoriesRepository->getBreadcrumbs($category->getUri(), false);
        $breadcrumbs = array_reverse($breadcrumbs);

        foreach ($breadcrumbs as $category) {
            $categoryId = $category['id'];

            /** @var Category $cat */
            $cat = $categoriesRepository->find($categoryId);
            $childCategories = $categoriesRepository->findBy([
                'parentId' => $cat->getId()
            ]);

            /** @var ContentType $contentType */
            $contentType = $cat->getContentType();
            $contentTypeFields = $contentType->getFields();
            $collection = $this->getCollection($contentType->getCollection());

            $filterData = [];

            /** @var Category $childCategory */
            foreach ($childCategories as $childCategory) {
                /** @var Filter $flt */
                $flt = $filterRepository->findByCategory($childCategory->getId());
                if (empty($flt)) {
                    continue;
                }
                $filterValues = $flt->getValues();
                foreach ($contentTypeFields as $contentTypeField) {
                    if (!$contentTypeField['isFilter']) {
                        continue;
                    }
                    $fieldName = $contentTypeField['name'];
                    if (!isset($filterData[$fieldName])) {
                        $filterData[$fieldName] = [];
                    }
                    if (!empty($filterValues[$fieldName])) {
                        $values = array_merge($filterData[$fieldName], $filterValues[$fieldName]);
                        $values = array_unique($values);
                        if ($contentTypeField['outputType'] == 'number') {
                            sort($values, SORT_NUMERIC);
                        } else {
                            sort($values);
                        }
                        $filterData[$fieldName] = $values;
                    }
                }
            }
            unset($childCategories, $childCategory, $values);

            // Get products
            $entries = $collection->find([
                'parentId' => $cat->getId()
            ]);

            foreach ($entries as $entry) {

                foreach ($contentTypeFields as $contentTypeField) {
                    if (!$contentTypeField['isFilter']) {
                        continue;
                    }
                    $fieldName = $contentTypeField['name'];
                    if (!isset($filterData[$fieldName])) {
                        $filterData[$fieldName] = [];
                    }
                    if (!empty($entry[$fieldName])
                        && !in_array($entry[$fieldName], $filterData[$fieldName])) {
                        $filterData[$fieldName][] = $entry[$fieldName];
                    }
                }
            }

            $filter = $filterRepository->findOneBy([
                'categoryId' => $cat->getId()
            ]);
            if (!$filter) {
                $filter = new Filter();
                $filter->setCategoryId($cat->getId());
            }
            $filter->setValues($filterData);

            $dm->persist($filter);
            $dm->flush();
        }

        return true;
    }

    /**
     * @return \AppBundle\Repository\FileDocumentRepository
     */
    public function getFileDocumentRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(FileDocument::class);
    }

}