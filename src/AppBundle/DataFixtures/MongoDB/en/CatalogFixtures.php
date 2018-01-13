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
                    'chunkName' => 'header3'
                ],
                'group' => 'General',
                'required' => true,
                'showInTable' => true,
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
                    'className' => ''
                ],
                'group' => 'General',
                'required' => false,
                'showInTable' => false,
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
                'isFilter' => false
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
                'isFilter' => true
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
                    'className' => ''
                ],
                'group' => 'Options',
                'required' => false,
                'showInTable' => false,
                'isFilter' => true
            ],
            [
                'title' => 'Categories',
                'name' => 'categories',
                'description' => 'You can select multiple categories for the item.',
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

        $this->addReference('content_type', $contentType);
    }

    public function loadCategory(ObjectManager $manager) {

        $category = new Category();
        /** @var ContentType $contentType */
        $contentType = $this->getReference('content_type');

        $category
            ->setTitle('Products category')
            ->setName('default')
            ->setDescription('Default category')
            ->setIsActive(true)
            ->setParentId(0)
            ->setContentTypeName($contentType->getName())
            ->setContentType($contentType);

        $manager->persist($category);
        $manager->flush();
    }

}
