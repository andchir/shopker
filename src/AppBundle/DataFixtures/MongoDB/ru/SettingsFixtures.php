<?php

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\Setting;

class SettingsFixtures extends Fixture
{

    public function load(ObjectManager $manager)
    {
        $data = [
            [
                'name' => 'Новый',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#17a2b8', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Принят к оплате',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#42c5f4', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Отправлен',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#ffc107', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Доставлен',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#28a745', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Отменен',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#dc3545', 'type' => 'text']
                ]
            ],

            [
                'name' => 'Самовывоз',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'options' => [
                    'price' => ['value' => 0, 'type' => 'number'],
                    'priceLimit' => ['value' => 0, 'type' => 'number']
                ]
            ],
            [
                'name' => 'Доставка по городу',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'options' => [
                    'price' => ['value' => 0, 'type' => 'number'],
                    'priceLimit' => ['value' => 0, 'type' => 'number']
                ]
            ],
            [
                'name' => 'Доставка по России',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'options' => [
                    'price' => ['value' => 0, 'type' => 'number'],
                    'priceLimit' => ['value' => 0, 'type' => 'number']
                ]
            ]
        ];

        foreach ($data as $item) {
            $setting = new Setting();
            $setting
                ->setName($item['name'])
                ->setDescription($item['description'])
                ->setGroupName($item['groupName'])
                ->setOptions($item['options']);

            $manager->persist($setting);
        }

        $manager->flush();
    }
}
