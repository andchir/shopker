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
                'name' => 'Самовывоз',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'type' => 'string',
                'value' => '0',
                'options' => [
                    ['name' => 'priceLimit', 'value' => 0]
                ]
            ],
            [
                'name' => 'Доставка по городу',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'type' => 'string',
                'value' => '0',
                'options' => [
                    ['name' => 'priceLimit', 'value' => 0]
                ]
            ],
            [
                'name' => 'Доставка по России',
                'description' => '',
                'groupName' => 'SETTINGS_DELIVERY',
                'type' => 'string',
                'value' => '0',
                'options' => [
                    ['name' => 'priceLimit', 'value' => 0]
                ]
            ]
        ];

        foreach ($data as $item) {
            $setting = new Setting();
            $setting
                ->setName($item['name'])
                ->setDescription($item['description'])
                ->setGroupName($item['groupName'])
                ->setType($item['type'])
                ->setValue($item['value'])
                ->setOptions($item['options']);

            $manager->persist($setting);
        }

        $manager->flush();
    }
}
