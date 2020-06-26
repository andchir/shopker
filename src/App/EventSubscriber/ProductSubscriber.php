<?php

namespace App\EventSubscriber;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\Events;
use App\Service\CatalogService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class ProductSubscriber implements EventSubscriberInterface
{

    /** @var CatalogService */
    protected $catalogService;
    /** @var DocumentManager */
    protected $dm;
    
    public function __construct(ContainerInterface $container, CatalogService $catalogService, DocumentManager $dm) {
        $this->catalogService = $catalogService;
        $this->dm = $dm;
    }

    public static function getSubscribedEvents()
    {
        return [
            Events::PRODUCT_DELETED => 'onProductDeleted',
            Events::PRODUCT_CREATED => 'onProductCreated',
            Events::PRODUCT_UPDATED => 'onProductUpdated'
        ];
    }

    /**
     * @param GenericEvent $event
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function onProductDeleted(GenericEvent $event)
    {
        $itemData = $event->getSubject();
        /** @var ContentType $contentType */
        $contentType = $event->getArgument('contentType');

        $contentTypeFields = $contentType->getFields();
        
        $fileDocumentRepository = $this->dm->getRepository(FileDocument::class);

        foreach ($itemData as $key => $val) {
            $fieldName = ContentType::getCleanFieldName($key);
            $fIndex = array_search($fieldName, array_column($contentTypeFields, 'name'));
            if ($fIndex === false) {
                continue;
            }
            $field = $contentTypeFields[$fIndex];

            // Delete file
            if ($field['inputType'] == 'file' && !empty($val['fileId'])) {

                /** @var FileDocument $fileDocument */
                $fileDocument = $fileDocumentRepository->find($val['fileId']);
                if ($fileDocument) {
                    $this->dm->remove($fileDocument);
                    $this->dm->flush();
                }
            }
        }
        if ($itemData['parentId']) {
            $this->updateCategoryFilters($itemData['parentId'], $itemData);
        }
    }
    
    public function onProductCreated(GenericEvent $event)
    {
        
        
    }

    /**
     * @param GenericEvent $event
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function onProductUpdated(GenericEvent $event)
    {
        $itemData = $event->getSubject();
        if ($itemData['parentId']) {
            $this->updateCategoryFilters($itemData['parentId'], $itemData);
        }
    }

    /**
     * @param $categoryId
     * @param $itemData
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateCategoryFilters($categoryId, $itemData)
    {
        $categoriesRepository = $this->dm->getRepository(Category::class);
        /** @var Category $category */
        $category = $categoriesRepository->find($categoryId);
        if ($category) {
            $this->catalogService->updateFiltersData($category);
            
            // Update filters for additional categories
            /** @var ContentType $contentType */
            $contentType = $category->getContentType();
            $categoriesFieldName = $contentType->getCategoriesFieldName();
            if (!empty($itemData[$categoriesFieldName])) {
                foreach ($itemData[$categoriesFieldName] as $catId) {
                    if ($categoryId === $catId) {
                        continue;
                    }
                    $category = $categoriesRepository->find($catId);
                    if ($category) {
                        $this->catalogService->updateFiltersData($category);
                    }
                }
            }
        }
    }
}
