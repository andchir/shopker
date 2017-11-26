<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;

use AppBundle\Document\Setting;

/**
 * Class SettingsController
 * @package AppBundle\SettingsController
 * @Route("/admin/settings")
 */
class SettingsController extends BaseController
{

    /**
     * @Route("")
     * @Method({"GET"})
     * @return JsonResponse
     */
    public function getList(Request $request)
    {
        $output = [
            'main' => [],
            'delivery' => [],
            'order_statuses' => []
        ];

        $rootPath = $this->getParameter('kernel.root_dir');
        $settingsFilePath = $rootPath . DIRECTORY_SEPARATOR . 'config/settings.yml';

        if (file_exists($settingsFilePath)) {
            try {
                $settings = Yaml::parse(file_get_contents($settingsFilePath));
                $output['main'] = self::transformParameters($settings['parameters']);
            } catch (ParseException $e) {
                return $this->setError(sprintf('Unable to parse the YAML string: %s', $e->getMessage()));
            }
        }

        return new JsonResponse($output);
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
