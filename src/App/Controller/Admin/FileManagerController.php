<?php

namespace App\Controller\Admin;

use App\Service\UtilsService;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\TranslatorInterface;

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
                'extension' => strtolower($fileInfo->getExtension()),
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
     * @Route("/folder", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createFolderAction(Request $request)
    {
        $content = json_decode($request->getContent(), true);
        if (empty($content['folderName'])) {
            return $this->json(['success' => false]);
        }

        $content['folderName'] = strip_tags($content['folderName']);
        $publicDirPath = $this->getRootPath() . DIRECTORY_SEPARATOR . 'public';
        if ($content['path']) {
            $publicDirPath .= DIRECTORY_SEPARATOR . str_replace('..', '', $content['path']);
        }
        if (!is_dir($publicDirPath)) {
            return $this->json(['success' => false]);
        }

        mkdir($publicDirPath . DIRECTORY_SEPARATOR . $content['folderName']);

        return $this->json(['success' => true]);
    }

    /**
     * @Route("/folder_delete", methods={"POST"})
     * @param Request $request
     * @param Filesystem $fs
     * @return JsonResponse
     */
    public function deleteFolderAction(Request $request, Filesystem $fs)
    {
        $content = json_decode($request->getContent(), true);
        if (empty($content['path'])) {
            return $this->json(['success' => false]);
        }
        $publicDirPath = $this->getRootPath() . DIRECTORY_SEPARATOR . 'public';
        $publicDirPath .= DIRECTORY_SEPARATOR . str_replace('..', '', $content['path']);
        if (!is_dir($publicDirPath)) {
            return $this->json(['success' => false]);
        }

        $fs->remove($publicDirPath);

        return $this->json(['success' => true]);
    }

    /**
     * @Route("/folder", methods={"PUT"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @return JsonResponse
     */
    public function renameFolderAction(Request $request, TranslatorInterface $translator)
    {
        $content = json_decode($request->getContent(), true);
        if (empty($content['path']) || empty($content['name'])) {
            return $this->json(['success' => false]);
        }
        $publicDirPath = $this->getRootPath() . DIRECTORY_SEPARATOR . 'public';
        $publicDirPath .= DIRECTORY_SEPARATOR . str_replace('..', '', $content['path']);
        if (!is_dir($publicDirPath)) {
            return $this->json(['success' => false]);
        }

        $newFolderPath = dirname($publicDirPath) . DIRECTORY_SEPARATOR . $content['name'];
        if (is_dir($newFolderPath)) {
            return $this->setError($translator->trans('A folder with the same name already exists.'));
        }

        rename($publicDirPath, dirname($publicDirPath) . DIRECTORY_SEPARATOR . $content['name']);

        return $this->json(['success' => true]);
    }

    /**
     * @return string
     */
    public function getRootPath()
    {
        return realpath($this->getParameter('kernel.root_dir').'/../..');
    }

}
