<?php

namespace AppBundle\Service;

use AppBundle\Document\Setting;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\KernelInterface;
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
     * @param bool $transform
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
     * Recursively delete directory
     * @param $dir
     * @return bool
     */
    public static function delDir($dir) {
        $files = array_diff(scandir($dir), ['.','..']);
        foreach ($files as $file) {
            is_dir("$dir/$file")
                ? self::delDir("$dir/$file")
                : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    /**
     * Delete system cache files
     * @return bool
     */
    public function systemCacheFilesDelete()
    {
        $rootPath = dirname($this->container->get('kernel')->getRootDir());
        $cacheDirPath = $rootPath . '/var/cache';
        return self::delDir($cacheDirPath);
    }

    /**
     * @param string $yamlFileName
     * @param $data
     * @return bool|int
     */
    public function saveSettingsToYaml($yamlFileName = 'settings', $data)
    {
        $rootPath = $this->container->getParameter('kernel.root_dir');
        $settingsFilePath = $rootPath . DIRECTORY_SEPARATOR . "config/{$yamlFileName}.yml";
        $yaml = Yaml::dump(['parameters' => $data]);

        return file_put_contents($settingsFilePath, $yaml);
    }

    /**
     * @param $statusName
     * @param $orderStatusSettings
     * @return int
     */
    public function getStatusNumber($statusName, $orderStatusSettings)
    {
        $index = self::array_find($orderStatusSettings, function($setting) use ($statusName) {
            /** @var Setting $setting */
            return $setting->getName() === $statusName;
        });
        return $index !== null ? $index + 1 : 0;
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

    /**
     * @param $array
     * @param $f
     * @return null
     */
    public static function array_find($array, $f) {
        foreach ($array as $k => $x) {
            if (call_user_func($f, $x) === true)
                return $k;
        }
        return null;
    }
}