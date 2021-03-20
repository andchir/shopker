<?php

namespace App\EventSubscriber;

use App\Controller\Admin\ProductController;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\OrderContent;
use App\Service\CatalogService;
use Doctrine\Common\EventSubscriber;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Event\LifecycleEventArgs;
use Doctrine\ODM\MongoDB\Events;
use Symfony\Component\DependencyInjection\ContainerInterface;

class DoctrineEventSubscriber implements EventSubscriber
{

    /** @var ContainerInterface */
    private $container;

    /** @var CatalogService */
    private $catalogService;
    
    /** @var DocumentManager */
    protected $dm;

    /**
     * DoctrineEventSubscriber constructor.
     * @param ContainerInterface $container
     * @param CatalogService $catalogService
     */
    public function __construct(
        ContainerInterface $container,
        CatalogService $catalogService,
        DocumentManager $dm
    ) {
        $this->container = $container;
        $this->catalogService = $catalogService;
        $this->dm = $dm;
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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function postRemove(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        $filesDirPath = $this->container->getParameter('app.files_dir_path');
        
        $fileDocumentRepository = $this->dm->getRepository(FileDocument::class);

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
                    $this->dm->remove($fileDocument);
                }
            }
        }
        else if ($document instanceof Category) {
            /** @var Category $document */
            $fileData = $document->getImage();
            if (!empty($fileData) && !empty($fileData['fileId'])) {
                /** @var FileDocument $fileDocument */
                $fileDocument = $fileDocumentRepository->find($fileData['fileId']);
                if ($fileDocument) {
                    $this->dm->remove($fileDocument);
                }
            }
        }
    }

    /**
     * @param LifecycleEventArgs $args
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function postPersist(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
    }

    /**
     * @param LifecycleEventArgs $args
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function postUpdate(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
    }
}
