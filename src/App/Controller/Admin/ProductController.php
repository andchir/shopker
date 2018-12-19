<?php

namespace App\Controller\Admin;

use App\Controller\ProductController as BaseProductController;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\Filter;
use App\Events;
use App\Service\UtilsService;
use Doctrine\ORM\Query\Expr\Base;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use \Mimey\MimeTypes;

/**
 * Class ProductController
 * @package App\Controller
 * @Route("/admin/products")
 */
class ProductController extends BaseProductController
{

    /**
     * @Route("/{categoryId}", name="category_product_list", methods={"GET"})
     * @ParamConverter("category", class="AppMainBundle:Category", options={"id" = "categoryId"})
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
        $filesExtBlacklist = $this->getParameter('app.files_ext_blacklist');
        if (is_array($value)) {
            $ext = !empty($value['extension']) ? strtolower($value['extension']) : null;
        } else {
            $ext = self::getExtension($value);
        }

        // Validate by file extension
        if (strpos($allowedExtensions, '/') !== false) {

            if (empty($properties['mimeType'])) {
                $mimes = new MimeTypes;
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
     * @Route("/{categoryId}", methods={"POST"})
     * @ParamConverter("category", class="AppMainBundle:Category", options={"id" = "categoryId"})
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
     * @Route("/{categoryId}/{itemId}", methods={"PUT"})
     * @ParamConverter("category", class="AppMainBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function updateItemAction(Request $request, Category $category, $itemId)
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
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function createUpdate($data, Category $category = null, $itemId = null)
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $parentId = !empty($data['parentId']) ? $data['parentId'] : 0;
        $fieldsSort = !empty($data['fieldsSort']) && is_array($data['fieldsSort'])
            ? $data['fieldsSort']
            : [];
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $collection = $this->getCollection($contentType->getCollection());
        unset($data['fieldsSort']);

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
        $document['translations'] = $data['translations'] ?? null;
        $document['isActive'] = isset($data['isActive'])
            ? $data['isActive']
            : true;

        $fileFields = [];
        $fileIds = [];
        $contentTypeFields = $contentType->getFields();

        foreach ($data as $key => $value) {
            if (in_array($key, ['id', '_id', 'parentId', 'isActive'])) {
                continue;
            }
            $baseFieldName = ContentType::getCleanFieldName($key);
            $fIndex = array_search($baseFieldName, array_column($contentTypeFields, 'name'));
            if ($fIndex === false) {
                continue;
            }

            $field = $contentTypeFields[$fIndex];
            if ($field['inputType'] == 'file') {
                if (isset($value['fileId']) && $value['fileId'] === 0) {
                    $fileFields[] = $key;
                } else if (!empty($value['fileId'])) {
                    $fileIds[] = $value['fileId'];
                }
            }

            $document[$key] = $value;
        }

        // Save document
        if($itemId){
            $result = $collection->update(
                ['_id' => $itemId],
                ['$set' => $document]
            );
        }
        else {
            $result = $collection->insert($document);

            // Dispatch event
            $eventDispatcher = $this->get('event_dispatcher');
            $event = new GenericEvent($document, ['contentType' => $contentType]);
            $eventDispatcher->dispatch(Events::PRODUCT_CREATED, $event);
        }

        // If $fileFields is not empty it will be done after saving the files
        // Otherwise do it now
        if (empty($fileFields)) {
            $fileIds = array_unique($fileIds);
            $fileController = new FileController();
            $fileController->setContainer($this->container);
            $fileController->deleteUnused('products', $itemId, $fileIds);
            $this->sortAdditionalFields($contentType->getCollection(), $document, $fieldsSort);
        }

        $this->onAfterUpdateItem($contentType, $document, $category->getId());

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
     *     defaults={"action": "delete"},
     *     methods={"POST"}
     * )
     * @ParamConverter("category", class="AppMainBundle:Category", options={"id" = "categoryId"})
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
     * @Route("/{categoryId}/{itemId}", methods={"DELETE"})
     * @ParamConverter("category", class="AppMainBundle:Category", options={"id" = "categoryId"})
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
        $result = $collection->remove([
            '_id' => $itemData['_id']
        ]);
        if (empty($result['ok'])) {
            return $result;
        }

        $categoryId = isset($itemData['parentId']) ? $itemData['parentId'] : 0;
        $this->onAfterUpdateItem($contentType, [], $categoryId);

        // Dispatch event
        $eventDispatcher = $this->get('event_dispatcher');
        $event = new GenericEvent($itemData, ['contentType' => $contentType]);
        $eventDispatcher->dispatch(Events::PRODUCT_DELETED, $event);

        return $result;
    }

    /**
     * @param ContentType $contentType
     * @param $itemData
     * @return array|bool
     */
    public function blockItem(ContentType $contentType, $itemData)
    {
        $collection = $this->getCollection($contentType->getCollection());
        $result = $collection->update(
            [
                '_id' => $itemData['_id']
            ],
            [
                '$set' => ['isActive' => !$itemData['isActive']]
            ]
        );

        $categoryId = isset($itemData['parentId']) ? $itemData['parentId'] : 0;
        $this->onAfterUpdateItem($contentType, $itemData, $categoryId);

        return $result;
    }

