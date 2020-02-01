<?php

namespace App\Controller\Admin;

use App\Service\SettingsService;
use App\Service\UtilsService;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Twig\Environment as TwigEnvironment;

/**
 * Class TemplatesController
 * @package App\Controller
 * @Route("/admin/templates")
 */
class TemplatesController extends StorageControllerAbstract
{
    /** @var TwigEnvironment */
    protected $twig;

    /**
     * TemplatesController constructor.
     * @param $twig
     */
    public function __construct(TwigEnvironment $twig)
    {
        $this->twig = $twig;
    }

    /**
     * @param array $data
     * @param null $itemId
     * @return array
     */
    protected function validateData($data, $itemId = null)
    {
        if (empty($data['name'])) {
            return ['success' => false, 'msg' => 'Name can not be empty.'];
        }
        return ['success' => true];
    }

    /**
     * @Route("", methods={"GET"})
     * @param Request $request
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function getList(Request $request, SerializerInterface $serializer)
    {
        $items = [];
        $queryString = $request->getQueryString();
        $options = $this->getQueryOptions($queryString);
        $templatesDirPath = $this->getTemplatesDirPath();

        $category = $request->get('category');
        $themesDirs = $this->getThemesList();
        if ($category && in_array($category, $themesDirs)) {
            $themesDirs = [$category];
        }

        foreach ($themesDirs as $themeDirName) {
            $dirPath = $templatesDirPath . DIRECTORY_SEPARATOR . $themeDirName;
            $filesArr = $this->getFiles($dirPath, 'twig');
            $filesArr = array_map(function($fileData, $index) use ($themeDirName, $templatesDirPath) {
                $fileData['id'] = $index + 1;
                $fileData['themeName'] = $themeDirName;
                $fileData['path'] = str_replace(
                    $templatesDirPath . DIRECTORY_SEPARATOR,
                    '',
                    $fileData['path']
                );
                return $fileData;
            }, $filesArr, array_keys($filesArr));

            // Sorting
            if (isset($options['sort_by'])) {
                if ($options['sort_by'] == 'themeName') {
                    $sortBy = 'name';
                    $sortDir = 'asc';
                } else {
                    $sortBy = in_array($options['sort_by'], ['name', 'path'])
                        ? $options['sort_by']
                        : 'name';
                    $sortDir = isset($options['sort_dir']) ? $options['sort_dir'] : 'asc';
                }
                usort($filesArr, function($a, $b) use ($sortBy, $sortDir) {
                    if ($sortDir == 'asc') {
                        return $a[$sortBy] <=> $b[$sortBy];
                    } else {
                        return $b[$sortBy] <=> $a[$sortBy];
                    }
                });
            }

            $items = array_merge($items, $filesArr);
        }

        $total = count($items);

        // Limit
        if (isset($options['limit'])) {
            $skip = ($options['page'] - 1) * $options['limit'];
            $items = array_slice($items, $skip, intval($options['limit']));
        }

        return $this->json([
            'items' => $items,
            'total' => $total
        ]);
    }

    /**
     * @Route("/themes", name="templates_get_themes", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     * @throws \Twig\Error\LoaderError
     */
    public function getThemesListAction(Request $request)
    {
        $themesDirs = $this->getThemesList();

        $themesDirs = array_map(function($name) {
            return ['name' => $name];
        }, $themesDirs);

        return $this->json($themesDirs);
    }

    /**
     * @Route("/get_editable_files", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getFilesListAction(Request $request)
    {
        $items = [];
        $editable = [];
        $editable['css'] = $this->getParameter('app.editable_css');
        $editable['js'] = $this->getParameter('app.editable_js');
        $editable['config'] = $this->getParameter('app.editable_config');

        $fileTypes = ['css', 'js', 'config'];
        foreach ($fileTypes as $fileType) {
            if (is_null($editable[$fileType])) {
                continue;
            }
            foreach($editable[$fileType] as $filePath) {
                $fileFullPath = $this->getFilePathByType($fileType, $filePath);
                if (!file_exists($fileFullPath)) {
                    continue;
                }
                $items[] = [
                    'name' => basename($fileFullPath),
                    'type' => $fileType,
                    'extension' => UtilsService::getExtension($fileFullPath),
                    'size' => UtilsService::sizeFormat(filesize($fileFullPath)),
                    'path' => dirname(str_replace($this->getFilePathByType($fileType, ''), '', $fileFullPath))
                ];
            }
        }

        $total = count($items);

        return $this->json([
            'items' => $items,
            'total' => $total
        ]);
    }

    /**
     * @param string $dirPath
     * @param string $ext
     * @param array $filesArr
     * @return array
     */
    public function getFiles($dirPath, $ext = '', $filesArr = [])
    {
        $files = array_diff(scandir($dirPath), ['..', '.']);
        foreach ($files as $fileName) {
            $path = $dirPath . DIRECTORY_SEPARATOR . $fileName;
            if (is_dir($path)) {
                $filesArr = $this->getFiles($path, $ext, $filesArr);
            } else if (!$ext || UtilsService::getExtension($fileName) == $ext) {
                $filesArr[] = [
                    'name' => $fileName,
                    'path' => $dirPath
                ];
            }
        }
        return $filesArr;
    }

