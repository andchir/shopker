<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\Category;
use App\Service\SettingsService;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Cache\Simple\FilesystemCache;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use App\MainBundle\Document\Setting;

/**
 * Class SettingsController
 * @package App\SettingsController
 * @Route("/admin/settings", name="settings_")
 */
class SettingsController extends Controller
{
    /**
     * @Route("", methods={"GET"})
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function getList(SerializerInterface $serializer)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');

        $output = [
            Setting::GROUP_MAIN => [],
            Setting::GROUP_ORDER_STATUSES => [],
            Setting::GROUP_DELIVERY => [],
            Setting::GROUP_PAYMENT => [],
            Setting::GROUP_CURRENCY => []
        ];

        $output[Setting::GROUP_MAIN] = $this->getSettingsFromYaml('settings');
        $output[Setting::GROUP_ORDER_STATUSES] = $settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
        $output[Setting::GROUP_DELIVERY] = $settingsService->getSettingsGroup(Setting::GROUP_DELIVERY);
        $output[Setting::GROUP_PAYMENT] = $settingsService->getSettingsGroup(Setting::GROUP_PAYMENT);
        $output[Setting::GROUP_CURRENCY] = $settingsService->getSettingsGroup(Setting::GROUP_CURRENCY);

        $output = $serializer->serialize($output, 'json', ['groups' => ['list']]);

        return new JsonResponse($output, 200, [], true);
    }

    /**
     * @Route("/{groupName}", methods={"PUT"})
     * @param Request $request
     * @param $groupName
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function updateGroup(Request $request, $groupName, SerializerInterface $serializer)
    {
        $data = json_decode($request->getContent(), true);

        switch ($groupName) {
            case Setting::GROUP_MAIN:

                $settings = $this->getSettingsFromYaml('settings', false);
                $data = self::transformParametersInverse($data);

                $settings = array_merge($settings, $data);

                $this->saveSettingsToYaml('settings', $settings);

                break;
            default:

                /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
                $dm = $this->get('doctrine_mongodb')->getManager();

                $settings = $this->getRepository()->findBy([
                    'groupName' => $groupName
                ], ['id' => 'asc']);

                // Update
                /** @var Setting $setting */
                foreach ($settings as $index => $setting) {
                    if (!isset($data[$index])) {
                        $dm->remove($setting);
                    } else {
                        if (isset($data[$index]['name'])) {
                            $setting->setName($data[$index]['name']);
                        }
                        if (isset($data[$index]['description'])) {
                            $setting->setName($data[$index]['description']);
                        }
                        if (isset($data[$index]['options']) && is_array($data[$index]['options'])) {
                            $setting->updateOptionsValues($data[$index]['options']);
                        }
                        $dm->persist($setting);
                    }
                }

                // Add new
                if (count($data) > count($settings)) {
                    array_splice($data, 0, count($settings));
                    foreach ($data as $newSetting) {
                        $setting = new Setting();
                        $setting->setGroupName($groupName);
                        if (isset($newSetting['name'])) {
                            $setting->setName($newSetting['name']);
                        }
                        if (isset($newSetting['description'])) {
                            $setting->setDescription($newSetting['description']);
                        }
                        if (isset($newSetting['options']) && is_array($newSetting['options'])) {
                            $setting->setOptions($newSetting['options']);
                        }
                        $dm->persist($setting);
                        $settings[] = $setting;
                    }
                }

                $dm->flush();

