<?php

namespace AppBundle\DataFixtures\MongoDB\en;

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
                    'name' => 'New',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#17a2b8', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Accepted for payment',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#42c5f4', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Sent',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#ffc107', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Delivered',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#28a745', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Canceled',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#dc3545', 'type' => 'text']
                    ]
                ]
            ],
            'SETTINGS_DELIVERY' => [
                [
                    'name' => 'Self delivery',
                    'description' => '',
                    'options' => [
                        'price' => ['value' => 0, 'type' => 'number'],
                        'priceLimit' => ['value' => 0, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'Delivery in the city',
                    'description' => '',
                    'options' => [
                        'price' => ['value' => 0, 'type' => 'number'],
                        'priceLimit' => ['value' => 0, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'Delivery within the country',
                    'description' => '',
                    'options' => [
                        'price' => ['value' => 0, 'type' => 'number'],
                        'priceLimit' => ['value' => 0, 'type' => 'number']
                    ]
                ]
            ],
            'SETTINGS_PAYMENT' => [
                [
                    'name' => 'Online payment by credit card',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => '', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Payment upon receipt',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => '', 'type' => 'text']
                    ]
                ]
            ],
            'SETTINGS_CURRENCY' => [
                [
                    'name' => 'USD',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 1, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'Euro',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 1, 'type' => 'number']
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
