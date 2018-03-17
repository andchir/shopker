<?php

namespace AppBundle\DataFixtures\MongoDB\ru;

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

        /** @var ContentType $contentType */
        $contentTypeText = $this->getReference('content_type_text');
        $collectionText = $this->productController->getCollection($contentTypeText->getCollection());
        $collectionText->remove([]);

        $this->loadCatalog($manager);
    }

    public function loadContentTypes(ObjectManager $manager) {

        $fields = [
            [
                'title' => 'Название',
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
                'group' => 'Основное',
                'required' => true,
                'showInTable' => true,
                'showInList' => true,
                'isFilter' => false
            ],
            [
                'title' => 'Системное имя',
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
                'group' => 'Основное',
                'required' => true,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Картинка',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => true
            ],
            [
                'title' => 'Описание',
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
                'group' => 'Основное',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => false
            ],
            [
                'title' => 'Цена',
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
                'group' => 'Основное',
                'required' => false,
                'showInTable' => true,
                'showInList' => true,
                'isFilter' => true
            ],
            [
                'title' => 'Бренд',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true
            ],
            [
                'title' => 'Страна',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true
            ],
            [
                'title' => 'Цвет',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true
            ],
            [
                'title' => 'Материал',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true
            ],
            [
                'title' => 'Категории',
                'name' => 'categories',
                'description' => 'Вы можете выбрать несколько категорий для товара.',
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
                'group' => 'Категории',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => true
            ]
        ];

        $contentType = new ContentType();
        $contentType
            ->setTitle('Товар каталога')
            ->setName('products')
            ->setDescription('Товар каталога')
            ->setCollection('products')
            ->setFields($fields)
            ->setGroups(['Основное','Параметры','Категории'])
            ->setIsActive(true);

        $manager->persist($contentType);
        $manager->flush();

        $this->addReference('content_type_catalog', $contentType);

        /* Text content */
        $fields = [
            [
                'title' => 'Название',
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
                'group' => 'Основное',
                'required' => true,
                'showInTable' => true,
                'showInList' => true,
                'isFilter' => false
            ],
            [
                'title' => 'Системное имя',
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
                'group' => 'Основное',
                'required' => true,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Основной текст',
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
                'group' => 'Основное',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Позиция в меню',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ]
        ];

        $contentType = new ContentType();
        $contentType
            ->setTitle('Текстовая страница')
            ->setName('text-content')
            ->setDescription('Текстовая страница')
            ->setCollection('text_content')
            ->setFields($fields)
            ->setGroups(['Основное','Параметры'])
            ->setIsActive(true);

        $manager->persist($contentType);
        $manager->flush();

        $this->addReference('content_type_text', $contentType);
    }

    public function loadCatalog(ObjectManager $manager)
    {
        $data = [
            [
                'title' => 'Каталог',
                'name' => 'katalog',
                'menuIndex' => 0,
                'children' => [
                    [
                        'title' => 'Книги',
                        'name' => 'knigi',
                        'menuIndex' => 3,
                        'children' => [
                            [
                                'title' => 'Учебная литература',
                                'name' => 'uchebnaya-literatura',
                                'menuIndex' => 0,
                                'children' => []
                            ],
                            [
                                'title' => 'Художественная литература',
                                'name' => 'khudozhestvennaya-literatura',
                                'menuIndex' => 0,
                                'children' => []
                            ],
                            [
                                'title' => 'Детям',
                                'name' => 'detyam',
                                'menuIndex' => 0,
                                'children' => []
                            ]
                        ]
                    ],
                    [
                        'title' => 'Одежда, обувь, сумки',
                        'name' => 'odezhda-obuv-sumki',
                        'menuIndex' =>4,
                        'children' => [
                            [
                                'title' => 'Oдежда',
                                'name' => 'odezhda',
                                'menuIndex' => 0,
                                'children' => [
                                    [
                                        'title' => 'Женская одежда',
                                        'name' => 'zhenskaya-odezhda',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Мужская одежда',
                                        'name' => 'muzhskaya-odezhda',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Детская одежда',
                                        'name' => 'detskaya-odezhda',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Обувь',
                                'name' => 'obuv',
                                'menuIndex' => 0,
                                'children' => [
                                    [
                                        'title' => 'Женская обувь',
                                        'name' => 'zhenskaya-obuv',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Мужская обувь',
                                        'name' => 'muzhskaya-obuv',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ],
                                        'content' => [
                                            [
                                                'title' => 'Кроссовки Patrol Black',
                                                'name' => 'krossovki-patrol-black',
                                                'description' => 'Тут будет описание...',
                                                'price' => 2090,
                                                'brand' => 'Patrol',
                                                'country' => 'Китай',
                                                'color' => '#000000',
                                                'material' => 'Искусственная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Patrol White',
                                                'name' => 'krossovki-patrol-white',
                                                'description' => 'Тут будет описание...',
                                                'price' => 1840,
                                                'brand' => 'Patrol',
                                                'country' => 'Китай',
                                                'color' => '#984d06',
                                                'material' => 'Искусственная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Patrol Brown',
                                                'name' => 'krossovki-patrol-brown',
                                                'description' => 'Тут будет описание...',
                                                'price' => 1900,
                                                'brand' => 'Patrol',
                                                'country' => 'Китай',
                                                'color' => '#66583c',
                                                'material' => 'Искусственная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Nike Air Max Infuriate Low',
                                                'name' => 'krossovki-nike-air-max-infuriate-low',
                                                'description' => 'Тут будет описание...',
                                                'price' => 4466,
                                                'brand' => 'Nike',
                                                'country' => 'Вьетнам',
                                                'color' => '#000000',
                                                'material' => 'Искусственная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Nike Nightgazer',
                                                'name' => 'krossovki-nike-nightgazer',
                                                'description' => 'Тут будет описание...',
                                                'price' => 5690,
                                                'brand' => 'Nike',
                                                'country' => 'Вьетнам',
                                                'color' => '#000000',
                                                'material' => 'Искусственная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кеды Брис-Босфор',
                                                'name' => 'kedy-bris-bosfor',
                                                'description' => 'Тут будет описание...',
                                                'price' => 684,
                                                'brand' => 'Bris',
                                                'country' => 'Россия',
                                                'color' => '#000000',
                                                'material' => 'Текстиль',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кеды Nike COURT ROYALE',
                                                'name' => 'kedy-nike-court-royale',
                                                'description' => 'Тут будет описание...',
                                                'price' => 3990,
                                                'brand' => 'Nike',
                                                'country' => 'Индонезия',
                                                'color' => '#ffffff',
                                                'material' => 'Текстиль',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Nike T-Lite XI',
                                                'name' => 'krossovki-nike-t-lite-xi',
                                                'description' => 'Тут будет описание...',
                                                'price' => 3490,
                                                'brand' => 'Nike',
                                                'country' => 'Индонезия',
                                                'color' => '#ffffff',
                                                'material' => 'Искусственная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Nike Reax 8 TR',
                                                'name' => 'krossovki-nike-reax-8-tr',
                                                'description' => 'Тут будет описание...',
                                                'price' => 5990,
                                                'brand' => 'Nike',
                                                'country' => 'Вьетнам',
                                                'color' => '#ffffff',
                                                'material' => 'Натуральная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кеды Nike Court Royale Suede',
                                                'name' => 'kedy-nike-court-royale-suede',
                                                'description' => 'Тут будет описание...',
                                                'price' => 4490,
                                                'brand' => 'Nike',
                                                'country' => 'Индонезия',
                                                'color' => '#ffffff',
                                                'material' => 'Натуральная кожа',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Adidas Climawarm Atr M',
                                                'name' => 'krossovki-adidas-climawarm-atr-m',
                                                'description' => 'Тут будет описание...',
                                                'price' => 4490,
                                                'brand' => 'Adidas',
                                                'country' => 'Китай',
                                                'color' => '#0f77b0',
                                                'material' => 'Искусственная кожа, Текстиль',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Кроссовки Adidas Neo 10K Casual',
                                                'name' => 'krossovki-adidas-neo-10k-casual',
                                                'description' => 'Тут будет описание...',
                                                'price' => 4764,
                                                'brand' => 'Adidas',
                                                'country' => 'Китай',
                                                'color' => '#0f77b0',
                                                'material' => 'Искусственная кожа, Текстиль',
                                                'image' => ''
                                            ],
                                            [
                                                'title' => 'Валенки Котофей',
                                                'name' => 'valenki-kotofey',
                                                'description' => 'Тут будет описание...',
                                                'price' => 3778,
                                                'brand' => 'Котофей',
                                                'country' => 'Россия',
                                                'color' => '#000000',
                                                'material' => 'Войлок',
                                                'image' => ''
                                            ]
                                        ]
                                    ],
                                    [
                                        'title' => 'Детская обувь',
                                        'name' => 'detskaya-obuv',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Сумки',
                                'name' => 'sumki',
                                'menuIndex' => 0,
                                'children' => [
                                    [
                                        'title' => 'Женские сумки',
                                        'name' => 'zhenskie-sumki',
                                        'menuIndex' => 0,
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Мужские сумки',
                                        'name' => 'muzhskie-sumki',
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
                'title' => 'Корневая категория',
                'name' => 'root',
                'menuIndex' => 0,
                'children' => [],
                'content' => [
                    [
                        'title' => 'О магазине',
                        'name' => 'about',
                        'text' => 'Тут будет описание...',
                        'menuIndex' => 1
                    ],
                    [
                        'title' => 'Оплата и доставка',
                        'name' => 'payment',
                        'text' => 'Тут будет описание...',
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
