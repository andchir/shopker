<?php

namespace App\Controller\Admin;

use App\Service\SettingsService;
use App\Service\UtilsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Yaml\Yaml;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class SystemUpdateController
 * @package App\Controller\Admin
 * @Route("/admin/system_update")
 */
class SystemUpdateController extends AbstractController
{
    /** @var ParameterBagInterface */
    protected $params;
    /** @var TranslatorInterface */
    protected $translator;
    
    public function __construct(ParameterBagInterface $params, TranslatorInterface $translator)
    {
        $this->params = $params;
        $this->translator = $translator;
    }
    
    /**
     * @Route("/upload", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadAction(Request $request)
    {
        $rootPath = $this->params->get('kernel.project_dir');
        $targetDirPath = $rootPath . '/var/updates';
        if (!is_dir($targetDirPath)) {
            mkdir($targetDirPath);
        }
    
        /** @var UploadedFile $file */
        $file = $request->files->get('file') ?? null;
        
        if (!$file) {
            return $this->setError($this->translator->trans('File not found.', [], 'validators'));
        }
        $ext = strtolower($file->getClientOriginalExtension());
        if ($ext !== 'zip') {
            return $this->setError($this->translator->trans('File type is not allowed.', [], 'validators'));
        }

        UtilsService::cleanDirectory($targetDirPath);
        $fileName = $file->getClientOriginalName();
        $file->move($targetDirPath, $fileName);

        if (!UtilsService::unZip($targetDirPath . DIRECTORY_SEPARATOR . $fileName, $targetDirPath)) {
            return $this->setError($this->translator->trans('Error unpacking archive.', [], 'validators'));
        }
    
