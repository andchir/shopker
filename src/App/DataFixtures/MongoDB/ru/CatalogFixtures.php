<?php

namespace App\DataFixtures\MongoDB\ru;

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
                'isFilter' => false,
                'listOrder' => 0
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
                    'has_preview_image' => '1',
                    'multiple' => 1
                ],
                'outputType' => 'file',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'image'
                ],
                'group' => 'Изображения',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => false,
                'listOrder' => 2
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
                'isFilter' => true,
                'filterOrder' => 0,
                'listOrder' => 3
            ],
            [
                'title' => 'Дата публикации',
                'name' => 'date_pub',
                'description' => '',
                'inputType' => 'date',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'format' => 'dd.mm.yy',
                    'show_time' => '1',
                    'hour_format' => '24',
                    'locale' => 'ru'
                ],
                'outputType' => 'date',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => '',
                    'format' => 'dd.mm.yy'
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
                'isFilter' => true,
                'filterOrder' => 1
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
                'isFilter' => true,
                'filterOrder' => 2
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
                'isFilter' => true,
                'filterOrder' => 3
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
                'isFilter' => true,
                'filterOrder' => 4
            ],
            [
                'title' => 'Метки',
                'name' => 'tags',
                'description' => '',
                'inputType' => 'checkbox',
                'inputProperties' => [
                    'value' => '',
                    'handler' => '',
                    'values_list' => 'Новинка||Лидер продаж||Акция'
                ],
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => 'tag'
                ],
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => true,
                'filterOrder' => 5,
                'listOrder' => 1
            ],
            [
                'title' => 'Артикул',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false,
                'filterOrder' => 5
            ],
            [
                'title' => 'Количество на складе',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false,
                'filterOrder' => 0,
                'listOrder' => 6
            ],
            [
                'title' => 'Оценка',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => true,
                'isFilter' => false,
                'filterOrder' => 0,
                'listOrder' => 7
            ],
            [
                'title' => 'Параметры',
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
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
                'showInList' => false,
                'isFilter' => false
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
                'isFilter' => false
            ]
        ];

        $contentType = new ContentType();
        $contentType
            ->setTitle('Товар каталога')
            ->setName('products')
            ->setDescription('Товар каталога')
            ->setCollection('products')
            ->setFields($fields)
            ->setGroups(['Основное', 'Параметры', 'Изображения', 'Категории'])
            ->setIsActive(true);

        $manager->persist($contentType);
        $manager->flush();

        $this->addReference(self::CONTENT_TYPE_CATALOG_REFERENCE, $contentType);

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
                'outputType' => 'text',
                'outputProperties' => [
                    'className' => '',
                    'chunkName' => ''
                ],
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => true,
                'showInList' => false,
                'isFilter' => false
            ],
            [
                'title' => 'Прикрепить форму',
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

        $this->addReference(self::CONTENT_TYPE_TEXT_REFERENCE, $contentType);
    }

    public function loadCatalog(ObjectManager $manager)
    {
        $data = [
            [
                'title' => 'Каталог',
                'name' => 'katalog',
                'menuIndex' => 0,
                'translations' => ['title' => ['en' => 'Catalog']],
                'children' => [
                    [
                        'title' => 'Книги',
                        'name' => 'knigi',
                        'menuIndex' => 3,
                        'translations' => ['title' => ['en' => 'Books']],
                        'children' => [
                            [
                                'title' => 'Учебная литература',
                                'name' => 'uchebnaya-literatura',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['en' => 'Educational literature']],
                                'children' => []
                            ],
                            [
                                'title' => 'Художественная литература',
                                'name' => 'khudozhestvennaya-literatura',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['en' => 'Fiction']],
                                'children' => []
                            ],
                            [
                                'title' => 'Детям',
                                'name' => 'detyam',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['en' => 'For children']],
                                'children' => []
                            ]
                        ]
                    ],
                    [
                        'title' => 'Одежда, обувь, сумки',
                        'name' => 'odezhda-obuv-sumki',
                        'menuIndex' => 4,
                        'translations' => ['title' => ['en' => 'Clothes, shoes, bags']],
                        'children' => [
                            [
                                'title' => 'Oдежда',
                                'name' => 'odezhda',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['en' => 'Clothes']],
                                'children' => [
                                    [
                                        'title' => 'Женская одежда',
                                        'name' => 'zhenskaya-odezhda',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Women\'s clothing']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Мужская одежда',
                                        'name' => 'muzhskaya-odezhda',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Men\'s clothing']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Детская одежда',
                                        'name' => 'detskaya-odezhda',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Baby clothes']],
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Обувь',
                                'name' => 'obuv',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['en' => 'Footwear']],
                                'children' => [
                                    [
                                        'title' => 'Женская обувь',
                                        'name' => 'zhenskaya-obuv',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Women\'s shoes']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Мужская обувь',
                                        'name' => 'muzhskaya-obuv',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Men\'s footwear']],
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
                                                'image' => '',
                                                'tags' => ['Новинка', 'Лидер продаж'],
                                                'translations' => ['title' => ['en' => 'Sneakers Patrol Black']]
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
                                                'image' => '',
                                                'tags' => ['Новинка'],
                                                'translations' => ['title' => ['en' => 'Sneakers Patrol White']]
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
                                                'image' => '',
                                                'translations' => ['title' => ['en' => 'Sneakers Patrol Brown']]
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
                                                'image' => '',
                                                'translations' => ['title' => ['en' => 'Sneakers Nike Air Max Infuriate Low']]
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
                                                'image' => '',
                                                'translations' => ['title' => ['en' => 'Sneakers Nike Nightgazer']]
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
                                                'image' => '',
                                                'tags' => ['Новинка', 'Акция'],
                                                'translations' => ['title' => ['en' => 'Sneakers Bris-Bosphorus']]
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
                                                'image' => '',
                                                'translations' => ['title' => ['en' => 'Sneakers Nike COURT ROYALE']]
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
                                                'image' => '',
                                                'tags' => ['Новинка', 'Акция'],
                                                'translations' => ['title' => ['en' => 'Sneakers Nike T-Lite XI']]
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
                                                'image' => '',
                                                'tags' => ['Новинка'],
                                                'translations' => ['title' => ['en' => 'Sneakers Nike Reax 8 TR']]
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
                                                'image' => '',
                                                'translations' => ['title' => ['en' => 'Sneakers Nike Court Royale Suede']]
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
                                                'image' => '',
                                                'translations' => ['title' => ['en' => 'Sneakers Adidas Climawarm Atr M']]
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
                                                'image' => '',
                                                'tags' => ['Новинка', 'Лидер продаж'],
                                                'translations' => ['title' => ['en' => 'Sneakers Adidas Neo 10K Casual']]
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
                                                'image' => '',
                                                'translations' => ['title' => ['en' => 'Valenki Cotofey']]
                                            ]
                                        ]
                                    ],
                                    [
                                        'title' => 'Детская обувь',
                                        'name' => 'detskaya-obuv',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Children\'s shoes']],
                                        'children' => [

                                        ]
                                    ]
                                ]
                            ],
                            [
                                'title' => 'Сумки',
                                'name' => 'sumki',
                                'menuIndex' => 0,
                                'translations' => ['title' => ['en' => 'Bags']],
                                'children' => [
                                    [
                                        'title' => 'Женские сумки',
                                        'name' => 'zhenskie-sumki',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Women\'s handbags']],
                                        'children' => [

                                        ]
                                    ],
                                    [
                                        'title' => 'Мужские сумки',
                                        'name' => 'muzhskie-sumki',
                                        'menuIndex' => 0,
                                        'translations' => ['title' => ['en' => 'Men\'s bags']],
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
                'title' => 'Корневая категория',
                'name' => 'root',
                'menuIndex' => 0,
                'children' => [],
                'content' => [
                    [
                        'title' => 'О магазине',
                        'name' => 'about',
                        'description' => 'Тут будет описание...',
                        'menuIndex' => 1,
                        'translations' => ['title' => ['en' => 'About store']]
                    ],
                    [
                        'title' => 'Оплата и доставка',
                        'name' => 'payment',
                        'description' => 'Тут будет описание...',
                        'menuIndex' => 2,
                        'translations' => ['title' => ['en' => 'Payment and delivery']]
                    ],
                    [
                        'title' => 'Контакты',
                        'name' => 'contacts',
                        'description' => '',
                        'form_name' => 'contacts',
                        'menuIndex' => 3,
                        'translations' => ['title' => ['en' => 'Contacts'], 'form_name' => ['en' => 'contacts']]
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
            'default_language' => 'russian'
        ]);

        $this->catalogService->updateFiltersData($category, $settings['mongodb_database']);

        return true;
    }

    public static function getGroups(): array
    {
         return ['ru'];
    }
}
