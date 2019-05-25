<?php

namespace App\Controller\Admin;

use App\Service\UtilsService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class FileManagerController
 * @package App\Controller
 * @Route("/admin/file_manager")
 */
class FileManagerController extends BaseController
{

    /**
     * @Route("/", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function listAction(Request $request)
    {
        $publicDirPath = $this->getRootPath() . DIRECTORY_SEPARATOR . 'public';
        $files = [];
        $filesBlacklist = $this->getParameter('app.files_ext_blacklist');
        $path = $request->get('path');
        $path = str_replace('..', '', $path);
        if ($path) {
            $publicDirPath .= DIRECTORY_SEPARATOR . $path;
        }
        if (!is_dir($publicDirPath)) {
            return $this->json($files);
        }

        foreach (new \DirectoryIterator($publicDirPath) as $fileInfo) {
            if($fileInfo->isDot()
                || substr($fileInfo->getFilename(), 0, 1) === '.'
                || in_array($fileInfo->getExtension(), $filesBlacklist)) {
                    continue;
            }
            $files[] = [
                'id' => 0,
                'title' => $fileInfo->getFilename(),
                'fileName' => $fileInfo->getFilename(),
                'extension' => $fileInfo->getExtension(),
                'mimeType' => '',
                'ownerType' => '',
                'size' => $fileInfo->isFile()
                    ? UtilsService::sizeFormat(filesize($fileInfo->getPathname()))
                    : 0,
                'createdDate' => '',
                'modifiedDate' => date('F j, Y H:i:s', filemtime($fileInfo->getPathname())),
                'isDir' => $fileInfo->isDir(),
                'isEditable' => false
            ];
        }

        usort($files, function($a, $b) {
            return strnatcmp($a['fileName'], $b['fileName']);
        });
        usort($files, function($a) {
            return $a['isDir'] ? -1 : 1;
        });

        return $this->json($files);
    }

    /**
     * @return string
     */
    public function getRootPath()
    {
        return realpath($this->getParameter('kernel.root_dir').'/../..');
    }

}