        return $this->json([
            'fileName' => $fileName,
            'success' => true
        ]);
    }

    /**
     * @Route("/pre_update", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function checkAction(Request $request)
    {
        $rootPath = $this->params->get('kernel.project_dir');
        $targetDirPath = $rootPath . '/var/updates';
        if (!is_dir($targetDirPath)) {
            return $this->setError($this->translator->trans('File not found.', [], 'validators'));
        }

        $changeLogFilePath = $targetDirPath . DIRECTORY_SEPARATOR . 'changelog.txt';
        if (!file_exists($changeLogFilePath)) {
            return $this->setError($this->translator->trans('Changelog file not found.', [], 'validators'));
        }
        if (!file_exists($targetDirPath . '/config/parameters.yaml')) {
            return $this->setError($this->translator->trans('Configuration file not found.', [], 'validators'));
        }

        $changelogContent = file_get_contents($changeLogFilePath);
        $parameters = Yaml::parseFile($targetDirPath . '/config/parameters.yaml');
        $version = isset($parameters['parameters']) ? $parameters['parameters']['app.version'] ?? '' : '';
        
        $dirs = [
            'src', 'vendor', 'translations', 'templates', 'templates/default', 'config',
            'public', 'public/admin', 'public/app_build', 'public/bundles'
        ];
        foreach ($dirs as $dir) {
            if (!is_writable($rootPath . DIRECTORY_SEPARATOR . $dir)) {
                return $this->setError($this->translator->trans('The folder is not writable: %dir_name%.', ['%dir_name%' => $dir], 'validators'));
            }
        }
    
        return $this->json([
            'version' => $version,
            'changelogContent' => $changelogContent,
            'success' => true
        ]);
    }
    
    /**
     * @Route("/execute/{stepName}", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Filesystem $fs
     * @param SettingsService $settingsService
     * @param string $stepName
     * @return JsonResponse
     * @throws \Exception
     */
    public function executeAction(Filesystem $fs, SettingsService $settingsService, $stepName)
    {
        $rootPath = $this->params->get('kernel.project_dir');
        $sourceDirPath = $rootPath . '/var/updates';
        $pathToCopyArr = [];
        
        switch ($stepName) {
            case 'vendor':
            
                $pathToCopyArr[] = 'vendor';
                
                break;
            case 'src':
    
                $pathToCopyArr[] = 'src';
                $pathToCopyArr[] = 'frontend';
        
                break;
            case 'template':
            
                $themeName = $this->params->get('app.template_theme');
                
                // Copy default theme templates
                if ($themeName === 'default') {
                    $themes = array_diff(scandir($rootPath . DIRECTORY_SEPARATOR . 'templates'), ['..', '.']);
                    $number = 0;
                    foreach ($themes as $themeName) {
                        if (strpos($themeName, 'default_copy') !== false) {
                            $number++;
                        }
                    }
                    $copyThemeName = 'default_copy' . ($number > 0 ? $number + 1 : '');
                    $templateDirPath = $rootPath . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . 'default';
                    $newTemplateDirPath = $rootPath . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . $copyThemeName;
                    $fs->mkdir($newTemplateDirPath);
                    try {
                        $fs->mirror($templateDirPath, $newTemplateDirPath);
                    } catch (\Throwable $e) {
                        return $this->setError($e->getMessage());
                    }
                    $settingsData = $settingsService->getSettingsFromYaml('settings', false);
                    $settingsData = array_merge($settingsData, [
                        'app.template_theme' => $copyThemeName
                    ]);
                    if (!$settingsService->saveSettingsToYaml($settingsData, 'settings')) {
                        return $this->setError($this->translator->trans('File is not writable.', [], 'validators'));
                    }
                }
                
                $pathToCopyArr[] = 'templates/default';
                $pathToCopyArr[] = 'translations';
                $pathToCopyArr[] = 'public/admin';
                $pathToCopyArr[] = 'public/app_build';
                $pathToCopyArr[] = 'public/node_modules';
                $pathToCopyArr[] = 'public/css';
                $pathToCopyArr[] = 'public/img';
                $pathToCopyArr[] = 'public/js';
                $pathToCopyArr[] = 'config/bootstrap.php';
                $pathToCopyArr[] = 'public/index.php';
        
                break;
            case 'config':
    
                $pathToCopyArr[] = 'config/packages/dev';
                $pathToCopyArr[] = 'config/packages/prod';
                $pathToCopyArr[] = 'config/packages/test';
                $pathToCopyArr[] = 'config/packages/validator.yaml';
                $pathToCopyArr[] = 'config/packages/twig.yaml';
                $pathToCopyArr[] = 'config/packages/translation.yaml';
                $pathToCopyArr[] = 'config/packages/swiftmailer.yaml';
                $pathToCopyArr[] = 'config/packages/sensio_framework_extra.yaml';
                $pathToCopyArr[] = 'config/packages/security.yaml';
                $pathToCopyArr[] = 'config/packages/routing.yaml';
                $pathToCopyArr[] = 'config/packages/framework.yaml';
                $pathToCopyArr[] = 'config/packages/doctrine_mongodb.yaml';
                $pathToCopyArr[] = 'config/packages/doctrine_migrations.yaml';
                $pathToCopyArr[] = 'config/packages/doctrine.yaml';

                $pathToCopyArr[] = 'config/routes';
                $pathToCopyArr[] = 'config/bundles.php';
                $pathToCopyArr[] = 'config/parameters.yaml';
                $pathToCopyArr[] = 'config/routes.yaml';
                $pathToCopyArr[] = 'config/services.yaml';
                
                break;
        }
    
        if (!empty($pathToCopyArr)) {
            foreach ($pathToCopyArr as $path) {
                try {
                    if (is_dir($sourceDirPath . DIRECTORY_SEPARATOR . $path)) {
                        $fs->mirror(
                            $sourceDirPath . DIRECTORY_SEPARATOR . $path,
                            $rootPath . DIRECTORY_SEPARATOR . $path,
                            null,
                            ['override' => true]
                        );
                    } else {
                        $fs->copy($sourceDirPath . DIRECTORY_SEPARATOR . $path, $rootPath . DIRECTORY_SEPARATOR . $path, true);
                    }
                } catch (\Throwable $e) {
                    return $this->setError($e->getMessage());
                }
            }
        }
        
        if ($stepName === 'config') {
            UtilsService::cleanDirectory($sourceDirPath, true);
            if ($settingsService->fileCacheClear()) {
                $settingsService->systemCacheClear();
            }
        }
    
        return $this->json([
            'success' => true
        ]);
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
}
