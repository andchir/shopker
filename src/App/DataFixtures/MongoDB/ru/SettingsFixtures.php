<?php

namespace App\DataFixtures\MongoDB\ru;

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
                ]
            ],
            'SETTINGS_CURRENCY' => [
                [
                    'name' => 'RUB',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 1, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'USD',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 68, 'type' => 'number']
                    ]
                ],
                [
                    'name' => 'EUR',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 79, 'type' => 'number']
                    ]
                ]
            ],
            'SETTINGS_LANGUAGES' => [
                [
                    'name' => 'Русский',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 'ru', 'type' => 'text']
                    ]
                ],
                [
                    'name' => 'English',
                    'description' => '',
                    'options' => [
                        'value' => ['value' => 'en', 'type' => 'text']
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
        return ['ru'];
    }
}
