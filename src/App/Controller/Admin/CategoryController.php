<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\FileDocument;
use App\Service\CatalogService;
use App\Service\SettingsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Event\CategoryUpdatedEvent;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;

/**
 * Class ContentTypeController
 * @package App\Controller
 * @Route("/admin/categories")
 */
class CategoryController extends StorageControllerAbstract
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
     * @param $queryString
     * @return mixed
     */
    public function getQueryOptions($queryString)
    {
        parse_str($queryString, $options);
        if (!isset($options['limit'])) {
            $options['limit'] = 0;
        }
        if (!isset($options['only_active'])) {
            $options['only_active'] = 0;
        }
        return $options;
    }

    /**
     * @param $data
     * @param int $itemId
     * @return array
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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
        if ($this->checkNameExists($data['name'], $itemId, $data['parentId'])) {
            return ['success' => false, 'msg' => 'System name already exists.'];
        }

        return ['success' => true];
    }

    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function createUpdate($data, $itemId = null)
    {
        $previousParentId = 0;
        if($itemId === null || !is_numeric($itemId)){
            $item = new Category();
        } else {
            /** @var Category $item */
            $item = $this->getRepository()->find((int) $itemId);
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
        $contentType = $this->dm->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $data['contentTypeName']
            ]);

        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $oldImageData = $item->getId() ? $item->getImage() : null;
        $oldName = $item->getName();

        $item
            ->setTitle($data['title'])
            ->setName($data['name'])
            ->setImage($data['image'] ?? null)
            ->setDescription($data['description'] ?? '')
            ->setIsActive($data['isActive'] ?? true)
            ->setParentId($data['parentId'] ?? 0)
            ->setMenuIndex($data['menuIndex'] ?? 0)
            ->setContentTypeName($data['contentTypeName'])
            ->setContentType($contentType)
            ->setTranslations($data['translations'] ?? []);
        
        if (!$item->getId()) {
            $this->dm->persist($item);
        }
        $this->dm->flush();

        // Dispatch event
        $event = new CategoryUpdatedEvent($this->dm, $item, $previousParentId, $oldName);
        $item = $this->eventDispatcher->dispatch($event, CategoryUpdatedEvent::NAME)->getCategory();

        // Delete unused files
        if (empty($item->getImage()) && !empty($oldImageData)) {
            $fileController = new FileController(
                $this->params,
                $this->dm,
                $this->translator,
                $this->catalogService,
                $this->settingsService
            );
            $fileController->setContainer($this->container);
            $fileController->deleteUnused(FileDocument::OWNER_CATEGORY, $item->getId());
        }

        // Clear file cache
        if (!empty($data['clearCache'])) {
            $this->cacheAdapter->clear();
        }

        return $this->json($item, 200, [], ['groups' => ['details']]);
    }

    /**
     * @Route("/tree/{parentId}",
     *     methods={"GET"},
     *     requirements={"parentId": "\d+"},
     *     defaults={"parentId": "0"}
     * )
     * @param Request $request
     * @param int $parentId
     * @return JsonResponse
     */
    public function getTree(Request $request, $parentId)
    {
        $expanded = (bool) $request->get('expanded', false);
        $tree = $this->getCategoriesTree($parentId, $expanded);
        return $this->json($tree);
    }

    /**
     * @param int $parentId
     * @param bool $expanded
     * @return array
     */
    public function getCategoriesTree($parentId = 0, $expanded = true)
    {
        $categoriesRepository = $this->dm->getRepository(Category::class);

        $categories = $categoriesRepository->findBy([], [
            'menuIndex' => 'asc',
            'title' => 'asc'
        ]);

        $data = [];
        $root = [
            'id' => $parentId,
            'key' => $parentId,
            'label' => $this->translator->trans('Root category'),
            'parentId' => 0,
            'expanded' => true
        ];
        /** @var Category $category */
        foreach ($categories as $category) {
            if (!$category->getId()) {
                continue;
            }
            $row = [
                'id' => $category->getId(),
                'key' => $category->getId(),
                'label' => $category->getTitle(),
                'parentId' => $category->getParentId(),
                'expanded' => $expanded
            ];
            if (!isset($data[$row['parentId']])) {
                $data[$row['parentId']] = [];
            }
            $data[$row['parentId']][] = $row;
        }

        return CatalogService::createTree($data, [$root]);
    }

    /**
     * @Route("/{itemId}", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param int $itemId
     * @param EventDispatcherInterface $evenDispatcher
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function deleteItemAction($itemId, EventDispatcherInterface $evenDispatcher)
    {
        $repository = $this->getRepository();

        /** @var Category $item */
        $item = $repository->find($itemId);
        if(!$item){
            return $this->setError($this->translator->trans('Item not found.', [], 'validators'));
        }
        
        $previousParentId = $item->getParentId();
        $children = $repository->getChildren($item, [$item]);
        $children = array_reverse($children);

        /** @var Category $child */
        foreach ($children as $child) {
            $this->deleteProductsByCategory($child, false);
            
            $this->dm->remove($child);
            $this->dm->flush();
    
            $this->dm->detach($child);
            $child->setId(null);

            //Dispatch event
            $event = new CategoryUpdatedEvent($this->dm, $child, $previousParentId);
            $evenDispatcher->dispatch($event, CategoryUpdatedEvent::NAME);
        }

        // Clear file cache
        $this->cacheAdapter->clear();

        return $this->json([
            'success' => true
        ]);
    }

    /**
     * Delete category nested products
     * @param Category $category
     * @param bool $clearCache
     * @return bool
     */
    public function deleteProductsByCategory(Category $category, $clearCache = true)
    {
        $contentType = $category->getContentType();
        if (!$contentType) {
            return false;
        }
        $collectionName = $contentType->getCollection();
        $collection = $this->catalogService->getCollection($collectionName);

        $count = $collection->countDocuments([
            'parentId' => $category->getId()
        ]);
        $skipEvents = $count > 500;// TODO: Add confirm in UI

        if ($skipEvents) {
            try {
                $result = $collection->deleteMany([
                    'parentId' => $category->getId()
                ]);
            } catch (\Exception $e) {
                $result = null;
            }
            return !empty($result);

        } else {
            $productController = new ProductController(
                $this->params,
                $this->dm,
                $this->translator,
                $this->eventDispatcher,
                $this->cacheAdapter,
                $this->catalogService,
                $this->settingsService
            );
            $documents = $collection->find([
                'parentId' => $category->getId()
            ]);
            foreach ($documents as $document) {
                $productController->deleteItem($contentType, $document, $clearCache, $skipEvents);
            }
            return true;
        }
    }

    /**
     * @return \App\Repository\CategoryRepository|ObjectRepository
     */
    public function getRepository()
    {
        return $this->dm->getRepository(Category::class);
    }
}
