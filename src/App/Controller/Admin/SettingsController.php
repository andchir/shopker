<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\User;
use App\Service\CatalogService;
use App\Service\ComposerService;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;
use App\MainBundle\Document\Setting;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Twig\Environment as TwigEnvironment;

/**
 * Class SettingsController
 * @package App\SettingsController
 * @Route("/admin/settings")
 */
class SettingsController extends AbstractController
{
    /** @var ParameterBagInterface */
    protected $params;
    /** @var DocumentManager */
    protected $dm;
    /** @var TwigEnvironment */
    protected $twig;

    /**
     * TemplatesController constructor.
     * @param ParameterBagInterface $params
     * @param DocumentManager $dm
     * @param TwigEnvironment $twig
     */
    public function __construct(ParameterBagInterface $params, DocumentManager $dm, TwigEnvironment $twig)
    {
        $this->params = $params;
        $this->dm = $dm;
        $this->twig = $twig;
    }

    /**
     * @Route("", methods={"GET"})
     * @param SettingsService $settingsService
     * @return JsonResponse
     */
    public function getListAction(SettingsService $settingsService)
    {
        $output = [
            Setting::GROUP_MAIN => [],
            Setting::GROUP_ORDER_STATUSES => [],
            Setting::GROUP_DELIVERY => [],
            Setting::GROUP_PAYMENT => [],
            Setting::GROUP_CURRENCY => [],
            Setting::GROUP_PROMOCODES => [],
            Setting::GROUP_LANGUAGES => []
        ];

        $output[Setting::GROUP_MAIN] = $settingsService->getSettingsFromYaml('settings');
        $output[Setting::GROUP_ORDER_STATUSES] = $settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
        $output[Setting::GROUP_DELIVERY] = $settingsService->getSettingsGroup(Setting::GROUP_DELIVERY);
        $output[Setting::GROUP_PAYMENT] = $settingsService->getSettingsGroup(Setting::GROUP_PAYMENT);
        $output[Setting::GROUP_CURRENCY] = $settingsService->getSettingsGroup(Setting::GROUP_CURRENCY);
        $output[Setting::GROUP_PROMOCODES] = $settingsService->getSettingsGroup(Setting::GROUP_PROMOCODES);
        $output[Setting::GROUP_LANGUAGES] = $settingsService->getSettingsGroup(Setting::GROUP_LANGUAGES);

        return $this->json($output, 200, [], ['groups' => ['list']]);
    }

    /**
     * @Route("/{groupName}", methods={"PUT"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param $groupName
     * @param SettingsService $settingsService
     * @param TranslatorInterface $translator
     * @param TwigEnvironment $twig
     * @return JsonResponse
     * @throws \Exception
     */
    public function updateGroupAction(
        Request $request,
        $groupName,
        SettingsService $settingsService,
        TranslatorInterface $translator,
        TwigEnvironment $twig
    )
    {
        $data = json_decode($request->getContent(), true);

        switch ($groupName) {
            case Setting::GROUP_MAIN:

                $settings = $settingsService->getSettingsFromYaml('settings', false);
                $data = SettingsService::transformParametersInverse($data);
                $templatesDirPath = $this->getTemplatesDirPath();

                if (isset($data['app.template_theme'])
                    && !is_dir($templatesDirPath . DIRECTORY_SEPARATOR . $data['app.template_theme'])) {
                        return $this->setError($translator->trans('Templates theme "%theme%" not found.', [
                            '%theme%' => $data['app.template_theme']
                        ]));
                }

                $settings = array_merge($settings, $data);

                if (!$settingsService->saveSettingsToYaml($settings, 'settings')) {
                    return $this->setError($translator->trans('File is not writable.', [], 'validators'));
                }

                $settingsService->systemCacheClear();

                break;
            default:

                $settings = $this->getRepository()->findBy([
                    'groupName' => $groupName
                ], ['id' => 'asc']);

                // Update
                /** @var Setting $setting */
                foreach ($settings as $index => $setting) {
                    if (!isset($data[$index])) {
                        $this->dm->remove($setting);
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
                        $this->dm->persist($setting);
                        $settings[] = $setting;
                    }
                }

                $this->dm->flush();

                // Update setting "app.locale_list"
                if ($groupName == Setting::GROUP_LANGUAGES && count($settings) > 1) {
                    $localeList = array_map(function($setting) {
                        /** @var Setting $setting */
                        return $setting->getOption('value');
                    }, $settings);
                    $localeListString = !empty($localeList) ? implode(',', array_unique($localeList)) : '';
                    $settingsData = $settingsService->getSettingsFromYaml('settings', false);
                    $settingsData = array_merge($settingsData, [
                        'app.locale_list' => $localeListString
                    ]);
                    if (!$settingsService->saveSettingsToYaml($settingsData, 'settings')) {
                        return $this->setError($translator->trans('File is not writable.', [], 'validators'));
                    }
                    if ($settingsService->fileCacheClear()) {
                        $settingsService->systemCacheClear();
                    }
                }

                break;
        }

        return $this->json($settings, 200, [], ['groups' => ['list']]);
    }

