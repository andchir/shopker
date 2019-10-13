<?php

namespace App\DataFixtures\MongoDB\en;

use Doctrine\Bundle\MongoDBBundle\Fixture\Fixture;
use Doctrine\Bundle\MongoDBBundle\Fixture\FixtureGroupInterface;
use Doctrine\Common\Persistence\ObjectManager;
use App\MainBundle\Document\Setting;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class SettingsFixtures extends Fixture implements ContainerAwareInterface, FixtureGroupInterface
{

    /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {

        /** @var FilesystemAdapter $cache */
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
                    'name' => 'Paid',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#42c5f4', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Awaiting shipment',
                    'description' => '',
                    'options' => [
                        'template' => ['value' => 'userEmailStatus', 'type' => 'text'],
                        'color' => ['value' => '#e65c00', 'type' => 'text']
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
                    'name' => 'EUR',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 1.16, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'RUB',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 0.014, 'type' => 'number']
                    ]
                ]
            ],
            'SETTINGS_LANGUAGES' => [
                [
                    'name' => 'English',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 'en', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'Русский',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 'ru', 'type' => 'text']
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

    public static function getGroups(): array
    {
        return ['en'];
    }
}
