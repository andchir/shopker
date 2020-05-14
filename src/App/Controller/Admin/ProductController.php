<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\Events;
use App\Service\CatalogService;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use \Mimey\MimeTypes;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class ProductController
 * @package App\Controller
 * @Route("/admin/products")
 */
class ProductController extends BaseController
{
    /** @var EventDispatcherInterface */
    protected $eventDispatcher;
    /** @var FilesystemAdapter */
    protected $cacheAdapter;
    /** @var CatalogService */
    protected $catalogService;
    /** @var SettingsService */
    protected $settingsService;
    
    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        TranslatorInterface $translator,
        EventDispatcherInterface $eventDispatcher,
        FilesystemAdapter $cacheAdapter,
        CatalogService $catalogService,
        SettingsService $settingsService
    )
    {
        parent::__construct($params, $dm, $translator);
        $this->eventDispatcher = $eventDispatcher;
        $this->cacheAdapter = $cacheAdapter;
        $this->catalogService = $catalogService;
        $this->settingsService = $settingsService;
    }
    
    /**
     * @Route("/{categoryId}", name="category_product_list", methods={"GET"})
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
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
            return $this->setError($this->translator->trans('Content type not found.', [], 'validators'));
        }

        $queryString = $request->getQueryString();
        $queryOptions = UtilsService::getQueryOptions('', $queryString, $contentType->getFields());
        $contentTypeFields = $contentType->getFields();
        $collection = $this->catalogService->getCollection($contentType->getCollection());

        $skip = ($queryOptions['page'] - 1) * $queryOptions['limit'];

        $data = [];
        $results = $collection->find([
            'parentId' => $category->getId()
        ], [
            'sort' => $queryOptions['sortOptionsAggregation'],
            'skip' => $skip,
            'limit' => $queryOptions['limit']
        ]);

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

        $total = $collection->countDocuments([
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
            if($error = $this->catalogService->validateField($data[$field['name']], $field, [], $collectionName, $category->getId(), $itemId)){
                break;
            }
        }

        return [
            'success' => empty($error),
            'msg' => $error
        ];
    }

    /**
     * @Route("/{categoryId}", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function createItemAction(Request $request, Category $category = null)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data, $category);
        if(!$output['success']){
            return $this->setError($this->translator->trans($output['msg'], [], 'validators'));
        }

        return $this->createUpdate($data, $category);
    }

    /**
     * @Route("/{categoryId}/{itemId}", methods={"PUT"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateItemAction(Request $request, Category $category, $itemId)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data, $category, $itemId);
        if(!$output['success']){
            return $this->setError($this->translator->trans($output['msg'], [], 'validators'));
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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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

        $collection = $this->catalogService->getCollection($contentType->getCollection());
        if (!$collection) {
            return $this->setError('Item not saved.');
        }
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
                        $previousCollection = $this->catalogService->getCollection($previousContentType->getCollection());
                        $document = $previousCollection->findOne(['_id' => $itemId]);
                        if (!$document) {
                            return $this->setError('Item not found.');
                        }
                        $previousCollection->deleteOne([
                            '_id' => $itemId
                        ]);
                        $itemId = null;
                        $document['_id'] = $this->catalogService->getNextId($contentType->getCollection());
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
                '_id' => $this->catalogService->getNextId($contentType->getCollection())
            ];
        }

        $document['parentId'] = intval($parentId);
        $document['translations'] = $data['translations'] ?? null;
        $document['isActive'] = isset($data['isActive'])
            ? $data['isActive']
            : true;

        $additFieldsUnused = [];
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
                // Delete empty additional fields
                if (!$value && strpos($key, '__') !== false) {
                    $additFieldsUnused[] = $key;
                    unset($document[$key]);
                    continue;
                }
                if (isset($value['fileId']) && $value['fileId'] === 0) {
                    $fileFields[] = $key;
                } else if (!empty($value['fileId'])) {
                    $fileIds[] = $value['fileId'];
                }
            }

            $document[$key] = $value;
        }

        // Dispatch event
        $event = new GenericEvent($document, ['contentType' => $contentType]);

        // Save document
        if($itemId){
            try {
                $update = ['$set' => $document];
                if (!empty($additFieldsUnused)) {
                    $update['$unset'] = array_fill_keys($additFieldsUnused, '');
                }
                $result = $collection->updateOne(
                    ['_id' => $itemId],
                    $update
                );
            } catch (\Exception $e) {
                $result = null;
            }
            $this->eventDispatcher->dispatch($event, Events::PRODUCT_UPDATED);
        }
        else {
            try {
                $result = $collection->insertOne($document);
            } catch (\Exception $e) {
                $result = null;
            }

            $this->eventDispatcher->dispatch($event, Events::PRODUCT_CREATED);
            $this->eventDispatcher->dispatch($event, Events::PRODUCT_UPDATED);
        }

        if (!empty($document['translations'])) {
            //$this->updateTranslationsTextIndex($document, $collection);
        }

        // If $fileFields is not empty it will be done after saving the files
        // Otherwise do it now
        if (empty($fileFields) && !empty($fileIds)) {
            $fileIds = array_unique($fileIds);
            $fileController = new FileController(
                $this->params,
                $this->dm,
                $this->translator,
                $this->catalogService,
                $this->settingsService
            );
            $fileController->deleteUnused($contentType->getName(), $itemId, $fileIds);
        }
        if (!empty($fieldsSort)) {
            $this->catalogService->sortAdditionalFields($contentType->getCollection(), $document, $fieldsSort);
        }

        // Clear file cache
        if (!empty($data['clearCache'])) {
            $this->cacheAdapter->clear();
        }

        if (!empty($result)) {
            return new JsonResponse($document);
        } else {
            return $this->setError('Item not saved.');
        }
    }

    /**
     * @Route(
     *     "/{categoryId}/{action}/batch",
     *     requirements={"action"=".+"},
     *     defaults={"action": "delete"},
     *     methods={"POST"}
     * )
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
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

        $collection = $this->catalogService->getCollection($contentType->getCollection());
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
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     */
    public function deleteItemAction($category, $itemId)
    {
        if (!$category) {
            return $this->setError($this->translator->trans('Category not found.', [], 'validators'));
        }
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if (!$contentType) {
            return $this->setError($this->translator->trans('Content type not found.', [], 'validators'));
        }

        $collectionName = $contentType->getCollection();
        $collection = $this->catalogService->getCollection($collectionName);
        $document = $collection->findOne(['_id' => $itemId]);

        if(!$document){
            return $this->setError($this->translator->trans('Document not found.', [], 'validators'));
        }

        $result = $this->deleteItem($contentType, $document);

        if ($result) {
            return new JsonResponse([]);
        } else {
            return $this->setError('Error.');
        }
    }

    /**
     * @param ContentType $contentType
     * @param $itemData
     * @param bool $clearCache
     * @param bool $skipEvents
     * @return array|bool
     */
    public function deleteItem(ContentType $contentType, $itemData, $clearCache = true, $skipEvents = false)
    {
        $collection = $this->catalogService->getCollection($contentType->getCollection());
        try {
            $result = $collection->deleteOne([
                '_id' => $itemData['_id']
            ]);
        } catch (\Exception $e) {
            $result = false;
        }
        if (empty($result)) {
            return $result;
        }

        if (!$skipEvents) {
            // Dispatch event
            $event = new GenericEvent($itemData, ['contentType' => $contentType]);
            $this->eventDispatcher->dispatch($event, Events::PRODUCT_DELETED);
            $this->eventDispatcher->dispatch($event, Events::PRODUCT_UPDATED);
        }

        if ($clearCache) {
            $this->cacheAdapter->clear();
        }

        return $result;
    }

    /**
     * @param ContentType $contentType
     * @param $itemData
     * @return array|bool
     */
    public function blockItem(ContentType $contentType, $itemData)
    {
        $collection = $this->catalogService->getCollection($contentType->getCollection());
        try {
            $result = $collection->updateOne(
                [
                    '_id' => $itemData['_id']
                ],
                [
                    '$set' => ['isActive' => !$itemData['isActive']]
                ]
            );
        } catch (\Exception $e) {
            $result = false;
        }

        // Dispatch event
        $event = new GenericEvent($itemData, ['contentType' => $contentType]);
        $this->eventDispatcher->dispatch($event, Events::PRODUCT_UPDATED);

        // Clear file cache
        $this->cacheAdapter->clear();

        return $result;
    }

    /**
     * @Route("/{categoryId}/{itemId}", name="category_product", methods={"GET"})
     * @ParamConverter("category", class="App\MainBundle\Document\Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @param int $itemId
     * @return JsonResponse
     */
    public function getOneByCategory(Request $request, Category $category, $itemId)
    {
        if(!$category){
            return $this->setError('Category not found.');
        }
        $itemId = intval($itemId);

        $contentType = $category->getContentType();
        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $collection = $this->catalogService->getCollection($contentType->getCollection());

        $entity = $collection->findOne(['_id' => $itemId]);
        if(!$entity){
            return $this->setError('Product not found.');
        }

        return new JsonResponse(array_merge($entity, ['id' => $entity['_id']]));
    }

    /**
     * @param ContentType $contentType
     * @param string $fieldName
     * @param int $fileId
     * @param array $ids
     * @return int
     */
    public function getUsedOtherTotal(ContentType $contentType, $fieldName, $fileId, $ids = []) {
        $collection = $this->catalogService->getCollection($contentType->getCollection());
        return $collection->countDocuments([
            '_id' => ['$nin' => $ids],
            $fieldName . '.fileId' =>  $fileId
        ]);
    }

    /**
     * @param $itemId
     * @param $ownerType
     * @param int $ownerId
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function deleteFile($itemId, $ownerType, $ownerId = 0)
    {
        $fileDocumentRepository = $this->getFileDocumentRepository();

        $where = [
            'id' => $itemId,
            'ownerType' => $ownerType
        ];
        if ($ownerId) {
            $where['ownerId'] = $ownerId;
        }

        $fileDocument = $fileDocumentRepository->findOneBy($where);

        $filesDirPath = $this->params->get('app.files_dir_path');

        if ($fileDocument) {
            $fileDocument->setUploadRootDir($filesDirPath);
            $this->dm->remove($fileDocument);
            $this->dm->flush();
        }

        return true;
    }

    /**
     * @return \App\Repository\CategoryRepository|ObjectRepository
     */
    public function getCategoriesRepository()
    {
        return $this->dm->getRepository(Category::class);
    }

    /**
     * @return \App\Repository\FileDocumentRepository|ObjectRepository
     */
    public function getFileDocumentRepository()
    {
        return $this->dm->getRepository(FileDocument::class);
    }
}
