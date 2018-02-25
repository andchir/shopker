<?php

namespace AppBundle\DataFixtures\MongoDB\en;

use AppBundle\Controller\Admin\ProductController;
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

        $this->productController = new ProductController();
        $this->productController->setContainer($this->container);

        $incrementIdsCollection = $this->productController->getCollection('doctrine_increment_ids');
        $incrementIdsCollection->remove([]);

        $categoryUpdateListener = new CategoryUpdateListener();
        $this->dispatcher->addListener(CategoryUpdatedEvent::NAME, [$categoryUpdateListener, 'onUpdated']);

        $this->loadContentTypes($manager);

        /** @var ContentType $contentType */
        $contentType = $this->getReference('content_type_catalog');
        $collection = $this->productController->getCollection($contentType->getCollection());
        $collection->remove([]);

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
                'isFilter' => true
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
                    'className' => ''
                ],
                'group' => 'General',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
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
    }

    public function loadCatalog(ObjectManager $manager)
    {
        $data = [
            [
                'title' => 'Books',
                'name' => 'books',
                'children' => [
                    [
                        'title' => 'Educational literature',
                        'name' => 'educational-literature',
                        'children' => []
                    ],
                    [
                        'title' => 'Imaginative literature',
                        'name' => 'imaginative-literature',
                        'children' => []
                    ],
                    [
                        'title' => 'Children',
                        'name' => 'children',
                        'children' => []
                    ]
                ]
            ],
            [
                'title' => 'Clothes, shoes, bags',
                'name' => 'clothes-shoes-bags',
                'children' => [
                    [
                        'title' => 'Clothes',
                        'name' => 'clothes',
                        'children' => [
                            [
                                'title' => 'Women\'s clothing',
                                'name' => 'womens-clothing',
                                'children' => [

                                ]
                            ],
                            [
                                'title' => 'Men\'s clothing',
                                'name' => 'mens-clothing',
                                'children' => [

                                ]
                            ],
                            [
                                'title' => 'Children\'s wear',
                                'name' => 'childrens-wear',
                                'children' => [

                                ]
                            ]
                        ]
                    ],
                    [
                        'title' => 'Shoes',
                        'name' => 'shoes',
                        'children' => [
                            [
                                'title' => 'Women\'s shoes',
                                'name' => 'womens-shoes',
                                'children' => [

                                ]
                            ],
                            [
                                'title' => 'Men\'s footwear',
                                'name' => 'mens-footwear',
                                'children' => [

                                ],
                                'products' => [
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
                                        'title' => 'Gumshoes Bris-Bosfor',
                                        'name' => 'gumshoes-bris-bosfor',
                                        'description' => 'There will be a description...',
                                        'price' => 684,
                                        'brand' => 'Bris',
                                        'country' => 'Russia',
                                        'color' => '#000000',
                                        'material' => 'Textile',
                                        'image' => ''
                                    ],
                                    [
                                        'title' => 'Gumshoes Nike COURT ROYALE',
                                        'name' => 'gumshoes-nike-court-royale',
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
                                        'title' => 'Gumshoes Nike Court Royale Suede',
                                        'name' => 'gumshoes-nike-court-royale-suede',
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
                                        'title' => 'Felt boots Kotofey',
                                        'name' => 'felt-boots-kotofey',
                                        'description' => 'There will be a description...',
                                        'price' => 3778,
                                        'brand' => 'Kotofey',
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
                                'children' => [

                                ]
                            ]
                        ]
                    ],
                    [
                        'title' => 'Bags',
                        'name' => 'bags',
                        'children' => [
                            [
                                'title' => 'Women\'s Handbags',
                                'name' => 'womens-handbags',
                                'children' => [

                                ]
                            ],
                            [
                                'title' => 'Men\'s bags',
                                'name' => 'mens-bags',
                                'children' => [

                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $this->loadCategories($manager, $data);
    }

    public function loadCategories(ObjectManager $manager, $data, Category $parent = null) {

        /** @var ContentType $contentType */
        $contentType = $this->getReference('content_type_catalog');

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
                ->setContentTypeName($contentType->getName())
                ->setContentType($contentType);

            $manager->persist($category);
            $manager->flush();

            $event = new CategoryUpdatedEvent($this->container, $category);
            $this->dispatcher->dispatch(CategoryUpdatedEvent::NAME, $event);

            if (!empty($item['products'])) {
                $this->loadProducts($manager, $category, $item['products']);
            }

            if (!empty($item['children'])) {
                $this->loadCategories($manager, $item['children'], $category);
            }
        }
    }

    /**
     * @param ObjectManager $manager
     * @param Category $category
     * @param array $data
     * @return bool
     */
    public function loadProducts(ObjectManager $manager, Category $category, $data)
    {
        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $collection = $this->productController->getCollection($contentType->getCollection());

        foreach ($data as $product) {
            $product['parentId'] = $category->getId();
            $product['isActive'] = true;
            $product['_id'] = $this->productController->getNextId($contentType->getCollection());
            $collection->insert($product);
        }

        $this->productController->updateFiltersData($category);

        return true;
    }

}
