<?php

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\FieldType;

class en extends Fixture
{

    public function load(ObjectManager $manager)
    {

        $this->loadFieldTypes($manager);

    }

    public function loadFieldTypes(ObjectManager $manager)
    {

        // Field types
        $data = [
            'checkbox' => [
                'title' => 'Checkbox',
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
                        'title' => 'Handle',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class name',
                        'default_value' => ''
                    ]
                ]
            ],
            'select' => [
                'title' => 'Drop-down select',
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
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
                        'default_value' => ''
                    ]
                ]
            ],
            'textarea' => [
                'title' => 'Textarea',
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
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
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
                        'title' => 'Разрешить десятичные?',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'decimal_precision',
                        'title' => 'Точность',
                        'default_value' => '2'
                    ],
                    [
                        'name' => 'decimal_separator',
                        'title' => 'Разделитель',
                        'default_value' => '.'
                    ],
                    [
                        'name' => 'max',
                        'title' => 'Максимальное значение',
                        'default_value' => null
                    ],
                    [
                        'name' => 'min',
                        'title' => 'Минимальное значение',
                        'default_value' => 0
                    ],
                    [
                        'name' => 'step',
                        'title' => 'Step',
                        'default_value' => 1
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
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
                        'title' => 'Date format',
                        'default_value' => 'Y-m-d H:i:s'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
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
                        'title' => 'CSS class name',
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