<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\FileDocument;
use App\Service\CatalogService;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Event\CategoryUpdatedEvent;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class ContentTypeController
 * @package App\Controller
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
        if (!isset($options['only_active'])) {
            $options['only_active'] = 0;
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
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $data['contentTypeName']
            ]);

        if(!$contentType){
            return $this->setError('Content type not found.');
        }

        $oldImageData = $item->getId() ? $item->getImage() : null;

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

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        if (!$item->getId()) {
            $dm->persist($item);
        }
        $dm->flush();

        // Dispatch event
        $evenDispatcher = $this->get('event_dispatcher');
        $event = new CategoryUpdatedEvent($dm, $item, $previousParentId);
        $item = $evenDispatcher->dispatch($event, CategoryUpdatedEvent::NAME)->getCategory();

        // Delete unused files
        if (empty($item->getImage()) && !empty($oldImageData)) {
            $fileController = new FileController();
            $fileController->setContainer($this->container);
            $fileController->deleteUnused(FileDocument::OWNER_CATEGORY, $item->getId());
        }

        // Clear file cache
        if (!empty($data['clearCache'])) {
            /** @var FilesystemAdapter $cache */
            $cache = $this->get('app.filecache');
            $cache->clear();
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
        return new JsonResponse($tree);
    }

    /**
     * @param int $parentId
     * @param bool $expanded
     * @return array
     */
    public function getCategoriesTree($parentId = 0, $expanded = true)
    {
        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');
        $categoriesRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);

        $categories = $categoriesRepository->findBy([], [
            'menuIndex' => 'asc',
            'title' => 'asc'
        ]);

        $data = [];
        $root = [
            'id' => $parentId,
            'label' => $translator->trans('Root category'),
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
     * @param TranslatorInterface $translator
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function deleteItemAction($itemId, TranslatorInterface $translator)
    {
        $repository = $this->getRepository();

        /** @var Category $item */
        $item = $repository->find($itemId);
        if(!$item){
            return $this->setError($translator->trans('Item not found.', [], 'validators'));
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        /** @var EventDispatcher $evenDispatcher */
        $evenDispatcher = $this->get('event_dispatcher');
        $previousParentId = $item->getParentId();
        $children = $repository->getChildren($item, [$item]);
        $children = array_reverse($children);

        /** @var Category $child */
        foreach ($children as $child) {
            $this->deleteProductsByCategory($child, false);

            $dm->remove($child);
            $dm->flush();

            $child->setId(null);

            //Dispatch event
            $event = new CategoryUpdatedEvent($dm, $child, $previousParentId);
            $evenDispatcher->dispatch($event, CategoryUpdatedEvent::NAME);
        }

        // Clear file cache
        /** @var FilesystemAdapter $cache */
        $cache = $this->get('app.filecache');
        $cache->clear();

        return new JsonResponse([]);
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
        if ($contentType) {

            $productController = new ProductController();
            $productController->setContainer($this->container);

            $collectionName = $contentType->getCollection();
            $collection = $this->getCollection($collectionName);

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
                $documents = $collection->find([
                    'parentId' => $category->getId()
                ]);
                foreach ($documents as $document) {
                    $productController->deleteItem($contentType, $document, $clearCache, $skipEvents);
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @param $collectionName
     * @param string $databaseName
     * @return \MongoDB\Collection
     */
    public function getCollection($collectionName, $databaseName = '')
    {
        if (!$databaseName) {
            $databaseName = $this->getParameter('mongodb_database');
        }
        /** @var \MongoDB\Client $mongodbClient */
        $mongodbClient = $this->container->get('doctrine_mongodb.odm.default_connection');

        return $mongodbClient->selectCollection($databaseName, $collectionName);
    }

    /**
     * @return \App\Repository\CategoryRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
    }

}
