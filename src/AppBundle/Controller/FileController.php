<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Document\ContentType;
use AppBundle\Document\FileDocument;
use AppBundle\Document\User;
use AppBundle\Repository\CategoryRepository;
use AppBundle\Service\UtilsService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Controller\Admin\ProductController as AdminProductController;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class FileController
 * @package AppBundle\Controller
 * @Route("/files")
 */
class FileController extends BaseController
{

    /**
     * @Route("/user_upload", methods={"POST"}, name="files_user_upload")
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param Filesystem $fs
     * @return JsonResponse
     */
    public function uploadUserFile(Request $request, TranslatorInterface $translator, Filesystem $fs)
    {
        /** @var User $user */
        $user = $this->getUser();
        $userId = $user ? $user->getId() : 0;
        $sessionId = !$user ? $request->getSession()->getId() : null;
        $categoryId = (int) $request->get('categoryId');
        if (!$categoryId) {
            return new JsonResponse([]);
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        /** @var Category $category */
        $category = $this->getCategoryRepository()->find($categoryId);
        if (!$category) {
            return new JsonResponse([]);
        }

        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $contentTypeFields = $contentType->getFields();

        $productController = new AdminProductController();
        $productController->setContainer($this->container);

        // Upload directory
        $filesDirPath = $this->getParameter('files_dir_path');
        if (!is_dir($filesDirPath)) {
            $fs->mkdir($filesDirPath, 0777);
        }

        $files = $request->files;
        $error = '';
        $filesIds = [];

        foreach ($files as $key => $file) {

            $fieldName = $key;

            $currentField = array_filter($contentTypeFields, function($field) use ($fieldName) {
                return $field['name'] === $fieldName;
            });
            if (count($currentField) === 0) {
                continue;
            }
            $currentField = current($currentField);
            $outputProperties = isset($currentField['outputProperties'])
                ? $currentField['outputProperties']
                : [];

            if (!empty($outputProperties['allowed_extensions'])) {
                if (!$productController->fileUploadAllowed($file->getClientOriginalName(), $currentField, $outputProperties['allowed_extensions'])) {
                    $error = $translator->trans('The file type is not allowed to be uploaded.');
                }
            }
            if (!empty($error)) {
                break;
            }

            $fileDocument = new FileDocument();
            $fileDocument
                ->setUploadRootDir($filesDirPath)
                ->setCreatedDate(new \DateTime())
                ->setOwnerType(FileDocument::OWNER_ORDER_TEMPORARY)
                ->setOwnerId($sessionId)
                ->setUserId($userId)
                ->setFile($file);

            $dm->persist($fileDocument);
            $dm->flush();

            $filesIds[] = $fileDocument->getId();
        }

        if (!empty($error)) {
            return $this->setError($error);
        } else {
            return new JsonResponse([
                'filesIds' => $filesIds
            ]);
        }
    }

    /**
     * @return CategoryRepository
     */
    public function getCategoryRepository()
    {
        return $categoryRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
    }

}
