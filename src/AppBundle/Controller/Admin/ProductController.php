<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Controller\ProductController as BaseProductController;
use AppBundle\Document\Category;
use AppBundle\Document\ContentType;
use AppBundle\Document\FileDocument;
use AppBundle\Document\Filter;
use AppBundle\Service\UtilsService;
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
    public function getListByCategoryAction(Request $request, Category $category = null)
    {
        if(!$category){
            return new JsonResponse([]);
        }

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $queryString = $request->getQueryString();
        $queryOptions = UtilsService::getQueryOptions('', $queryString, $contentType->getFields());
        $contentTypeFields = $contentType->getFields();
        $collection = $this->getCollection($contentType->getCollection());

        $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];

        $data = [];
        $results = $collection->find([
            'parentId' => $category->getId()
        ])
            ->sort($queryOptions['sortOptions'])
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
            if($error = $this->validateField(
                    $data[$field['name']],
                    $field,
                    [],
                    $collectionName,
                    $category->getId(),
                    $itemId
                )
            ){
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

            if (empty($properties['mimeType'])) {
                $mimes = new \Mimey\MimeTypes;
                $properties['mimeType'] = $mimes->getMimeType($ext);
            }
            if (!self::isMimeTypeAllowed(explode(',', $allowedExtensions), $properties['mimeType'])) {
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
     * @Route("/{categoryId}")
     * @Method({"POST"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function createItemAction(Request $request, Category $category = null)
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
    public function updateItemAction(Request $request, Category $category = null, $itemId)
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
     * @param $data
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     */
    public function createUpdate($data, Category $category = null, $itemId = null)
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $parentId = !empty($data['parentId']) ? $data['parentId'] : 0;
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $collection = $this->getCollection($contentType->getCollection());

        if($itemId){
            $document = null;
            if (!empty($data['previousParentId'])
                && $data['previousParentId'] !== $category->getId()) {

                // Delete old document in another collection
                /** @var Category $previousCategory */
                $previousCategory = $categoriesRepository->find($data['previousParentId']);
                if ($previousCategory) {
                    $previousContentType = $previousCategory->getContentType();
                    if ($previousContentType->getCollection() !== $contentType->getCollection()) {
                        $previousCollection = $this->getCollection($previousContentType->getCollection());
                        $document = $previousCollection->findOne(['_id' => $itemId]);
                        if (!$document) {
                            return $this->setError('Item not found.');
                        }
                        $previousCollection->remove([
                            '_id' => $itemId
                        ]);
                        $itemId = null;
                        $document['_id'] = $this->getNextId($contentType->getCollection());
                    }
                }
            }
            if (empty($document)) {
                $document = $collection->findOne(['_id' => $itemId]);
            }
            if (!$document) {
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
                if ($itemId && !empty($document[$field['name']])) {
                    $oldFileId = !empty($document[$field['name']]) && isset($document[$field['name']]['fileId'])
                        ? $document[$field['name']]['fileId']
                        : null;
                    $newFileId = !empty($data[$field['name']]) && isset($data[$field['name']]['fileId'])
                        ? $data[$field['name']]['fileId']
                        : null;
                    if (!$newFileId || $oldFileId !== $newFileId) {
                        $this->deleteFile($oldFileId, $contentType->getName());
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
     * @Route(
     *     "/{categoryId}/{action}/batch",
     *     requirements={"action"},
     *     defaults={"action": "delete"}
     * )
     * @Method({"POST"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category|null $category
     * @param string $action
     * @return JsonResponse
     */
    public function batchAction(Request $request, Category $category = null, $action = 'delete')
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

        $count = 0;
        foreach ($documents as $document) {
            switch ($action) {
                case 'delete':
                    if (!empty($this->deleteItem($contentType, $document))) {
                        $count++;
                    }
                    break;
                case 'block':
                    if (!empty($this->blockItem($contentType, $document))) {
                        $count++;
                    }
                    break;
            }
        }

        if ($count === count($data['ids'])) {
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
    public function deleteItemAction(Category $category = null, $itemId)
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

        $result = $this->deleteItem($contentType, $document);

        if (!empty($result['ok'])) {
            return new JsonResponse([]);
        } else {
            return $this->setError('Error.');
        }
    }

    /**
     * @param ContentType $contentType
     * @param $itemData
     * @return array|bool
     */
    public function deleteItem(ContentType $contentType, $itemData)
    {
        $collection = $this->getCollection($contentType->getCollection());
        $this->onBeforeDeleteItem($contentType, $itemData);
        return $collection->remove([
            '_id' => $itemData['_id']
        ]);
    }

    /**
     * @param ContentType $contentType
     * @param $itemData
     * @return array|bool
     */
    public function blockItem(ContentType $contentType, $itemData)
    {
        $collection = $this->getCollection($contentType->getCollection());
        return $collection->update(
            [
                '_id' => $itemData['_id']
            ],
            [
                '$set' => ['isActive' => !$itemData['isActive']]
            ]
        );
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
     * @param $collectionName
     * @param string $databaseName
     * @return mixed
     */
    public function getNextId($collectionName, $databaseName = '')
    {
        $autoincrementCollection = $this->getCollection('doctrine_increment_ids', $databaseName);
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

    /**
     * @param Category $parentCategory
     * @param string $databaseName
     * @return bool
     */
    public function updateFiltersData(Category $parentCategory, $databaseName = '')
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $categoriesRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);

        $filterRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Filter::class);

        $breadcrumbs = $categoriesRepository->getBreadcrumbs($parentCategory->getUri(), false);
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
            $collection = $this->getCollection($contentType->getCollection(), $databaseName);

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
                    if (!empty($filterValues[$fieldName])) {
                        if (!isset($filterData[$fieldName])) {
                            $filterData[$fieldName] = [];
                        }
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

            foreach ($contentTypeFields as $contentTypeField) {
                if (!$contentTypeField['isFilter']) {
                    continue;
                }
                $fieldName = $contentTypeField['name'];

                // Get products fields unique data
                $criteria = [
                    'isActive' => true
                ];
                $this->applyCategoryFilter($cat, $contentTypeFields, $criteria);
                $uniqueValues = $collection->distinct($fieldName, $criteria)->toArray();

                if (!empty($uniqueValues)) {
                    if (!isset($filterData[$fieldName])) {
                        $filterData[$fieldName] = [];
                    }
                    $filterData[$fieldName] = array_unique(array_merge($filterData[$fieldName], $uniqueValues));
                    sort($filterData[$fieldName]);
                }
            }

            $filter = $filterRepository->findOneBy([
                'categoryId' => $cat->getId()
            ]);
            if (!$filter) {
                if (empty($filterData)) {
                    continue;
                }
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
     * @return \AppBundle\Repository\CategoryRepository
     */
    public function getCategoriesRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
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