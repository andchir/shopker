<?php

namespace AppBundle\Service;

use AppBundle\Document\Setting;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;

class SettingsService
{
    /** @var ContainerInterface */
    protected $container;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param string $yamlFileName
     * @return array
     */
    public function getSettingsFromYaml($yamlFileName = 'settings', $transform = true)
    {
        $rootPath = $this->container->getParameter('kernel.root_dir');
        $settingsFilePath = $rootPath . DIRECTORY_SEPARATOR . "config/{$yamlFileName}.yml";
        if (file_exists($settingsFilePath)) {
            try {
                $settings = Yaml::parse(file_get_contents($settingsFilePath));
                if (!$transform) {
                    return $settings['parameters'];
                }
                return self::transformParameters($settings['parameters']);
            } catch (ParseException $e) {
                return [];
            }
        }
        return [];
    }

    /**
     * @return array
     */
    public function getAll()
    {
        return $this->getRepository()->getAll();
    }

    /**
     * @return array
     */
    public function getArray()
    {
        $settings = $this->getRepository()->getAll(true);
        return $settings;
    }

    /**
     * @param $groupName
     * @return array
     */
    public function getSettingsGroup($groupName)
    {
        return $this->getRepository()
            ->getSettingsGroup($groupName);
    }

    /**
     * @param string $settingName
     * @param string|null $groupName
     * @return object
     */
    public function getSetting($settingName, $groupName = null)
    {
        return $this->getRepository()->getSetting($settingName, $groupName);
    }

    /**
     * @return \AppBundle\Repository\FieldTypeRepository
     */
    public function getRepository()
    {
        return $this->container->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Setting::class);
    }

    /**
     * @param array $parameters
     * @return array
     */
    public static function transformParameters($parameters)
    {
        $output = [];
        foreach ($parameters as $key => $value) {
            $output[] = ['name' => $key, 'value' => $value];
        }
        return $output;
    }
}