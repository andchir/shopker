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
                'name' => 'New',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#17a2b8', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Accepted for payment',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#42c5f4', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Sent',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#ffc107', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Delivered',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#28a745', 'type' => 'text']
                ]
            ],
            [
                'name' => 'Canceled',
                'description' => '',
                'groupName' => 'SETTINGS_ORDER_STATUSES',
                'options' => [
                    'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                    'color' => ['value' => '#dc3545', 'type' => 'text']
                ]
            ],

            [
                'name' => 'Self delivery',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'options' => [
                    'price' => ['value' => 0, 'type' => 'number'],
                    'priceLimit' => ['value' => 0, 'type' => 'number']
                ]
            ],
            [
                'name' => 'Delivery in the city',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'options' => [
                    'price' => ['value' => 0, 'type' => 'number'],
                    'priceLimit' => ['value' => 0, 'type' => 'number']
                ]
            ],
            [
                'name' => 'Delivery within the country',
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
