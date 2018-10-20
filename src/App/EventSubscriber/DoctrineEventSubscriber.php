<?php

namespace App\EventSubscriber;

use App\Controller\Admin\ProductController;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\OrderContent;
use Doctrine\Common\EventSubscriber;
use Doctrine\ODM\MongoDB\Event\LifecycleEventArgs;
use Doctrine\ODM\MongoDB\Events;
use Symfony\Component\DependencyInjection\ContainerInterface;

class DoctrineEventSubscriber implements EventSubscriber
{

    /** @var ContainerInterface */
    private $container;

    /**
     * DoctrineEventSubscriber constructor.
     * @param $container
     */
    public function __construct($container) {
        $this->container = $container;
    }

    /**
     * @return array
     */
    public function getSubscribedEvents()
    {
        return [
            Events::postRemove => 'postRemove',
            Events::postPersist => 'postPersist',
            Events::postUpdate => 'postUpdate'
        ];
    }

    /**
     * @param LifecycleEventArgs $args
     */
    public function postRemove(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        $filesDirPath = $this->container->getParameter('app.files_dir_path');

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->container->get('doctrine_mongodb.odm.document_manager');
        $fileDocumentRepository = $dm->getRepository(FileDocument::class);

        if ($document instanceof FileDocument) {
            /** @var FileDocument $document */
            $document->setUploadRootDir($filesDirPath);
            $document->removeFile();
        }
        else if ($document instanceof OrderContent) {
            /** @var OrderContent $document */
            $files = $document->getFiles();
            foreach ($files as $fileData) {
                if (!isset($fileData['fileId'])) {
                    continue;
                }
                /** @var FileDocument $fileDocument */
                $fileDocument = $fileDocumentRepository->find($fileData['fileId']);
                if ($fileDocument) {
                    $dm->remove($fileDocument);
                    $dm->flush();
                }
            }
        }
    }

    /**
     * @param LifecycleEventArgs $args
     */
    public function postPersist(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        if ($document instanceof ContentType) {
            $this->contentTypeUpdateFilters($document);
        }
    }

    public function postUpdate(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        if ($document instanceof ContentType) {
            $this->contentTypeUpdateFilters($document);
        }
    }

    /**
     * @param ContentType $contentType
     */
    public function contentTypeUpdateFilters(ContentType $contentType)
    {
        $productController = new ProductController();
        $productController->setContainer($this->container);

        /** @var ContentType $document */
        $categories = $contentType->getCategories();
        /** @var Category $category */
        foreach ($categories as $category) {
            $productController->updateFiltersData($category);
        }
    }

}
