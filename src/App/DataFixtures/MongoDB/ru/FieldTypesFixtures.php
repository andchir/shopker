<?php

namespace App\DataFixtures\MongoDB\ru;

use Doctrine\Bundle\MongoDBBundle\Fixture\Fixture;
use Doctrine\Bundle\MongoDBBundle\Fixture\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use App\MainBundle\Document\FieldType;

class FieldTypesFixtures extends Fixture implements FixtureGroupInterface
{

    public function load(ObjectManager $manager) {

        $data = [
            'checkbox' => [
                'title' => 'Чекбокс',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'values_list',
                        'title' => 'Список значений',
                        'default_value' => ''
                    ],
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                        'name' => 'values_list',
                        'title' => 'Список значений',
                        'default_value' => ''
                    ],
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                        'name' => 'source_field',
                        'title' => 'Поле источник',
                        'default_value' => 'title'
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                    ],
                    [
                        'name' => 'formats',
                        'title' => 'Список кнопок',
                        'default_value' => 'background,bold,color,font,code,italic,link,strike,script,underline,blockquote,header,indent,list,align,direction,code-block,formula,image,video,clean'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                        'default_value' => null
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                        'name' => 'values_list',
                        'title' => 'Список значений',
                        'default_value' => ''
                    ],
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                        'name' => 'allowed_extensions',
                        'title' => 'Разрешенные типы файлов',
                        'default_value' => '.zip,.rar,.doc,.docx,.xls,.xlsx,.ods,.odt'
                    ],
                    [
                        'name' => 'has_preview_image',
                        'title' => 'Изображение предпросмотра',
                        'default_value' => '0'
                    ],
                    [
                        'name' => 'multiple',
                        'title' => 'Разрешить добавление полей',
                        'default_value' => '1'
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'allowed_extensions',
                        'title' => 'Разрешенные типы файлов',
                        'default_value' => '.zip,.rar,.doc,.docx,.xls,.xlsx,.ods,.odt'
                    ],
                    [
                        'name' => 'required',
                        'title' => 'Обязательный',
                        'default_value' => '1'
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
                        'default_value' => 'mm/dd/yy'
                    ],
                    [
                        'name' => 'show_time',
                        'title' => 'Показывать время',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'hour_format',
                        'title' => 'Формат времени',
                        'default_value' => '24'
                    ],
                    [
                        'name' => 'first_day_of_week',
                        'title' => 'Первый день недели',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'locale',
                        'title' => 'Язык календаря',
                        'default_value' => 'ru'
                    ],
                    [
                        'name' => 'default_current',
                        'title' => 'Текущая дата и время по умолчанию',
                        'default_value' => '1'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'format',
                        'title' => 'Формат даты',
                        'default_value' => 'MM/dd/yyyy'
                    ],
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
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
                        'default_value' => '#000000'
                    ],
                    [
                        'name' => 'inline',
                        'title' => 'Показывать без кнопки',
                        'default_value' => '0'
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
                        'default_value' => ''
                    ]
                ]
            ],
            'tags' => [
                'title' => 'Метки',
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
                        'default_value' => ''
                    ]
                ]
            ],
            'categories' => [
                'title' => 'Категории',
                'description' => '',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'layout',
                        'title' => 'Тип отображения',
                        'default_value' => 'vertical'
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
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
                        'default_value' => ''
                    ]
                ]
            ],
            'parameters' => [
                'title' => 'Параметры товара',
                'description' => 'Параметры товара могут влиять на цену. Доступные типы вывода: radio, checkbox, select, text.',
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
                        'name' => 'names',
                        'title' => 'Названия',
                        'default_value' => 'NAME,VALUE,PRICE,IMAGE_NUMBER'
                    ],
                    [
                        'name' => 'keys',
                        'title' => 'Ключи',
                        'default_value' => 'name,value,price,imageNum'
                    ],
                    [
                        'name' => 'types',
                        'title' => 'Типы полей',
                        'default_value' => 'text,text,number,number'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'type',
                        'title' => 'Тип поля',
                        'default_value' => 'radio'
                    ],
                    [
                        'name' => 'firstSelected',
                        'title' => 'Первый выбран?',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'groupByName',
                        'title' => 'Группировать по имени',
                        'default_value' => '0'
                    ]
                ]
            ],
            'schedule' => [
                'title' => 'Расписание',
                'description' => 'Бронирование на дату и время.',
                'isActive' => true,
                'inputProperties' => [
                    [
                        'name' => 'value',
                        'title' => 'Значение по умолчанию',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'slotDuration',
                        'title' => 'Минимальная продолжительность',
                        'default_value' => '0:10:00'
                    ]
                ],
                'outputProperties' => [
                    [
                        'name' => 'className',
                        'title' => 'CSS класс',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'chunkName',
                        'title' => 'Название чанка',
                        'default_value' => 'schedule'
                    ],
                    [
                        'name' => 'slotDuration',
                        'title' => 'Минимальная продолжительность',
                        'default_value' => '0:10:00'
                    ],
                    [
                        'name' => 'headerToolbar_right',
                        'title' => 'Кнопки переключения режима',
                        'default_value' => 'dayGridMonth,timeGridWeek,timeGridDay'
                    ],
                    [
                        'name' => 'initialView',
                        'title' => 'Режим по умолчанию',
                        'default_value' => 'dayGridMonth'
                    ],
                    [
                        'name' => 'defaultAllDayEventDuration',
                        'title' => 'Длительность по умолчанию для события - полный день',
                        'default_value' => '24:00:00'
                    ],
                    [
                        'name' => 'defaultTimedEventDuration',
                        'title' => 'Длительность по умолчанию для события - часть дня',
                        'default_value' => '0:30:00'
                    ],
                    [
                        'name' => 'slotMinTime',
                        'title' => 'Минимальное время',
                        'default_value' => '08:00:00'
                    ],
                    [
                        'name' => 'slotMaxTime',
                        'title' => 'Максимальное время',
                        'default_value' => '20:00:00'
                    ],
                    [
                        'name' => 'outputFormat',
                        'title' => 'Формат даты и времени на выходе (PHP)',
                        'default_value' => 'd/m/Y H:i'
                    ],
                    [
                        'name' => 'allDaySlot',
                        'title' => 'Возможность бронирования полного дня',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'navLinks',
                        'title' => 'Ссылка на страницу дня',
                        'default_value' => '1'
                    ],
                    [
                        'name' => 'fullCalendarOptionsFieldName',
                        'title' => 'Название поля с параметрами календаря',
                        'default_value' => ''
                    ],
                    [
                        'name' => 'required',
                        'title' => 'Обязательный',
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
        return ['ru'];
    }
}
