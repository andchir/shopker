<?php

namespace App\Controller\Admin;

use App\Service\UtilsService;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class TemplatesController
 * @package App\Controller
 * @Route("/admin/templates")
 */
class TemplatesController extends StorageControllerAbstract
{

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

        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
        $templatesDirPath = $rootPath . DIRECTORY_SEPARATOR . 'templates';

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
            $filesArr = array_map(function($fileData) use ($themeDirName, $templatesDirPath) {
                $fileData['themeName'] = $themeDirName;
                $fileData['path'] = str_replace(
                    $templatesDirPath . DIRECTORY_SEPARATOR,
                    '',
                    $fileData['path']
                );
                return $fileData;
            }, $filesArr);

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

    protected function getRepository()
    {
        return null;
    }

    protected function createUpdate($data)
    {
        // TODO: Implement createUpdate() method.
    }

    protected function validateData($data, $itemId = null)
    {
        return true;
    }
}
