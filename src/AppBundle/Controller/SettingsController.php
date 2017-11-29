<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;

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

        $output = $serializer->serialize($output, 'json', ['groups' => ['list']]);

        return new JsonResponse($output, 200, [], true);
    }

    /**
     * @Route("/{groupName}")
     * @Method({"PUT"})
     * @param Request $request
     * @param string $groupName
     * @return JsonResponse
     */
    public function updateGroup(Request $request, $groupName)
    {
        $settings = [];
        $data = json_decode($request->getContent(), true);

        switch ($groupName) {
            case self::GROUP_MAIN:

                $settings = $this->getSettingsFromYaml('settings', false);
                $settings = array_merge($settings, $data);

                $this->saveSettingsToYaml('settings', $settings);

                break;
        }

        return new JsonResponse($settings);
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
     * @return \AppBundle\Repository\FieldTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Setting::class);
    }

}
