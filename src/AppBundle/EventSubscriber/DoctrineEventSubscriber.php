<?php

namespace AppBundle\EventSubscriber;

use AppBundle\Document\FileDocument;
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

        if ($document instanceof FileDocument) {

            $filesDirPath = $this->container->getParameter('files_dir_path');

            /** @var FileDocument $document */
            $document->setUploadRootDir($filesDirPath);

            $document->removeFile();
        }
    }

}
