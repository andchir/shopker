<?php

namespace App\DataFixtures\MongoDB\en;

use Doctrine\Bundle\MongoDBBundle\Fixture\Fixture;
use Doctrine\Bundle\MongoDBBundle\Fixture\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use App\MainBundle\Document\FieldType;

class FieldTypesFixtures extends Fixture implements FixtureGroupInterface
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'formats',
                        'title' => 'Whitelist of buttons to display',
                        'default_value' => 'background,bold,color,font,code,italic,link,strike,script,underline,blockquote,header,indent,list,align,direction,code-block,formula,image,video,clean'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                        'name' => 'allowed_extensions',
                        'title' => 'Allowed extensions',
                        'default_value' => '.zip,.rar,.doc,.docx,.xls,.xlsx,.ods,.odt'
                    ],
                    [
                        'name' => 'has_preview_image',
                        'title' => 'Has preview image',
                        'default_value' => '0'
                    ],
                    [
                        'name' => 'multiple',
                        'title' => 'Allow adding fields',
                        'default_value' => '1'
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'allowed_extensions',
                        'title' => 'Allowed extensions',
                        'default_value' => '.zip,.rar,.doc,.docx,.xls,.xlsx,.ods,.odt'
                    ],
                    [
                        'name' => 'required',
                        'title' => 'Required',
                        'default_value' => '1'
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
                        'default_value' => 'mm/dd/yy'
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
                        'name' => 'first_day_of_week',
                        'title' => 'First day of week',
                        'default_value' => '0'
                    ],
                    [
                        'name' => 'locale',
                        'title' => 'Calendar language',
                        'default_value' => 'en'
                    ],
                    [
                        'name' => 'default_current',
                        'title' => 'Current date and time by default',
                        'default_value' => '1'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'format',
                        'title' => 'Format',
                        'default_value' => 'MM/dd/yyyy'
                    ],
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
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
                        'default_value' => '#000000'
                    ],
                    [
                        'name' => 'inline',
                        'title' => 'Show without button',
                        'default_value' => '0'
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
                        'default_value' => ''
                    ]
                ]
            ],
            'tags' => [
                'title' => 'Tags',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
                        'default_value' => ''
                    ]
                ]
            ],
            'categories' => [
                'title' => 'Categories',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'layout',
                        'title' => 'Layout type',
                        'default_value' => 'vertical'
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
                        'default_value' => ''
                    ]
                ]
            ],
            'parameters' => [
                'title' => 'Product parameters',
                'description' => 'Product parameters can affect the price. Available output types: radio, checkbox, select, text.',
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
                        'name' => 'names',
                        'title' => 'Field names',
                        'default_value' => 'NAME,VALUE,PRICE,IMAGE_NUMBER'
                    ],
                    [
                        'name' => 'keys',
                        'title' => 'Field keys',
                        'default_value' => 'name,value,price,imageNum'
                    ],
                    [
                        'name' => 'types',
                        'title' => 'Field types',
                        'default_value' => 'text,text,number,number'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'type',
                        'title' => 'Field type',
                        'default_value' => 'radio'
                    ],
                    [
                        'name' => 'firstSelected',
                        'title' => 'First selected?',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'groupByName',
                        'title' => 'Group by name',
                        'default_value' => '0'
                    ]
                ]
            ],
            'schedule' => [
                'title' => 'Schedule',
                'description' => 'Reservation for the date and time.',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Default value',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'slotDuration',
                        'title' => 'Minimum duration',
                        'default_value' => '0:10:00'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS class',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Chunk name',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'slotDuration',
                        'title' => 'Minimum duration',
                        'default_value' => '0:10:00'
                    ],
                    [
                        'name' => 'headerToolbar_right',
                        'title' => 'Кнопки переключения режима',
                        'default_value' => 'dayGridMonth,timeGridWeek,timeGridDay'
                    ],
                    [
                        'name' => 'initialView',
                        'title' => 'Default mode',
                        'default_value' => 'dayGridMonth'
                    ],
                    [
                        'name' => 'defaultAllDayEventDuration',
                        'title' => 'Default duration for an event - full day',
                        'default_value' => '24:00:00'
                    ],
                    [
                        'name' => 'defaultTimedEventDuration',
                        'title' => 'Default duration for an event - time',
                        'default_value' => '0:30:00'
                    ],
                    [
                        'name' => 'slotMinTime',
                        'title' => 'Minimum time',
                        'default_value' => '08:00:00'
                    ],
                    [
                        'name' => 'slotMaxTime',
                        'title' => 'Maximum time',
                        'default_value' => '20:00:00'
                    ],
                    [
                        'name' => 'outputFormat',
                        'title' => 'Output date and time format (PHP)',
                        'default_value' => 'd/m/Y H:i'
                    ],
                    [
                        'name' => 'allDaySlot',
                        'title' => 'Full day booking option',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'navLinks',
                        'title' => 'Link to the page of the day',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'fullCalendarOptionsFieldName',
                        'title' => 'Name of the field with calendar options',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'required',
                        'title' => 'Required',
                        'default_value' => '1'
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

    public static function getGroups(): array
    {
        return ['en'];
    }
}
