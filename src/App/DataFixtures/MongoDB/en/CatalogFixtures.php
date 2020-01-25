<?php

namespace App\DataFixtures\MongoDB\en;

use App\Service\CatalogService;
use App\Service\SettingsService;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Doctrine\Bundle\MongoDBBundle\Fixture\Fixture;
use Doctrine\Bundle\MongoDBBundle\Fixture\FixtureGroupInterface;
use Doctrine\Common\Persistence\ObjectManager;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Category;
use App\Event\CategoryUpdatedEvent;
use App\EventListener\CategoryUpdateListener;

class CatalogFixtures extends Fixture implements ContainerAwareInterface, FixtureGroupInterface
{

    public const CONTENT_TYPE_CATALOG_REFERENCE = 'content_type_catalog';
    public const CONTENT_TYPE_TEXT_REFERENCE = 'content_type_text';

    /** @var ContainerInterface */
    private $container;
    /** @var CatalogService  */
    private $catalogService;
    /** @var SettingsService  */
    private $settingsService;
    /** @var EventDispatcherInterface  */
    private $dispatcher;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
        $this->catalogService = $container->get('app.catalog');
        $this->settingsService = $container->get('app.settings');
        $this->dispatcher = $this->container->get('event_dispatcher');
    }

    public function load(ObjectManager $manager)
    {
        $settings = $this->settingsService->getSettingsFromYaml('settings', false);
        $this->catalogService->setDocumentManager($manager);

        $incrementIdsCollection = $this->catalogService->getCollection('doctrine_increment_ids', $settings['mongodb_database']);
        $incrementIdsCollection->drop();

        $categoryUpdateListener = new CategoryUpdateListener();
        $this->dispatcher->addListener(CategoryUpdatedEvent::NAME, [$categoryUpdateListener, 'onUpdated']);

        $this->loadContentTypes($manager);

        /** @var ContentType $contentType */
        $contentType = $this->getReference(self::CONTENT_TYPE_CATALOG_REFERENCE);
        $collection = $this->catalogService->getCollection($contentType->getCollection(), $settings['mongodb_database']);
        $collection->drop();

        /** @var ContentType $contentType */
        $contentTypeText = $this->getReference(self::CONTENT_TYPE_TEXT_REFERENCE);
        $collectionText = $this->catalogService->getCollection($contentTypeText->getCollection(), $settings['mongodb_database']);
        $collectionText->drop();

        $this->loadCatalog($manager);
    }

    public function loadContentTypes(ObjectManager $manager) {

        $fields = [
            [
                'title' => 'Title',
                'name' => 'title',
                'description' => '',
                'inputType' => 'text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'header'
                ],
                'group' => 'General',
                'required' => true,
                'showInTable' => true,
                'showInList' => true,
                'isFilter' => false,
                'listOrder' => 0
            ],
            [
                'title' => 'System name',
                'name' => 'name',
                'description' => '',
                'inputType' => 'system_name',
                'inputProperties' => [
                    'value' => '',
                    'source_field' => 'title',
                    'handler' => ''
                ],
                'outputType' => 'system_name',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'General',
                'required' => true,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Image',
                'name' => 'image',
                'description' => '',
                'inputType' => 'file',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'allowed_extensions' => 'image/*',
                    'has_preview_image' => '1',
                    'multiple' => 1
                ],
                'outputType' => 'file',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'image'
                ],
                'group' => 'Images',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => false,
                'listOrder' => 2
            ],
            [
                'title' => 'Description',
                'name' => 'description',
                'description' => '',
                'inputType' => 'textarea',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'rows' => 6
                ],
                'outputType' => 'textarea',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'description'
                ],
                'group' => 'General',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Price',
                'name' => 'price',
                'description' => '',
                'inputType' => 'number',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'allow_decimals' => 0,
                    'decimal_precision' => 2,
                    'decimal_separator' => '.',
                    'min' => 0,
                    'max' => null,
                    'step' => 1
                ],
                'outputType' => 'number',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'price'
                ],
                'group' => 'General',
                'required' => false,
                'showInTable' => true,
                'showInList' => true,
                'isFilter' => true,
                'filterOrder' => 0,
                'listOrder' => 3
            ],
            [
                'title' => 'Date of publication',
                'name' => 'date_pub',
                'description' => '',
                'inputType' => 'date',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'format' => 'mm.dd.yy',
                    'show_time' => '1',
                    'hour_format' => '24',
                    'locale' => 'ru'
                ],
                'outputType' => 'date',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => '',
                    'format' => 'mm.dd.yy'
                ],
                'group' => 'Основное',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false,
                'filterOrder' => 0,
                'listOrder' => 3
            ],
            [
                'title' => 'Brand',
                'name' => 'brand',
                'description' => '',
                'inputType' => 'text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true,
                'filterOrder' => 1
            ],
            [
                'title' => 'Country',
                'name' => 'country',
                'description' => '',
                'inputType' => 'text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true,
                'filterOrder' => 2
            ],
            [
                'title' => 'Color',
                'name' => 'color',
                'description' => '',
                'inputType' => 'color',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'color',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true,
                'filterOrder' => 3
            ],
            [
                'title' => 'Material',
                'name' => 'material',
                'description' => '',
                'inputType' => 'text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true,
                'filterOrder' => 4
            ],
            [
                'title' => 'Tags',
                'name' => 'tags',
                'description' => '',
                'inputType' => 'checkbox',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'values_list' => 'New||Leader of sales||Action'
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'tag'
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => true,
                'filterOrder' => 5,
                'listOrder' => 1
            ],
            [
                'title' => 'Vendor code',
                'name' => 'vendorCode',
                'description' => '',
                'inputType' => 'text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false,
                'filterOrder' => 5
            ],
            [
                'title' => 'Quantity in stock',
                'name' => 'stock',
                'description' => '',
                'inputType' => 'number',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'allow_decimals' => 0,
                    'decimal_precision' => 2,
                    'decimal_separator' => '.',
                    'min' => 0,
                    'max' => null,
                    'step' => 1
                ],
                'outputType' => 'number',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'stock'
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false,
                'filterOrder' => 0,
                'listOrder' => 6
            ],
            [
                'title' => 'Rating',
                'name' => 'rating',
                'description' => '',
                'inputType' => 'number',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'allow_decimals' => 0,
                    'decimal_precision' => 2,
                    'decimal_separator' => '.',
                    'min' => 0,
                    'max' => 5,
                    'step' => 1
                ],
                'outputType' => 'number',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'rating'
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => false,
                'filterOrder' => 0,
                'listOrder' => 7
            ],
            [
                'title' => 'Parameters',
                'name' => 'parameters',
                'description' => '',
                'inputType' => 'parameters',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'parameters',
                'outputProperties' => [
                    'type' => 'radio',
                    'chunkName' => 'parameters',
                    'firstSelected' => '1'
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Categories',
                'name' => 'categories',
                'description' => 'You can select several categories for the product.',
                'inputType' => 'categories',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'layout' => 'vertical'
                ],
                'outputType' => 'categories',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'Categories',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false
            ]
        ];

        $contentType = new ContentType();
        $contentType
            ->setTitle('Products')
            ->setName('products')
            ->setDescription('Products catalog')
            ->setCollection('products')
            ->setFields($fields)
            ->setGroups(['General', 'Options', 'Images', 'Categories'])
            ->setIsActive(true);

        $manager->persist($contentType);
        $manager->flush();

        $this->addReference(self::CONTENT_TYPE_CATALOG_REFERENCE, $contentType);

        /* Text content */
        $fields = [
            [
                'title' => 'Title',
                'name' => 'title',
                'description' => '',
                'inputType' => 'text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'header'
                ],
                'group' => 'General',
                'required' => true,
                'showInTable' => true,
                'showInList' => true,
                'isFilter' => false
            ],
            [
                'title' => 'System name',
                'name' => 'name',
                'description' => '',
                'inputType' => 'system_name',
                'inputProperties' => [
                    'value' => '',
                    'source_field' => 'title',
                    'handler' => ''
                ],
                'outputType' => 'system_name',
                'outputProperties' => [
                    'className' => ''
                ],
                'group' => 'General',
                'required' => true,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Main text',
                'name' => 'description',
                'description' => '',
                'inputType' => 'rich_text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'rich_text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'description'
                ],
                'group' => 'General',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Menu position',
                'name' => 'menuIndex',
                'description' => '',
                'inputType' => 'number',
                'inputProperties' => [
                    'value' => '0',
                    'handler' => '',
                    'min' => 0,
                    'max' => null,
                    'step' => 1
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => ''
                ],
                'group' => 'Parameters',
                'required' => false,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Attach Form',
                'name' => 'form_name',
                'description' => '',
                'inputType' => 'text',
                'inputProperties' => [
                    'value' => '',
                    'handler' => ''
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => ''
                ],
                'group' => 'Parameters',
                'required' => false,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ]
        ];

        $contentType = new ContentType();
        $contentType
            ->setTitle('Text page')
            ->setName('text-content')
            ->setDescription('Text page')
            ->setCollection('text_content')
            ->setFields($fields)
            ->setGroups(['General','Parameters'])
            ->setIsActive(true);

        $manager->persist($contentType);
        $manager->flush();

        $this->addReference(self::CONTENT_TYPE_TEXT_REFERENCE, $contentType);
    }

    public function loadCatalog(ObjectManager $manager)
    {
        $data = [
            [
                'title' => 'Catalog',
                'name' => 'catalog',
                'menuIndex' => 0,
                'translations' => ['title' => ['ru' => 'Каталог']],
                'children' => [
                    [
                        'title' => 'Books',
                        'name' => 'books',
                        'menuIndex' => 3,
                        'translations' => ['title' => ['ru' => 'Книги']],
                        'children' => [
                            [
                                'title' => 'Educational literature',
                                'name' => 'educational-literature',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['ru' => 'Учебная литература']],
                                'children' => []
                            ],
                            [
                                'title' => 'Fiction',
                                'name' => 'fiction',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['ru' => 'Художественная литература']],
                                'children' => []
                            ],
                            [
                                'title' => 'For children',
                                'name' => 'for-children',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['ru' => 'Детям']],
                                'children' => []
                            ]
                        ]
                    ],
                    [
                        'title' => 'Clothes, shoes, bags',
                        'name' => 'clothes-shoes-bags',
                        'menuIndex' => 4,
                        'translations' => ['title' => ['ru' => 'Одежда, обувь, сумки']],
                        'children' => [
                            [
                                'title' => 'Clothes',
                                'name' => 'clothes',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['ru' => 'Oдежда']],
                                'children' => [
                                    [
                                        'title' => 'Women\'s clothing',
                                        'name' => 'womens-clothing',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Женская одежда']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Men\'s clothing',
                                        'name' => 'mens-clothing',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Мужская одежда']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Baby clothes',
                                        'name' => 'baby-clothes',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Детская одежда']],
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Footwear',
                                'name' => 'footwear',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['ru' => 'Обувь']],
                                'children' => [
                                    [
                                        'title' => 'Women\'s shoes',
                                        'name' => 'womens-shoes',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Женская обувь']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Men\'s footwear',
                                        'name' => 'mens-footwear',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Мужская обувь']],
                                        'children' => [

                                        ],
                                        'content' => [
                                            [
                                                'title' => 'Sneakers Patrol Black',
                                                'name' => 'sneakers-patrol-black',
                                                'description' => 'There will be a description...',
                                                'price' => 30.74,
                                                'brand' => 'Patrol',
                                                'country' => 'China',
                                                'color' => '#000000',
                                                'material' => 'Artificial leather',
                                                'image' => '',
                                                'tags' => ['New', 'Leader of sales'],
                                                'translations' => ['title' => ['ru' => 'Кроссовки Patrol Black']]
                                            ],
                                            [
                                                'title' => 'Sneakers Patrol White',
                                                'name' => 'sneakers-patrol-white',
                                                'description' => 'There will be a description...',
                                                'price' => 27.06,
                                                'brand' => 'Patrol',
                                                'country' => 'China',
                                                'color' => '#984d06',
                                                'material' => 'Artificial leather',
                                                'image' => '',
                                                'tags' => ['New'],
                                                'translations' => ['title' => ['ru' => 'Кроссовки Patrol White']]
                                            ],
                                            [
                                                'title' => 'Sneakers Patrol Brown',
                                                'name' => 'sneakers-patrol-brown',
                                                'description' => 'There will be a description...',
                                                'price' => 27.94,
                                                'brand' => 'Patrol',
                                                'country' => 'China',
                                                'color' => '#66583c',
                                                'material' => 'Artificial leather',
                                                'image' => '',
                                                'translations' => ['title' => ['ru' => 'Кроссовки Patrol Brown']]
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Air Max Infuriate Low',
                                                'name' => 'sneakers-nike-air-max-infuriate-low',
                                                'description' => 'There will be a description...',
                                                'price' => 65.68,
                                                'brand' => 'Nike',
                                                'country' => 'Vietnam',
                                                'color' => '#000000',
                                                'material' => 'Artificial leather',
                                                'image' => '',
                                                'translations' => ['title' => ['ru' => 'Кроссовки Nike Air Max Infuriate Low']]
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Nightgazer',
                                                'name' => 'sneakers-nike-nightgazer',
                                                'description' => 'There will be a description...',
                                                'price' => 83.68,
                                                'brand' => 'Nike',
                                                'country' => 'Vietnam',
                                                'color' => '#000000',
                                                'material' => 'Artificial leather',
                                                'image' => '',
                                                'translations' => ['title' => ['ru' => 'Кроссовки Nike Nightgazer']]
                                            ],
                                            [
                                                'title' => 'Sneakers Bris-Bosphorus',
                                                'name' => 'sneakers-bris-bosphorus',
                                                'description' => 'There will be a description...',
                                                'price' => 60.12,
                                                'brand' => 'Bris',
                                                'country' => 'Russia',
                                                'color' => '#000000',
                                                'material' => 'Textile',
                                                'image' => '',
                                                'tags' => ['New', 'Action'],
                                                'translations' => ['title' => ['ru' => 'Кеды Брис-Босфор']]
                                            ],
                                            [
                                                'title' => 'Sneakers Nike COURT ROYALE',
                                                'name' => 'kedy-nike-court-royale',
                                                'description' => 'There will be a description...',
                                                'price' => 58.68,
                                                'brand' => 'Nike',
                                                'country' => 'Indonesia',
                                                'color' => '#ffffff',
                                                'material' => 'Textile',
                                                'image' => '',
                                                'translations' => ['title' => ['ru' => 'Кеды Nike COURT ROYALE']]
                                            ],
                                            [
                                                'title' => 'Sneakers Nike T-Lite XI',
                                                'name' => 'sneakers-nike-t-lite-xi',
                                                'description' => 'There will be a description...',
                                                'price' => 51.32,
                                                'brand' => 'Nike',
                                                'country' => 'Indonesia',
                                                'color' => '#ffffff',
                                                'material' => 'Artificial leather',
                                                'image' => '',
                                                'translations' => ['title' => ['ru' => 'Кроссовки Nike T-Lite XI']]
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Reax 8 TR',
                                                'name' => 'sneakers-nike-reax-8-tr',
                                                'description' => 'There will be a description...',
                                                'price' => 88.09,
                                                'brand' => 'Nike',
                                                'country' => 'Vietnam',
                                                'color' => '#ffffff',
                                                'material' => 'Genuine leather',
                                                'image' => '',
                                                'tags' => ['New', 'Action'],
                                                'translations' => ['title' => ['ru' => 'Кроссовки Nike Reax 8 TR']]
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Court Royale Suede',
                                                'name' => 'sneakers-nike-court-royale-suede',
                                                'description' => 'There will be a description...',
                                                'price' => 66.03,
                                                'brand' => 'Nike',
                                                'country' => 'Indonesia',
                                                'color' => '#ffffff',
                                                'material' => 'Genuine leather',
                                                'image' => '',
                                                'translations' => ['title' => ['ru' => '']]
                                            ],
                                            [
                                                'title' => 'Sneakers Adidas Climawarm Atr M',
                                                'name' => 'sneakers-adidas-climawarm-atr-m',
                                                'description' => 'There will be a description...',
                                                'price' => 66.05,
                                                'brand' => 'Adidas',
                                                'country' => 'China',
                                                'color' => '#0f77b0',
                                                'material' => 'Artificial leather, Textile',
                                                'image' => '',
                                                'translations' => ['title' => ['ru' => 'Кеды Nike Court Royale Suede']]
                                            ],
                                            [
                                                'title' => 'Sneakers Adidas Neo 10K Casual',
                                                'name' => 'sneakers-adidas-neo-10k-casual',
                                                'description' => 'There will be a description...',
                                                'price' => 70.06,
                                                'brand' => 'Adidas',
                                                'country' => 'China',
                                                'color' => '#0f77b0',
                                                'material' => 'Artificial leather, Textile',
                                                'image' => '',
                                                'tags' => ['New', 'Leader of sales'],
                                                'translations' => ['title' => ['ru' => 'Кроссовки Adidas Neo 10K Casual']]
                                            ],
                                            [
                                                'title' => 'Valenki Cotofey',
                                                'name' => 'valenki-kotofey',
                                                'description' => 'There will be a description...',
                                                'price' => 55.56,
                                                'brand' => 'Cotofey',
                                                'country' => 'Russia',
                                                'color' => '#000000',
                                                'material' => 'Felt',
                                                'image' => '',
                                                'tags' => ['New'],
                                                'translations' => ['title' => ['ru' => 'Валенки Котофей']]
                                            ]
                                        ]
                                    ],
                                    [
                                        'title' => 'Children\'s shoes',
                                        'name' => 'childrens-shoes',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Детская обувь']],
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Bags',
                                'name' => 'bags',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['ru' => 'Сумки']],
                                'children' => [
                                    [
                                        'title' => 'Women\'s handbags',
                                        'name' => 'womens-handbags',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Женские сумки']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Men\'s bags',
                                        'name' => 'Mens-bags',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['ru' => 'Мужские сумки']],
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        /** @var ContentType $contentTypeText */
        $contentTypeText = $this->getReference(self::CONTENT_TYPE_TEXT_REFERENCE);
        $this->loadCategories($manager, $contentTypeText, [
            [
                'title' => 'Root category',
                'name' => 'root',
                'menuIndex' => 0,
                'children' => [],
                'content' => [
                    [
                        'title' => 'About store',
                        'name' => 'about',
                        'description' => 'There will be a description...',
                        'form_name' => '',
                        'menuIndex' => 1,
                        'translations' => ['title' => ['ru' => 'О магазине']]
                    ],
                    [
                        'title' => 'Payment and delivery',
                        'name' => 'payment',
                        'description' => 'There will be a description...',
                        'form_name' => '',
                        'menuIndex' => 2,
                        'translations' => ['title' => ['ru' => 'Оплата и доставка']]
                    ],
                    [
                        'title' => 'Contacts',
                        'name' => 'contacts',
                        'description' => '',
                        'form_name' => 'contacts',
                        'menuIndex' => 3,
                        'translations' => ['title' => ['ru' => 'Контакты'], 'form_name' => ['ru' => 'contacts']]
                    ]
                ]
            ]
        ]);

        /** @var ContentType $contentType */
        $contentType = $this->getReference(self::CONTENT_TYPE_CATALOG_REFERENCE);
        $this->loadCategories($manager, $contentType, $data);
    }

    public function loadCategories(ObjectManager $manager, ContentType $contentType, $data, Category $parent = null) {

        foreach ($data as $item) {
            $category = new Category();
            if (!$parent) {
                $category->setParentId(0);
            } else {
                $category->setParentId($parent->getId());
            }
            $category
                ->setTitle($item['title'])
                ->setName($item['name'])
                ->setDescription('')
                ->setIsActive(true)
                ->setMenuIndex($item['menuIndex'])
                ->setTranslations($item['translations'] ?? [])
                ->setContentTypeName($contentType->getName())
                ->setContentType($contentType);

            if ($item['name'] === 'root') {
                $category
                    ->setId(0)
                    ->setIsFolder(true);
            }

            $manager->persist($category);
            $manager->flush();

            $event = new CategoryUpdatedEvent($manager, $category);
            $this->dispatcher->dispatch($event, CategoryUpdatedEvent::NAME);

            if (!empty($item['content'])) {
                $this->loadCategoryContent($manager, $category, $item['content']);
            }

            if (!empty($item['children'])) {
                $this->loadCategories($manager, $contentType, $item['children'], $category);
            }
        }
    }

    /**
     * @param ObjectManager $manager
     * @param Category $category
     * @param array $data
     * @return bool
     */
    public function loadCategoryContent(ObjectManager $manager, Category $category, $data)
    {
        $settings = $this->settingsService->getSettingsFromYaml('settings', false);

        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        /** @var \MongoDB\Collection $collection */
        $collection = $this->catalogService->getCollection($contentType->getCollection(), $settings['mongodb_database']);

        foreach ($data as $product) {
            $product['parentId'] = $category->getId();
            $product['isActive'] = true;
            $product['_id'] = $this->catalogService->getNextId($contentType->getCollection(), $settings['mongodb_database'], null);
            $collection->insertOne($product);
        }

        // Add text index
        $indexInfo = $collection->listIndexes();
        if (iterator_count($indexInfo) > 0) {
            $collection->dropIndexes();
        }
        $collection->createIndex(array_fill_keys(['title', 'description'], 'text'), [
            'default_language' => 'english'
        ]);

        $this->catalogService->updateFiltersData($category, $settings['mongodb_database']);

        return true;
    }

    public static function getGroups(): array
    {
        return ['en'];
    }
}
