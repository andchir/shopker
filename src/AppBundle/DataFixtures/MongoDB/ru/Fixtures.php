<?php

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\FieldType;

class Fixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {

        // Field types
        $data = [
            'checkbox' => [
                'title' => 'Чекбокс',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'select' => [
                'title' => 'Выпадающий список',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'system_name' => [
                'title' => 'Системное имя',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'text' => [
                'title' => 'Текстовое поле',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'textarea' => [
                'title' => 'Текстая область',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'rows',
                        'title' => 'Число строк',
                        'default_value' => '6'
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'rich_text' => [
                'title' => 'Текстовый редактор',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'number' => [
                'title' => 'Число',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => null
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
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
                        'title' => 'Шаг',
                        'default_value' => 1
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'radio' => [
                'title' => 'Переключатель',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'file' => [
                'title' => 'Файл',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => 'FileHandler'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'image' => [
                'title' => 'Картинка',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => 'ImageHandler'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'date' => [
                'title' => 'Дата',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'format',
                        'title' => 'Формат даты',
                        'default_value' => 'Y-m-d H:i:s'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'hidden' => [
                'title' => 'Скрытое поле',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ]
                ]
            ],
            'color' => [
                'title' => 'Цвет',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'handler',
                        'title' => 'Обработчик',
                        'default_value' => ''
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
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