    /**
     * @Route("/clear_cache", name="clear_cache", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param SettingsService $settingsService
     * @return JsonResponse
     */
    public function clearCacheAction(SettingsService $settingsService)
    {
        return $this->json([
            'success' => $settingsService->fileCacheClear()
        ]);
    }

    /**
     * @Route("/clear_system_cache", name="clear_system_cache", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param SettingsService $settingsService
     * @return JsonResponse
     * @throws \Exception
     */
    public function systemCacheClearAction(SettingsService $settingsService)
    {
        $result = $settingsService->systemCacheClear();

        return $this->json([
            'success' => $result
        ]);
    }

    /**
     * @Route("/update_filters", name="update_filters", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param CatalogService $catalogService
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateFiltersAction(CatalogService $catalogService)
    {
        /** @var \App\Repository\CategoryRepository $categoryRepository */
        $categoryRepository = $this->dm->getRepository(Category::class);

        $count = 0;
        $categories = $categoryRepository->findAll();
        foreach ($categories as $category) {
            $catalogService->updateFiltersData($category);
            $count++;
        }

        return $this->json([
            'success' => true,
            'count' => $count
        ]);
    }

    /**
     * @Route("/update_internationalization", name="update_internationalization", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param TranslatorInterface $translator
     * @return JsonResponse
     */
    public function updateInternationalizationAction(TranslatorInterface $translator)
    {
        try {
            $this->updateInternationalization();
        } catch (\Exception $e) {
            return $this->setError($translator->trans($e->getMessage(), [], 'validators'));
        }
        return $this->json([
            'success' => true
        ]);
    }

    /**
     * Update Internationalization files
     * @return bool
     * @throws \Exception
     */
    public function updateInternationalization()
    {
        $rootPath = $this->params->get('kernel.project_dir');
        $jsonDirPath = $rootPath . '/frontend/src/i18n';
        $publicDirPath = realpath($this->params->get('app.web_dir_path'));
        $jsPublicDirPath = $publicDirPath . '/admin/i18n';
        $vendorDirPath = $rootPath . '/vendor';

        $sourceFiles = array_diff(scandir($jsonDirPath), ['..', '.']);
        $sourceFiles = array_map(function($value) use ($jsonDirPath) {
            return $jsonDirPath . DIRECTORY_SEPARATOR . $value;
        }, $sourceFiles);

        if (is_dir($vendorDirPath)) {
            $pluginsDirs = $this->getVendorFrontendLangPathArr($vendorDirPath);
            foreach ($pluginsDirs as $dirPath) {
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
        foreach ($lang as $k => $value) {
            $targetFilePath = $jsPublicDirPath . "/{$k}.js";
            if (file_exists($targetFilePath) && !is_writable($targetFilePath)) {
                throw new \Exception('File is not writable.');
            }
            $content  = 'var APP_LANG = ';
            $content .= json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            $content .= ';';
            file_put_contents($targetFilePath, $content);
        }

        return true;
    }

    /**
     * @param string $parentDirPath
     * @param array $outputPathArr
     * @return array
     */
    public function getVendorFrontendLangPathArr($parentDirPath, $outputPathArr = [])
    {
        $innerDirs = array_diff(scandir($parentDirPath), ['..', '.']);
        foreach ($innerDirs as $innerDir) {
            if ($innerDir == 'frontend') {
                $dirPath = $parentDirPath . DIRECTORY_SEPARATOR . $innerDir . DIRECTORY_SEPARATOR . 'i18n';
                if (is_dir($dirPath)) {
                    $outputPathArr[] = $dirPath;
                }
            } else if (is_dir($parentDirPath . DIRECTORY_SEPARATOR . $innerDir)
                && mb_substr($innerDir, 0, 1) !== '.') {
                    $outputPathArr = $this->getVendorFrontendLangPathArr(
                        $parentDirPath . DIRECTORY_SEPARATOR . $innerDir,
                        $outputPathArr
                    );
            }
        }
        return $outputPathArr;
    }

    /**
     * @Route("_script", name="admin_settings_script")
     * @param UtilsService $utilsService
     * @param SettingsService $settingsService
     * @param TranslatorInterface $translator
     * @param ValidatorInterface $validator
     * @param UserPasswordEncoderInterface $encoder
     * @return Response
     */
    public function settingsScriptAction(
        UtilsService $utilsService,
        SettingsService $settingsService,
        TranslatorInterface $translator,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $encoder
    )
    {
        $settings = $settingsService->getArray();
        /** @var User $user */
        $user = $this->getUser();

        $userController = new UserController($this->params, $this->dm, $translator, $validator, $encoder);
        $rolesHierarchy = $userController->getRolesHierarchy();

        $localeList = $this->params->get('app.locale_list');
        $localeList = $localeList ? explode(',', $localeList) : [];
        $localeList = array_map('trim', $localeList);

        $settings = [
            'filesDirUrl' => $this->params->get('app.files_dir_url'),
            'baseDir' => $this->params->get('kernel.project_dir') . DIRECTORY_SEPARATOR,
            'locale' => $this->params->get('locale'),
            'templateTheme' => $this->params->get('app.template_theme'),
            'isFileManagerEnabled' => $this->params->get('app.file_manager_enabled'),
            'localeList' => $localeList,
            'userEmail' => $user->getEmail(),
            'userRoles' => $user->getRoles(),
            'systemSettings' => $settings,
            'rolesHierarchy' => $rolesHierarchy
        ];

        $adminMenu = $utilsService->parseYaml('admin_menu');
        $content = $this->renderView('admin/settings.js.twig', [
            'settings' => $settings,
            'adminMenu' => json_encode($adminMenu['menu'])
        ]);

        $response = new Response($content);
        $response->headers->set('Content-Type', 'application/javascript');
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Cache-Control', 'post-check=0, pre-check=0', false);
        $response->headers->set('Pragma', 'no-cache');

        return $response;
    }

    /**
     * @Route("_composer_installed_packages", name="admin_composer_installed_packages", methods={"GET"})
     * @param ComposerService $composerService
     * @return JsonResponse
     */
    public function composerInstalledListAction(ComposerService $composerService)
    {
        $packages = $composerService->getPackagesList();
        return $this->json($packages);
    }

    /**
     * @Route("_composer_require_package", name="admin_composer_require_package", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param ComposerService $composerService
     * @param TranslatorInterface $translator
     * @return JsonResponse
     * @throws \Exception
     */
    public function composerRequirePackage(Request $request, ComposerService $composerService, TranslatorInterface $translator)
    {
        $data = json_decode($request->getContent(), true);
        $packageName = $data['packageName'];
        $packageVersion = $data['packageVersion'];

        $result = $composerService->requirePackage($packageName, $packageVersion);
        if (!$result['success']) {
            return $this->setError($translator->trans($result['msg'], [], 'validators'));
        }
        return $this->json($result);
    }

    /**
     * @return string
     * @throws \Twig\Error\LoaderError
     */
    public function getTemplatesDirPath()
    {
        return dirname(dirname($this->twig->getLoader()->getSourceContext('base.html.twig')->getPath()));;
    }

    /**
     * @param $message
     * @param int $status
     * @return JsonResponse
     */
    public function setError($message, $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        $response = new JsonResponse(["error" => $message]);
        $response = $response->setStatusCode($status);
        return $response;
    }

    /**
     * @return \App\Repository\FieldTypeRepository|ObjectRepository
     */
    public function getRepository()
    {
        return $this->dm->getRepository(Setting::class);
    }
}
