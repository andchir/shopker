<?php

namespace App\Service;

use App\MainBundle\Document\Setting;
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
        $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
        $settingsFilePath = $rootPath . DIRECTORY_SEPARATOR . "config/{$yamlFileName}.yaml";
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
        $settingsFilePath = $this->getConfigYamlFilePath($yamlFileName);
        $yaml = Yaml::dump(['parameters' => $data]);
        if (!is_writable($settingsFilePath)) {
            return false;
        } else {
            return file_put_contents($settingsFilePath, $yaml);
        }
    }

    /**
     * Get config yml file path
     * @param $yamlFileName
     * @return string
     */
    public function getConfigYamlFilePath($yamlFileName)
    {
        $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
        return $rootPath . DIRECTORY_SEPARATOR . "config/{$yamlFileName}.yaml";
    }

    /**
     * @param $statusName
     * @return int
     */
    public function getOrderStatusNumber($statusName)
    {
        $orderStatusSettings = $this->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);

        $index = self::array_find($orderStatusSettings, function($setting) use ($statusName) {
            /** @var Setting $setting */
            return $setting->getName() === $statusName;
        });
        return $index !== null ? $index + 1 : 0;
    }

    /**
     * @param $statusNumber
     * @return Setting|null
     */
    public function getOrderStatusByNumber($statusNumber)
    {
        $orderStatusSettings = $this->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
        return isset($orderStatusSettings[$statusNumber-1])
            ? $orderStatusSettings[$statusNumber-1]
            : null;
    }

    /**
     * Get currency
     * @return string
     */
    public function getCurrency()
    {
        $currencyCookie = isset($_COOKIE['shkCurrency'])
            ? $_COOKIE['shkCurrency']
            : '';
        $currencySettings = $this->getSettingsGroup(Setting::GROUP_CURRENCY);
        if (empty($currencySettings)) {
            return '';
        }
        $currentCurrencySettings = array_filter($currencySettings, function($setting) use ($currencyCookie) {
            /** @var Setting $setting */
            return $setting->getName() == $currencyCookie;
        });
        if (!empty($currentCurrencySettings)) {
            return current($currentCurrencySettings)->getName();
        } else {
            return current($currencySettings)->getName();
        }
    }

    /**
     * Get currency rate
     * @param $currency
     * @return int
     */
    public function getCurrencyRate($currency)
    {
        $currencySettings = $this->getSettingsGroup(Setting::GROUP_CURRENCY);
        if (empty($currencySettings)) {
            return 1;
        }
        $currentCurrencySettings = array_filter($currencySettings, function($setting) use ($currency) {
            /** @var Setting $setting */
            return $setting->getName() == $currency;
        });
        if (!empty($currentCurrencySettings)) {
            return current($currentCurrencySettings)->getOption('value');
        } else {
            return current($currencySettings)->getOption('value');
        }
    }

    /**
     * @return \App\Repository\FieldTypeRepository
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