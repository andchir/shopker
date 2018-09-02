<?php

namespace AppBundle\EventSubscriber;

use AppBundle\Document\FileDocument;
use AppBundle\Document\OrderContent;
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
            Events::postRemove => 'postRemove'
        ];
    }

    /**
     * @param LifecycleEventArgs $args
     */
    public function postRemove(LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        $filesDirPath = $this->container->getParameter('files_dir_path');

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

}