    /**
     * @Route("/{categoryId}/{itemId}", name="category_product", methods={"GET"})
     * @ParamConverter("category", class="AppMainBundle:Category", options={"id" = "categoryId"})
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

        $collection = $this->getCollection($contentType->getCollection());

        $entity = $collection->findOne(['_id' => $itemId]);
        if(!$entity){
            return $this->setError('Product not found.');
        }

        return new JsonResponse(array_merge($entity, ['id' => $entity['_id']]));
    }

    /**
     * Sorting additional fields
     * @param string $collectionName
     * @param array $document
     * @param array $fieldsSort
     * @return bool
     */
    public function sortAdditionalFields($collectionName, $document, $fieldsSort)
    {
        $collection = $this->getCollection($collectionName);
        $docKeys = array_keys($document);
        $itemId = isset($document['_id']) ? $document['_id'] : 0;
        if (!$itemId) {
            return false;
        }

        $additFields = [];
        foreach ($document as $key => $value) {
            if (in_array($key, ['id', '_id', 'parentId', 'isActive'])) {
                continue;
            }
            if (strpos($key, '__') !== false) {
                $tmp = explode('__', $key);
                if (!empty($tmp[1]) && is_numeric($tmp[1])) {
                    if (!empty($value)) {
                        $additFields[$key] = $value;
                    }
                    unset($document[$key]);
                    continue;
                }
            }
            $document[$key] = $value;
        }
        if (empty($additFields)) {
            return false;
        }

        // Sort additional fields
        uksort($additFields, function($a, $b) use ($fieldsSort) {
            return (array_search($a, $fieldsSort) < array_search($b, $fieldsSort)) ? -1 : 1;
        });

        // Merge fields
        $docKeysData = [];
        foreach ($additFields as $k => $v) {
            $fieldBaseName = ContentType::getCleanFieldName($k);
            if (!isset($docKeysData[$fieldBaseName])) {
                $docKeysData[$fieldBaseName] = 0;
            }
            $docKeysData[$fieldBaseName]++;
            $document[$fieldBaseName . '__' . $docKeysData[$fieldBaseName]] = $v;
        }

        // Collect unused additional fields
        $unset = [];
        $unusedKeys = array_diff($docKeys, array_keys($document));
        foreach ($unusedKeys as $k) {
            $unset[$k] = 1;
        }

        $unsetQuery = !empty($unset) ? ['$unset' => $unset] : [];
        $result = $collection->update(
            ['_id' => $itemId],
            array_merge(['$set' => $document], $unsetQuery)
        );

        return !empty($result['ok']);
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
     * @param array $itemData
     * @param int $categoryId
     */
    public function onAfterUpdateItem(ContentType $contentType, $itemData, $categoryId = 0)
    {
        if ($categoryId) {
            $categoriesRepository = $this->getCategoriesRepository();
            /** @var Category $category */
            $category = $categoriesRepository->find($categoryId);
            if ($category) {
                $this->updateFiltersData($category);
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

        $filesDirPath = $this->getParameter('app.files_dir_path');

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
     * @param bool $updateParents
     * @param bool $mixFromChilds
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateFiltersData(Category $parentCategory, $databaseName = '', $updateParents = false, $mixFromChilds = false)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $categoriesRepository = $this->getCategoriesRepository();

        if ($updateParents) {
            $categoriesData = $categoriesRepository->getBreadcrumbs($parentCategory->getUri(), false);
            $categoriesData = array_reverse($categoriesData);
        } else {
            $categoriesData = [$parentCategory->getMenuData()];
        }

        if (empty($categoriesData)) {
            return false;
        }

        foreach ($categoriesData as $category) {
            $categoryId = $category['id'];

            /** @var Category $cat */
            $cat = $categoriesRepository->find($categoryId);

            /** @var ContentType $contentType */
            $contentType = $cat->getContentType();
            $contentTypeFields = $contentType->getFields();
            $collection = $this->getCollection($contentType->getCollection(), $databaseName);

            $filterData = [];

            // Mix from child categories
            if ($mixFromChilds) {
                $childCategories = $categoriesRepository->findBy([
                    'parentId' => $cat->getId(),
                    'isActive' => true
                ]);

                /** @var Category $childCategory */
                foreach ($childCategories as $childCategory) {
                    /** @var Filter $flt */
                    $flt = $childCategory->getFilterData();
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
            }

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

                $uniqueValues = array_filter($uniqueValues, function($val) {
                    return !empty($val);
                });

                if (!empty($uniqueValues)) {
                    if (!isset($filterData[$fieldName])) {
                        $filterData[$fieldName] = [];
                    }
                    $filterData[$fieldName] = array_unique(array_merge($filterData[$fieldName], $uniqueValues));
                    sort($filterData[$fieldName]);
                }
            }

            $filter = $cat->getFilterData();
            if (!$filter) {
                if (empty($filterData)) {
                    continue;
                }
                $filter = new Filter();
                $filter->setCategory($cat);
                $cat->setFilterData($filter);
            } else {
                if (empty($filterData)) {
                    $dm->remove($filter);
                    $dm->flush();
                    continue;
                }
            }
            $filter->setValues($filterData);

            $dm->flush();
        }

        return true;
    }

    /**
     * @return \App\Repository\CategoryRepository
     */
    public function getCategoriesRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
    }

    /**
     * @return \App\Repository\FileDocumentRepository
     */
    public function getFileDocumentRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(FileDocument::class);
    }

}