                break;
        }

        // $this->systemCacheClearAction();

        $output = $serializer->serialize($settings, 'json', ['groups' => ['list']]);

        return new JsonResponse($output, 200, [], true);
    }

    /**
     * @Route("/clear_cache", name="clear_cache", methods={"POST"})
     * @return JsonResponse
     */
    public function clearCacheAction()
    {
        /** @var FilesystemCache $cache */
        $cache = $this->get('app.filecache');
        $cache->clear();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @Route("/clear_system_cache", name="clear_system_cache", methods={"POST"})
     * @return JsonResponse
     */
    public function systemCacheClearAction()
    {
        $result = $this->systemCacheClear();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @Route("/update_filters", name="update_filters", methods={"POST"})
     * @return JsonResponse
     */
    public function updateFiltersAction()
    {
        $productController = new ProductController();
        $productController->setContainer($this->container);

        /** @var \App\Repository\CategoryRepository $categoryRepository */
        $categoryRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);

        $count = 0;
        $categories = $categoryRepository->findAll();
        foreach ($categories as $category) {
            $productController->updateFiltersData($category);
            $count++;
        }

        return new JsonResponse([
            'success' => true,
            'count' => $count
        ]);
    }

    /**
     * Clear system cache
     * @param null $environment
     * @return array
     */
    public function systemCacheClear($environment = null)
    {
        /** @var KernelInterface $kernel */
        $kernel = $this->container->get('kernel');
        if (!$environment) {
            $environment = $kernel->getEnvironment();
        }
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput([
            'command' => 'cache:clear',
            '--env' => $environment,
            '--quiet' => ''
        ]);

        $output = new BufferedOutput();
        $application->run($input, $output);
        $output->fetch();

        return $this->updateInternationalization();
    }

    /**
     * Update Internationalization files
     * @return array
     */
    public function updateInternationalization()
    {
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
        $jsonDirPath = $rootPath . '/frontend/src/i18n';
        $jsPublicDirPath = $rootPath . '/public/admin/i18n';
        $pluginsDirPath = $rootPath . '/vendor/shk4-plugins';

        $sourceFiles = array_diff(scandir($jsonDirPath), ['..', '.']);
        $sourceFiles = array_map(function($value) use ($jsonDirPath) {
            return $jsonDirPath . DIRECTORY_SEPARATOR . $value;
        }, $sourceFiles);

        if (is_dir($pluginsDirPath)) {
            $pluginsDirs = array_diff(scandir($pluginsDirPath), ['..', '.']);
            $pluginsDirs = array_filter($pluginsDirs, function ($fileName) {
                return mb_substr($fileName, 0, 1) !== '.';
            });
            foreach ($pluginsDirs as $pluginsDir) {
                $dirPath = $pluginsDirPath . DIRECTORY_SEPARATOR . $pluginsDir . '/frontend/src/i18n';
                if (!is_dir($dirPath)) {
                    continue;
                }
                $files = array_diff(scandir($dirPath), ['..', '.']);
                $files = array_map(function($value) use ($dirPath) {
                    return $dirPath . DIRECTORY_SEPARATOR . $value;
                }, $files);
                if (!empty($files)) {
                    $sourceFiles = array_merge($sourceFiles, $files);
                }
            }
        }

        $lang = [];
        foreach ($sourceFiles as $jsonFilePath) {
            $pathInfo = pathinfo($jsonFilePath);
            if (!isset($lang[$pathInfo['filename']])) {
                $lang[$pathInfo['filename']] = [];
            }
            $content = file_get_contents($jsonFilePath);
            $content = json_decode($content, true);
            if (is_array($content)) {
                $lang[$pathInfo['filename']] = array_merge($lang[$pathInfo['filename']], $content);
            }
        }
        unset($content);

        // Update JS files
        $error = '';
        foreach ($lang as $k => $value) {
            $targetFilePath = $jsPublicDirPath . "/{$k}.js";
            if (file_exists($targetFilePath) && !is_writable($targetFilePath)) {
                $error = 'File is not writable.';
                continue;
            }
            $content  = 'var APP_LANG = ';
            $content .= json_encode($value, JSON_FORCE_OBJECT | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            $content .= ';';
            file_put_contents($targetFilePath, $content);
        }

        return [
            'success' => empty($error),
            'msg' => $error
        ];
    }

    /**
     * @param string $yamlFileName
     * @return array
     */
    public function getSettingsFromYaml($yamlFileName = 'settings', $transform = true)
    {
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
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
     * @param string $yamlFileName
     * @param $data
     * @return bool|int
     */
    public function saveSettingsToYaml($yamlFileName = 'settings', $data)
    {
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
        $settingsFilePath = $rootPath . DIRECTORY_SEPARATOR . "config/{$yamlFileName}.yaml";
        $yaml = Yaml::dump(['parameters' => $data]);

        return file_put_contents($settingsFilePath, $yaml);
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
     * @param array $parameters
     * @return array
     */
    public static function transformParametersInverse($parameters)
    {
        if (!is_array($parameters) || !isset($parameters[0])) {
            return $parameters;
        }
        $output = [];
        foreach ($parameters as $parameter) {
            $output[$parameter['name']] = $parameter['value'];
        }
        return $output;
    }

    /**
     * @return \App\Repository\FieldTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Setting::class);
    }

}
