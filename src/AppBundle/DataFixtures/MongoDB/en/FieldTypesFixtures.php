<?php

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\FieldType;
use AppBundle\Document\ContentType;
use AppBundle\Document\Category;

class FieldTypesFixtures extends Fixture
{

    public function load(ObjectManager $manager) {

        $data = [
            'checkbox' => [
                'title' => 'Checkbox',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'values_list',
                        'title' => 'List of values',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'select' => [
                'title' => 'Dropdown select',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'values_list',
                        'title' => 'List of values',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'system_name' => [
                'title' => 'System name',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'source_field',
                        'title' => 'Source field',
                        'default_value' => 'title'
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'text' => [
                'title' => 'Text field',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'textarea' => [
                'title' => 'Text area',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'rows',
                        'title' => 'Rows number',
                        'default_value' => '6'
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'rich_text' => [
                'title' => 'Rich text editor',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'number' => [
                'title' => 'Number',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => null
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'allow_decimals',
                        'title' => 'Allow decimal?',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'decimal_precision',
                        'title' => 'Precision',
                        'default_value' => '2'
                    ],
                    [
                        'name' => 'decimal_separator',
                        'title' => 'Separator',
                        'default_value' => '.'
                    ],
                    [
                        'name' => 'max',
                        'title' => 'Maximum value',
                        'default_value' => null
                    ],
                    [
                        'name' => 'min',
                        'title' => 'Minimum value',
                        'default_value' => null
                    ],
                    [
                        'name' => 'step',
                        'title' => 'Step size',
                        'default_value' => 1
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'radio' => [
                'title' => 'Switch',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'values_list',
                        'title' => 'List of values',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'file' => [
                'title' => 'File',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => 'FileHandler'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'image' => [
                'title' => 'Image',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => 'ImageHandler'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'date' => [
                'title' => 'Date',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'format',
                        'title' => 'Format',
                        'default_value' => 'yy-mm-dd'
                    ],
                    [
                        'name' => 'show_time',
                        'title' => 'Show time',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'hour_format',
                        'title' => 'Hour format',
                        'default_value' => '24'
                    ],
                    [
                        'name' => 'locale',
                        'title' => 'Calendar language',
                        'default_value' => 'en'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'hidden' => [
                'title' => 'Hidden field',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ],
            'color' => [
                'title' => 'Color',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Handler',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ]
                ]
            ]
        ];

        foreach ($data as $name => $field) {

            $fieldType = new FieldType();
            $fieldType
                ->setTitle($field['title'])
                ->setName($name)
                ->setDescription($field['description'])
                ->setIsActive($field['isActive'])
                ->setInputProperties($field['inputProperties'])
                ->setOutputProperties($field['outputProperties']);

            $manager->persist($fieldType);
        }

        $manager->flush();
    }
}
