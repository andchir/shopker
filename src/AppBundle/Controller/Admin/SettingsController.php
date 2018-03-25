<?php

namespace AppBundle\Controller\Admin;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Cache\Simple\FilesystemCache;

use AppBundle\Document\Setting;

/**
 * Class SettingsController
 * @package AppBundle\SettingsController
 * @Route("/admin/settings")
 */
class SettingsController extends Controller
{
    const GROUP_MAIN = 'SETTINGS_MAIN';
    const GROUP_DELIVERY = 'SETTINGS_DELIVERY';
    const GROUP_ORDER_STATUSES = 'SETTINGS_ORDER_STATUSES';

    /**
     * @Route("")
     * @Method({"GET"})
     *
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function getList(SerializerInterface $serializer)
    {
        $output = [
            self::GROUP_MAIN => [],
            self::GROUP_DELIVERY => [],
            self::GROUP_ORDER_STATUSES => []
        ];

        $output[self::GROUP_MAIN] = $this->getSettingsFromYaml('settings');
        $output[self::GROUP_DELIVERY] = $this->getRepository()->findBy([
            'groupName' => self::GROUP_DELIVERY
        ], ['id' => 'asc']);
        $output[self::GROUP_ORDER_STATUSES] = $this->getRepository()->findBy([
            'groupName' => self::GROUP_ORDER_STATUSES
        ], ['id' => 'asc']);

        $output = $serializer->serialize($output, 'json', ['groups' => ['list']]);

        return new JsonResponse($output, 200, [], true);
    }

    /**
     * @Route("/{groupName}")
     * @Method({"PUT"})
     * @param Request $request
     * @param $groupName
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function updateGroup(Request $request, $groupName, SerializerInterface $serializer)
    {
        $data = json_decode($request->getContent(), true);

        switch ($groupName) {
            case self::GROUP_MAIN:

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

        // $this->cacheClearAction();

        $output = $serializer->serialize($settings, 'json', ['groups' => ['list']]);

        return new JsonResponse($output, 200, [], true);
    }

    /**
     * @Route("/clear_cache")
     * @Method({"POST"})
     * @return JsonResponse
     */
    public function clearCacheAction()
    {
        $cache = new FilesystemCache();
        $cache->clear();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * Clear app cache
     */
    public function cacheClearAction() {
        $kernel = $this->container->get('kernel');
        $environment = $kernel->getEnvironment();
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput([
            'command' => 'cache:clear',
            '--env'   => $environment
        ]);

        $output = new BufferedOutput();
        $application->run($input, $output);
    }

    /**
     * @param string $yamlFileName
     * @return array
     */
    public function getSettingsFromYaml($yamlFileName = 'settings', $transform = true)
    {
        $rootPath = $this->getParameter('kernel.root_dir');
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
     * @param string $yamlFileName
     * @param $data
     * @return bool|int
     */
    public function saveSettingsToYaml($yamlFileName = 'settings', $data)
    {
        $rootPath = $this->getParameter('kernel.root_dir');
        $settingsFilePath = $rootPath . DIRECTORY_SEPARATOR . "config/{$yamlFileName}.yml";
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
     * @return \AppBundle\Repository\FieldTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Setting::class);
    }

}
