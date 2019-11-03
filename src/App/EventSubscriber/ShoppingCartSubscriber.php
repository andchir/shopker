<?php

namespace App\EventSubscriber;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\Order;
use App\Events;
use App\Repository\CategoryRepository;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\MongoDB\Database;

class ShoppingCartSubscriber implements EventSubscriberInterface
{

    /** @var ContainerInterface */
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public static function getSubscribedEvents()
    {
        return [
            Events::SHOPPING_CART_ADD_PRODUCT => 'onAddProduct'
        ];
    }

    public function onAddProduct(GenericEvent $event)
    {
        /** @var Request $request */
        $request = $event->getSubject();

        $itemId = (int) $request->get('item_id', 0);
        $itemCount = (int) $request->get('count', 1);
        $categoryId = (int) $request->get('category_id', 1);

        /** @var CategoryRepository $categoryRepository */
        $categoriesRepository = $this->container->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);

        /** @var Category $category */
        $category = $categoriesRepository->findOneBy([
            'id' => $categoryId
        ]);
        if (!$category) {
            $event->setArgument('error', 'Category not found.');
            return false;
        }

        $contentType = $category->getContentType();
        $contentTypeName = $contentType->getName();
        $collectionName = $contentType->getCollection();
        $collection = $this->getCollection($collectionName);

        $productDocument = $collection->findOne([
            '_id' => $itemId,
            'isActive' => true
        ]);
        if (!$productDocument) {
            $event->setArgument('error', 'Item not found.');
            return false;
        }

        $parentUri = $category->getUri();
        $priceFieldName = $contentType->getPriceFieldName();
        $titleField = $contentType->getFieldByChunkName('header');
        $systemNameField = $contentType->getSystemNameField();

        $event->setArgument('id', $itemId);
        $event->setArgument('contentTypeName', $contentTypeName);
        $event->setArgument('title', $titleField ? $productDocument[$titleField] : '');
        $event->setArgument('systemName', $systemNameField ? $productDocument[$systemNameField] : '');
        $event->setArgument('price', $priceFieldName ? $productDocument[$priceFieldName] : 0);
        $event->setArgument('parentUri', $parentUri);
        $event->setArgument('count', $itemCount);
        $event->setArgument('image', '');
        $event->setArgument('parameters', []);
        $event->setArgument('files', []);

        return true;
    }

    /**
     * @param $collectionName
     * @param string $databaseName
     * @return \Doctrine\MongoDB\Collection
     */
    public function getCollection($collectionName, $databaseName = '')
    {
        if (!$databaseName) {
            $databaseName = $this->container->getParameter('mongodb_database');
        }
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        /** @var Database $db */
        $db = $m->selectDatabase($databaseName);
        return $db->createCollection($collectionName);
    }

}
