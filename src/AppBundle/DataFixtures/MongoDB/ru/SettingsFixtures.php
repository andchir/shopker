<?php

namespace AppBundle\DataFixtures\MongoDB\ru;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\Setting;
use Symfony\Component\Cache\Simple\FilesystemCache;

class SettingsFixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {

        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');
        $cache->clear();

        $data = [
            'SETTINGS_ORDER_STATUSES' => [
                [
                    'name' => 'Новый',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#17a2b8', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Оплачен',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#42c5f4', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Ожидается отправка',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#e65c00', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Отправлен',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#ffc107', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Доставлен',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#28a745', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Отменен',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#dc3545', 'type' => 'text']
                    ]
                ]
            ],
            'SETTINGS_DELIVERY' => [
                [
                    'name' => 'Самовывоз',
                    'description' => '',
                    'options' => [
                        'price' => ['value' => 0, 'type' => 'number'],
                        'priceLimit' => ['value' => 0, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'Доставка по городу',
                    'description' => '',
                    'options' => [
                        'price' => ['value' => 0, 'type' => 'number'],
                        'priceLimit' => ['value' => 0, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'Доставка по России',
                    'description' => '',
                    'options' => [
                        'price' => ['value' => 0, 'type' => 'number'],
                        'priceLimit' => ['value' => 0, 'type' => 'number']
                    ]
                ]
            ],
            'SETTINGS_PAYMENT' => [
                [
                    'name' => 'Оплата при получении',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => '', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'PayPal',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 'PayPal_Express', 'type' => 'text']
                    ]
                ]
            ],
            'SETTINGS_CURRENCY' => [
                [
                    'name' => 'Руб.',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 1, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'USD',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 61, 'type' => 'number']
                    ]
                ]
            ]
        ];

        foreach ($data as $groupName => $settingsGroup) {
            foreach ($settingsGroup as $item) {
                $setting = new Setting();
                $setting
                    ->setName($item['name'])
                    ->setDescription($item['description'])
                    ->setGroupName($groupName)
                    ->setOptions($item['options']);

                $manager->persist($setting);
            }
        }

        $manager->flush();
    }
}
