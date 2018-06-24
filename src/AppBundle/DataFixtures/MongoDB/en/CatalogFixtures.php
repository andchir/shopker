<?php

namespace AppBundle\DataFixtures\MongoDB\en;

use AppBundle\Controller\Admin\ProductController;
use AppBundle\Service\SettingsService;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\FieldType;
use AppBundle\Document\ContentType;
use AppBundle\Document\Category;
use AppBundle\Event\CategoryUpdatedEvent;
use AppBundle\EventListener\CategoryUpdateListener;

class CatalogFixtures extends Fixture
{

    private $dispatcher;
    private $productController;

    public function load(ObjectManager $manager)
    {
        $this->dispatcher = $this->container->get('event_dispatcher');

        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        $settings = $settingsService->getSettingsFromYaml('settings', false);

        $this->productController = new ProductController();
        $this->productController->setContainer($this->container);

        $incrementIdsCollection = $this->productController->getCollection('doctrine_increment_ids', $settings['mongodb_database']);
        $incrementIdsCollection->remove([]);

        $categoryUpdateListener = new CategoryUpdateListener();
        $this->dispatcher->addListener(CategoryUpdatedEvent::NAME, [$categoryUpdateListener, 'onUpdated']);

        $this->loadContentTypes($manager);

        /** @var ContentType $contentType */
        $contentType = $this->getReference('content_type_catalog');
        $collection = $this->productController->getCollection($contentType->getCollection(), $settings['mongodb_database']);
        $collection->remove([]);

        /** @var ContentType $contentType */
        $contentTypeText = $this->getReference('content_type_text');
        $collectionText = $this->productController->getCollection($contentTypeText->getCollection(), $settings['mongodb_database']);
        $collectionText->remove([]);

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
                'title' => 'Image',
                'name' => 'image',
                'description' => '',
                'inputType' => 'file',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'allowed_extensions' => 'image/*',
                    'has_preview_image' => '1'
                ],
                'outputType' => 'file',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'image'
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => false
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
                'isFilter' => true
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
                'isFilter' => true
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
                'isFilter' => true
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
                'isFilter' => true
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
                'isFilter' => true
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
                    'chunkName' => ''
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false
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
                'isFilter' => true
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
                'isFilter' => true
            ]
        ];

        $contentType = new ContentType();
        $contentType
            ->setTitle('General')
            ->setName('general')
            ->setDescription('Products catalog')
            ->setCollection('products')
            ->setFields($fields)
            ->setGroups(['General','Options','Categories'])
            ->setIsActive(true);

        $manager->persist($contentType);
        $manager->flush();

        $this->addReference('content_type_catalog', $contentType);

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
                'name' => 'text',
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
                'outputType' => 'number',
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

        $this->addReference('content_type_text', $contentType);
    }

    public function loadCatalog(ObjectManager $manager)
    {
        $data = [
            [
                'title' => 'Catalog',
                'name' => 'catalog',
                'menuIndex' => 0,
                'children' => [
                    [
                        'title' => 'Books',
                        'name' => 'books',
                        'menuIndex' => 3,
                        'children' => [
                            [
                                'title' => 'Educational literature',
                                'name' => 'educational-literature',
                                'menuIndex' => 0,
                                'children' => []
                            ],
                            [
                                'title' => 'Fiction',
                                'name' => 'fiction',
                                'menuIndex' => 0,
                                'children' => []
                            ],
                            [
                                'title' => 'For children',
                                'name' => 'for-children',
                                'menuIndex' => 0,
                                'children' => []
                            ]
                        ]
                    ],
                    [
                        'title' => 'Clothes, shoes, bags',
                        'name' => 'clothes-shoes-bags',
                        'menuIndex' =>4,
                        'children' => [
                            [
                                'title' => 'Clothes',
                                'name' => 'clothes',
                                'menuIndex' => 0,
                                'children' => [
                                    [
                                        'title' => 'Women\'s clothing',
                                        'name' => 'womens-clothing',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Men\'s clothing',
                                        'name' => 'mens-clothing',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Baby clothes',
                                        'name' => 'baby-clothes',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Footwear',
                                'name' => 'footwear',
                                'menuIndex' => 0,
                                'children' => [
                                    [
                                        'title' => 'Women\'s shoes',
                                        'name' => 'womens-shoes',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Men\'s footwear',
                                        'name' => 'mens-footwear',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ],
                                        'content' => [
                                            [
                                                'title' => 'Sneakers Patrol Black',
                                                'name' => 'sneakers-patrol-black',
                                                'description' => 'There will be a description...',
                                                'price' => 2090,
                                                'brand' => 'Patrol',
                                                'country' => 'China',
                                                'color' => '#000000',
                                                'material' => 'Artificial leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Patrol White',
                                                'name' => 'sneakers-patrol-white',
                                                'description' => 'There will be a description...',
                                                'price' => 1840,
                                                'brand' => 'Patrol',
                                                'country' => 'China',
                                                'color' => '#984d06',
                                                'material' => 'Artificial leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Patrol Brown',
                                                'name' => 'sneakers-patrol-brown',
                                                'description' => 'There will be a description...',
                                                'price' => 1900,
                                                'brand' => 'Patrol',
                                                'country' => 'China',
                                                'color' => '#66583c',
                                                'material' => 'Artificial leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Air Max Infuriate Low',
                                                'name' => 'sneakers-nike-air-max-infuriate-low',
                                                'description' => 'There will be a description...',
                                                'price' => 4466,
                                                'brand' => 'Nike',
                                                'country' => 'Vietnam',
                                                'color' => '#000000',
                                                'material' => 'Artificial leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Nightgazer',
                                                'name' => 'sneakers-nike-nightgazer',
                                                'description' => 'There will be a description...',
                                                'price' => 5690,
                                                'brand' => 'Nike',
                                                'country' => 'Vietnam',
                                                'color' => '#000000',
                                                'material' => 'Artificial leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Bris-Bosphorus',
                                                'name' => 'sneakers-bris-bosphorus',
                                                'description' => 'There will be a description...',
                                                'price' => 684,
                                                'brand' => 'Bris',
                                                'country' => 'Russia',
                                                'color' => '#000000',
                                                'material' => 'Textile',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Nike COURT ROYALE',
                                                'name' => 'kedy-nike-court-royale',
                                                'description' => 'There will be a description...',
                                                'price' => 3990,
                                                'brand' => 'Nike',
                                                'country' => 'Indonesia',
                                                'color' => '#ffffff',
                                                'material' => 'Textile',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Nike T-Lite XI',
                                                'name' => 'sneakers-nike-t-lite-xi',
                                                'description' => 'There will be a description...',
                                                'price' => 3490,
                                                'brand' => 'Nike',
                                                'country' => 'Indonesia',
                                                'color' => '#ffffff',
                                                'material' => 'Artificial leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Reax 8 TR',
                                                'name' => 'sneakers-nike-reax-8-tr',
                                                'description' => 'There will be a description...',
                                                'price' => 5990,
                                                'brand' => 'Nike',
                                                'country' => 'Vietnam',
                                                'color' => '#ffffff',
                                                'material' => 'Genuine leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Nike Court Royale Suede',
                                                'name' => 'sneakers-nike-court-royale-suede',
                                                'description' => 'There will be a description...',
                                                'price' => 4490,
                                                'brand' => 'Nike',
                                                'country' => 'Indonesia',
                                                'color' => '#ffffff',
                                                'material' => 'Genuine leather',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Adidas Climawarm Atr M',
                                                'name' => 'sneakers-adidas-climawarm-atr-m',
                                                'description' => 'There will be a description...',
                                                'price' => 4490,
                                                'brand' => 'Adidas',
                                                'country' => 'China',
                                                'color' => '#0f77b0',
                                                'material' => 'Artificial leather, Textile',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Sneakers Adidas Neo 10K Casual',
                                                'name' => 'sneakers-adidas-neo-10k-casual',
                                                'description' => 'There will be a description...',
                                                'price' => 4764,
                                                'brand' => 'Adidas',
                                                'country' => 'China',
                                                'color' => '#0f77b0',
                                                'material' => 'Artificial leather, Textile',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Valenki Cotofey',
                                                'name' => 'valenki-kotofey',
                                                'description' => 'There will be a description...',
                                                'price' => 3778,
                                                'brand' => 'Cotofey',
                                                'country' => 'Russia',
                                                'color' => '#000000',
                                                'material' => 'Felt',
                                                'image' => ''
                                            ]
                                        ]
                                    ],
                                    [
                                        'title' => 'Children\'s shoes',
                                        'name' => 'childrens-shoes',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Bags',
                                'name' => 'bags',
                                'menuIndex' => 0,
                                'children' => [
                                    [
                                        'title' => 'Women\'s handbags',
                                        'name' => 'womens-handbags',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Men\'s bags',
                                        'name' => 'Mens-bags',
                                        'menuIndex' => 0,
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
        $contentTypeText = $this->getReference('content_type_text');
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
                        'text' => 'There will be a description...',
                        'menuIndex' => 1
                    ],
                    [
                        'title' => 'Payment and delivery',
                        'name' => 'payment',
                        'text' => 'There will be a description...',
                        'menuIndex' => 2
                    ]
                ]
            ]
        ]);

        /** @var ContentType $contentType */
        $contentType = $this->getReference('content_type_catalog');
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
                ->setContentTypeName($contentType->getName())
                ->setContentType($contentType);

            if ($item['name'] === 'root') {
                $category
                    ->setId(0)
                    ->setIsFolder(true);
            }

            $manager->persist($category);
            $manager->flush();

            $event = new CategoryUpdatedEvent($this->container, $category);
            $this->dispatcher->dispatch(CategoryUpdatedEvent::NAME, $event);

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
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        $settings = $settingsService->getSettingsFromYaml('settings', false);

        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $collection = $this->productController->getCollection($contentType->getCollection(), $settings['mongodb_database']);

        foreach ($data as $product) {
            $product['parentId'] = $category->getId();
            $product['isActive'] = true;
            $product['_id'] = $this->productController->getNextId($contentType->getCollection(), $settings['mongodb_database']);
            $collection->insert($product);
        }

        $this->productController->updateFiltersData($category, $settings['mongodb_database']);

        return true;
    }

}
