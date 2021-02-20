<?php

namespace App\Controller\Admin;

use App\Service\UtilsService;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

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
        if (!$this->params->get('app.file_manager_enabled')) {
            return $this->setError($this->translator->trans('File manager is disabled.'));
        }
        $files = [];
        $filesBlacklist = $this->params->get('app.files_ext_blacklist');
        $path = $request->get('path', '');

        $publicDirPath = $this->getFolderPath($path);
        if ($publicDirPath === false) {
            return $this->json($files);
        }

        foreach (new \DirectoryIterator($publicDirPath) as $fileInfo) {
            try {
                if($fileInfo->isDot()
                    || substr($fileInfo->getFilename(), 0, 1) === '.'
                    || in_array($fileInfo->getExtension(), $filesBlacklist)) {
                        continue;
                }
            } catch (\Exception $e) {
                continue;
            }
            $files[] = [
                'id' => 0,
                'title' => !$fileInfo->isDir()
                    ? $fileInfo->getBasename('.' . $fileInfo->getExtension())
                    : $fileInfo->getFilename(),
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
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function createFolderAction(Request $request)
    {
        if (!$this->params->get('app.file_manager_enabled')) {
            return $this->setError($this->translator->trans('File manager is disabled.'));
        }
        $content = json_decode($request->getContent(), true);
        if (empty($content['folderName'])) {
            return $this->json(['success' => false]);
        }

        $content['folderName'] = strip_tags($content['folderName']);
        $path = !empty($content['path']) ? $content['path'] : '';

        if ($publicDirPath = $this->getFolderPath($path)) {
            mkdir($publicDirPath . DIRECTORY_SEPARATOR . $content['folderName']);
            return $this->json(['success' => true]);
        }

        return $this->json(['success' => false]);
    }

    /**
     * @Route("/folder_delete", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param Filesystem $fs
     * @return JsonResponse
     */
    public function deleteFolderAction(Request $request, Filesystem $fs)
    {
        if (!$this->params->get('app.file_manager_enabled')) {
            return $this->setError($this->translator->trans('File manager is disabled.'));
        }
        $content = json_decode($request->getContent(), true);
        if (empty($content['path'])) {
            return $this->json(['success' => false]);
        }
        if (in_array($content['path'], ['uploads','admin'])) {
            return $this->setError($this->translator->trans('You cannot delete or rename the system folder.'));
        }
        if ($publicDirPath = $this->getFolderPath($content['path'])) {

            $fs->remove($publicDirPath);

            return $this->json(['success' => true]);
        }
        return $this->json(['success' => false]);
    }

    /**
     * @Route("/file_delete", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteFileAction(Request $request)
    {
        if (!$this->params->get('app.file_manager_enabled')) {
            return $this->setError($this->translator->trans('File manager is disabled.'));
        }
        $content = json_decode($request->getContent(), true);
        if (!isset($content['path']) || empty($content['name'])) {
            return $this->json(['success' => false]);
        }
        if ($publicDirPath = $this->getFolderPath($content['path'])) {

            $content['name'] = str_replace(['/', '\\'], '', $content['name']);
            $filePath = $publicDirPath . DIRECTORY_SEPARATOR . $content['name'];
            if (!file_exists($filePath)) {
                return $this->setError($this->translator->trans('File not found.', [], 'validators'));
            }
            if (!is_writable($filePath)) {
                return $this->setError($this->translator->trans('File is not writable.', [], 'validators'));
            }

            unlink($filePath);

            return $this->json(['success' => true]);
        }
        return $this->json(['success' => false]);
    }

    /**
     * @Route("/folder", methods={"PUT"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function renameFolderAction(Request $request)
    {
        if (!$this->params->get('app.file_manager_enabled')) {
            return $this->setError($this->translator->trans('File manager is disabled.'));
        }
        $content = json_decode($request->getContent(), true);
        if (empty($content['path']) || empty($content['name'])) {
            return $this->json(['success' => false]);
        }
        if (in_array($content['path'], ['uploads','admin'])) {
            return $this->setError($this->translator->trans('You cannot delete or rename the system folder.'));
        }
        if ($publicDirPath = $this->getFolderPath($content['path'])) {

            $content['name'] = str_replace(['/', '\\', '.'], '', $content['name']);
            $newFolderPath = dirname($publicDirPath) . DIRECTORY_SEPARATOR . $content['name'];
            if (is_dir($newFolderPath)) {
                return $this->setError($this->translator->trans('A folder with the same name already exists.'));
            }

            rename($publicDirPath, dirname($publicDirPath) . DIRECTORY_SEPARATOR . $content['name']);

            return $this->json(['success' => true]);
        }
        return $this->json(['success' => false]);
    }

    /**
     * @Route("/file", methods={"PUT"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function renameFileAction(Request $request)
    {
        if (!$this->params->get('app.file_manager_enabled')) {
            return $this->setError($this->translator->trans('File manager is disabled.'));
        }
        $content = json_decode($request->getContent(), true);
        if (!isset($content['path']) || empty($content['name'])) {
            return $this->json(['success' => false]);
        }
        $dirName = dirname($content['path']);
        $publicDirPath = $this->getFolderPath($dirName);
        if ($publicDirPath === false) {
            return $this->json(['success' => false]);
        }

        $filePath = $publicDirPath . DIRECTORY_SEPARATOR . basename($content['path']);
        if (!file_exists($filePath)) {
            return $this->setError($this->translator->trans('File not found.', [], 'validators'));
        }
        if (!is_writable($filePath)) {
            return $this->setError($this->translator->trans('File is not writable.', [], 'validators'));
        }

        $content['name'] = str_replace(['/', '\\'], '', $content['name']);
        $newFileName = $content['name'] . '.' . UtilsService::getExtension($filePath);
        if (file_exists($publicDirPath . DIRECTORY_SEPARATOR . $newFileName)) {
            return $this->setError($this->translator->trans('A file with the same name already exists.', [], 'validators'));
        }

        rename($filePath, $publicDirPath . DIRECTORY_SEPARATOR . $newFileName);

        return $this->json(['success' => true]);
    }

    /**
     * @Route("/upload", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadFilesAction(Request $request)
    {
        if (!$this->params->get('app.file_manager_enabled')) {
            return $this->setError($this->translator->trans('File manager is disabled.'));
        }
        $path = $request->get('path') ?: '';
        $publicDirPath = $this->getFolderPath($path);
        if ($publicDirPath === false) {
            return $this->json(['success' => false]);
        }

        $filesBlacklist = $this->params->get('app.files_ext_blacklist');

        $files = $request->files;
        /** @var UploadedFile $file */
        foreach ($files as $file) {
            $ext = strtolower($file->getClientOriginalExtension());
            if (in_array($ext, $filesBlacklist)) {
                continue;
            }
            $file->move($publicDirPath, $file->getClientOriginalName());
        }

        return $this->json(['success' => true]);
    }

    /**
     * @param $folderName
     * @return bool|string
     */
    public function getFolderPath($folderName)
    {
        $publicDirPath = realpath($this->params->get('app.web_dir_path'));
        if ($folderName) {
            $publicDirPath .= DIRECTORY_SEPARATOR . str_replace('..', '', $folderName);
        }
        if (!is_dir($publicDirPath)) {
            return false;
        }
        return $publicDirPath;
    }

    /**
     * @return string
     */
    public function getRootPath()
    {
        return $this->params->get('kernel.project_dir');
    }

}
