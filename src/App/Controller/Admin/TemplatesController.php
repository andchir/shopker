<?php

namespace App\Controller\Admin;

use App\Service\UtilsService;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class TemplatesController
 * @package App\Controller
 * @Route("/admin/templates")
 */
class TemplatesController extends StorageControllerAbstract
{

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
        if (empty($data['path'])) {
            return ['success' => false, 'msg' => 'Path can not be empty.'];
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

        $themesDirs = array_diff(scandir($templatesDirPath), ['..', '.']);
        $themesDirs = array_filter($themesDirs, function($value) use ($templatesDirPath) {
            return is_dir($templatesDirPath . DIRECTORY_SEPARATOR . $value);
        });
        $themesDirs = array_merge($themesDirs);

        if (isset($options['sort_by']) && $options['sort_by'] == 'themeName') {

        }

        foreach ($themesDirs as $themeDirName) {
            $dirPath = $templatesDirPath . DIRECTORY_SEPARATOR . $themeDirName;
            $filesArr = $this->getFiles($dirPath, 'twig');
            $filesArr = array_map(function($fileData, $index) use ($themeDirName, $templatesDirPath) {
                $fileData['id'] = $index;
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
     * @param string $dirPath
     * @param string $ext
     * @param array $filesArr
     * @return array
     */
    public function getFiles($dirPath, $ext, $filesArr = [])
    {
        $files = array_diff(scandir($dirPath), ['..', '.']);
        foreach ($files as $fileName) {
            $path = $dirPath . DIRECTORY_SEPARATOR . $fileName;
            if (is_dir($path)) {
                $filesArr = $this->getFiles($path, $ext, $filesArr);
            } else if (UtilsService::getExtension($fileName) == $ext) {
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
        $content = '';
        $templatesDirPath = $this->getTemplatesDirPath();
        $filePath = $request->get('path');

        $filePath = $templatesDirPath . DIRECTORY_SEPARATOR . $filePath;
        if (file_exists($filePath)) {
            $content = file_get_contents($filePath);
        }

        return $this->json([
            'content' => $content
        ]);
    }

    /**
     * @param array $data
     * @return JsonResponse
     */
    protected function createUpdate($data)
    {
        $templatesDirPath = $this->getTemplatesDirPath();
        $fileContent = $data['content'] ?? '';
        $fileName = $data['name'];
        $filePath = $templatesDirPath . DIRECTORY_SEPARATOR . trim($data['path'], DIRECTORY_SEPARATOR);
        $filePath .= DIRECTORY_SEPARATOR . $fileName;

        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');

        if (!in_array(UtilsService::getExtension($data['name']), ['twig', 'html', 'css', 'js'])) {
            return $this->setError($translator->trans('Allowed file types: %extensions%.', [
                '%extensions%' => 'twig, html, css, js'
            ], 'validators'));
        }
        if (!is_dir(dirname($filePath))) {
            return $this->setError($translator->trans('The specified file path does not exist.', [], 'validators'));
        }
        if (file_exists($filePath) && !is_writable($filePath)) {
            return $this->setError($translator->trans('File is not writable.', [], 'validators'));
        }

        file_put_contents($filePath, $fileContent);

        return $this->json([
            'success' => true
        ]);
    }

    public function getTemplatesDirPath()
    {
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
        return $rootPath . DIRECTORY_SEPARATOR . 'templates';
    }

    protected function getRepository()
    {
        return null;
    }
}
