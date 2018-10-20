<?php

namespace App\EventSubscriber;

use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\Order;
use App\Events;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class ProductSubscriber implements EventSubscriberInterface
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

    public static function getSubscribedEvents()
    {
        return [
            Events::PRODUCT_DELETED => 'onProductDeleted',
        ];
    }

    public function onProductDeleted(GenericEvent $event)
    {
        $itemData = $event->getSubject();
        /** @var ContentType $contentType */
        $contentType = $event->getArgument('contentType');

        $contentTypeFields = $contentType->getFields();

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->container->get('doctrine_mongodb.odm.document_manager');
        $fileDocumentRepository = $dm->getRepository(FileDocument::class);

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
                    $dm->remove($fileDocument);
                    $dm->flush();
                }
            }
        }
    }
}