    /**
     * @Route("/content", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getFileContentAction(Request $request)
    {
        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');

        $filePath = $request->get('path', '');
        $fileType = $request->get('type', 'twig');

        $filePath = $this->getFilePathByType($fileType, $filePath);

        if (!$filePath || !file_exists($filePath)) {
            return $this->setError($translator->trans('The specified file path does not exist.', [], 'validators'));
        }
        if (!is_readable($filePath)) {
            return $this->setError($translator->trans('The file is not readable.', [], 'validators'));
        }

        return $this->json([
            'content' => file_get_contents($filePath)
        ]);
    }

    /**
     * @param array $data
     * @param null|int|string $itemId
     * @return JsonResponse
     * @throws \Exception
     */
    protected function createUpdate($data, $itemId = null)
    {
        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');

        $fileContent = $data['content'] ?? '';
        $fileName = str_replace('..', '', ($data['name'] ?? ''));
        $filePath = trim(str_replace('..', '', ($data['path'] ?? '')), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;
        $fileType = $data['type'] ?? 'template';

        $filePath = $this->getFilePathByType($fileType, $filePath);

        if (!in_array(UtilsService::getExtension($data['name']), ['twig', 'css', 'js', 'yml', 'yaml'])) {
            return $this->setError($translator->trans('Allowed file types: %extensions%.', [
                '%extensions%' => 'twig, css, js'
            ], 'validators'));
        }
        if (!is_dir(dirname($filePath))) {
            return $this->setError($translator->trans('The specified file path does not exist.', [], 'validators'));
        }
        if (file_exists($filePath) && !is_writable($filePath)) {
            return $this->setError($translator->trans('File is not writable.', [], 'validators'));
        }

        if ($fileType === 'config') {
            try {
                Yaml::parse($fileContent);
            } catch (ParseException $e) {
                return $this->setError($translator->trans('Content not compliant with YAML format.', [], 'validators') . ' ' . $e->getMessage());
            }
            if (!file_exists($filePath)) {
                return $this->setError($translator->trans('File not found.', [], 'validators'));
            }
        }

        file_put_contents($filePath, $fileContent);

        if (!empty($data['clearCache'])) {
            /** @var SettingsService $settingsService */
            $settingsService = $this->get('app.settings');
            $settingsService->systemCacheClear();
        }

        return $this->json([
            'success' => true
        ]);
    }

    /**
     * @param $fileType
     * @param $filePath
     * @return string
     */
    public function getFilePathByType($fileType, $filePath)
    {
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
        $publicDirPath = realpath($this->getParameter('app.web_dir_path'));
        $configDirPath = $rootPath . DIRECTORY_SEPARATOR . 'config';
        $templatesDirPath = $this->getTemplatesDirPath();
        $filePath = trim($filePath, DIRECTORY_SEPARATOR);
        $filePath = str_replace(['..', './'], '', $filePath);

        switch ($fileType) {
            case 'css':
            case 'js':
                $filePath = implode(DIRECTORY_SEPARATOR, [$publicDirPath, $fileType, $filePath]);
                break;
            case 'config':
                $filePath = implode(DIRECTORY_SEPARATOR, [$configDirPath, $filePath]);
                break;
            default:
                $filePath = $templatesDirPath . DIRECTORY_SEPARATOR . $filePath;
        }
        return $filePath;
    }

    /**
     * @Route("", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return JsonResponse
     */
    public function deleteFileAction(Request $request, TranslatorInterface $translator)
    {
        $filePath = $request->get('path');

        $results = $this->deleteFile($filePath);
        if (!$results['success']) {
            return $this->setError($translator->trans($results['msg'], [], 'validators'));
        }

        return $this->json([
            'success' => true
        ]);
    }

    /**
     * @Route("/delete/batch", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return JsonResponse
     */
    public function deleteBatchAction(Request $request, TranslatorInterface $translator)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        if(empty($data['pathArr'])){
            return $this->setError($translator->trans('Bad data.', [], 'validators'));
        }

        $error = '';
        foreach ($data['pathArr'] as $path) {
            $results = $this->deleteFile($path);
            if (!$results['success']) {
                $error = $results['msg'];
                break;
            }
        }

        if ($error) {
            return $this->setError($translator->trans($error, [], 'validators'));
        } else {
            return $this->json([
                'success' => true
            ]);
        }
    }

    /**
     * @param string $filePath
     * @return array
     */
    public function deleteFile($filePath)
    {
        $templatesDirPath = $this->getTemplatesDirPath();
        $filePath = $templatesDirPath . DIRECTORY_SEPARATOR . $filePath;

        if (!file_exists($filePath)) {
            return [
                'success' => false,
                'msg' => 'File not found.'
            ];
        }
        if (file_exists($filePath) && !is_writable($filePath)) {
            return [
                'success' => false,
                'msg' => 'File is not writable.'
            ];
        }

        unlink($filePath);

        return [
            'success' => true
        ];
    }

    /**
     * @return array
     * @throws \Twig\Error\LoaderError
     */
    public function getThemesList()
    {
        $templatesDirPath = $this->getTemplatesDirPath();

        $themesDirs = array_diff(scandir($templatesDirPath), ['..', '.']);
        $themesDirs = array_filter($themesDirs, function($value) use ($templatesDirPath) {
            return is_dir($templatesDirPath . DIRECTORY_SEPARATOR . $value)
                && substr($value, 0, 1) !== '.';
        });
        $themesDirs = array_merge($themesDirs);

        return $themesDirs;
    }

    /**
     * @return string
     * @throws \Twig\Error\LoaderError
     */
    public function getTemplatesDirPath()
    {
        return dirname(dirname($this->twig->getLoader()->getSourceContext('base.html.twig')->getPath()));;
    }

    protected function getRepository()
    {
        return null;
    }
}
