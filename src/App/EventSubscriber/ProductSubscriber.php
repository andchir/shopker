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
    }
    
    public function onProductCreated(GenericEvent $event)
    {
        
        
    }

    public function onProductUpdated(GenericEvent $event)
    {
        $itemData = $event->getSubject();

        if ($itemData['parentId']) {
            $categoriesRepository = $this->dm->getRepository(Category::class);
            /** @var Category $category */
            $category = $categoriesRepository->find($itemData['parentId']);
            if ($category) {
                $this->catalogService->updateFiltersData($category);
            }
        }
    }
}

