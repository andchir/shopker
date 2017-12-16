<?php

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\FieldType;
use AppBundle\Document\ContentType;
use AppBundle\Document\Category;

class CatalogFixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {

        $this->loadContentType($manager);
        $this->loadCategory($manager);

    }

    public function loadContentType(ObjectManager $manager) {

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
                    'className' => ''
                ],
                'group' => 'Основное',
                'required' => true,
                'showInTable' => true,
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
                'isFilter' => false
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
                    'className' => ''
                ],
                'group' => 'Основное',
                'required' => false,
                'showInTable' => true,
                'isFilter' => false
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
                'isFilter' => true
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
                    'className' => ''
                ],
                'group' => 'Параметры',
                'required' => false,
                'showInTable' => false,
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
                'group' => 'CКатегории',
                'required' => false,
                'showInTable' => false,
                'isFilter' => true
            ]
        ];

        $contentType = new ContentType();
        $contentType
            ->setTitle('Общий')
            ->setName('general')
            ->setDescription('Товары каталога')
            ->setCollection('products')
            ->setFields($fields)
            ->setGroups(['Основное','Параметры','Категории'])
            ->setIsActive(true);

        $manager->persist($contentType);
        $manager->flush();

        $this->addReference('content_type', $contentType);
    }

    public function loadCategory(ObjectManager $manager) {

        $category = new Category();
        $contentType = $this->getReference('content_type');

        $category
            ->setTitle('Категория каталога')
            ->setName('default')
            ->setDescription('Категория по умолчанию')
            ->setIsActive(true)
            ->setParentId(0)
            ->setContentTypeName($contentType->getName())
            ->setContentType($contentType);

        $manager->persist($category);
        $manager->flush();
    }

}
