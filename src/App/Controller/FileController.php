<?php

namespace App\Controller;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\User;
use App\Repository\CategoryRepository;
use App\Repository\FileDocumentRepository;
use App\Service\CatalogService;
use App\Service\SettingsService;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Controller\Admin\ProductController as AdminProductController;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class FileController
 * @package App\Controller
 * @Route("/files")
 */
class FileController extends BaseController
{

    /**
     * @Route("/user_upload", methods={"POST"}, name="files_user_upload")
     * @param Request $request
     * @param Filesystem $fs
     * @param ShopCartService $shopCartService
     * @param CatalogService $catalogService
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function uploadUserFile(Request $request, Filesystem $fs, ShopCartService $shopCartService, CatalogService $catalogService)
    {
        $type = $request->get('type', 'shop');
        /** @var User $user */
        $user = $this->getUser();
        $shoppingCart = $shopCartService->getShoppingCart($type, $shopCartService->getUserId(), $shopCartService->getSessionId($type), null, true);

        $userId = $user ? $user->getId() : 0;
        $ownerId = $shoppingCart ? $shoppingCart->getId() : 0;
        $max_user_files_size = (int) $this->params->get('app.max_user_files_size');

        $categoryId = (int) $request->get('categoryId');
        if (!$categoryId) {
            return new JsonResponse([]);
        }

        /** @var Category $category */
        $category = $this->getCategoryRepository()->find($categoryId);
        if (!$category) {
            return new JsonResponse([]);
        }

        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $contentTypeFields = $contentType->getFields();

        // Upload directory
        $filesDirPath = $this->params->get('app.files_dir_path');
        if (!is_dir($filesDirPath)) {
            $fs->mkdir($filesDirPath, 0777);
        }

        $files = $request->files;
        $error = '';
        $filesIds = [];

        /** @var UploadedFile $file */
        foreach ($files as $key => $file) {

            $fieldName = $key;
            $fileSize = $file->getSize();
            if ($fileSize > $max_user_files_size * 1024 * 1024) {
                $error = $this->translator->trans('You can not upload a file larger than %size% MB.', ['%size%' => $max_user_files_size]);
                break;
            }

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
                if (!$catalogService->fileUploadAllowed($file->getClientOriginalName(), $currentField, $outputProperties['allowed_extensions'])) {
                    $error = $this->translator->trans('The file type is not allowed to be uploaded.');
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
                ->setOwnerId($ownerId)
                ->setUserId($userId)
                ->setFile($file);

            $this->dm->persist($fileDocument);
            $this->dm->flush();

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
     * @Route("/download/{ownerType}/{fieldName}/{ownerDocId}/{fileName}", methods={"GET"}, name="file_download")
     * @param CatalogService $catalogService
     * @param string $ownerType
     * @param string $fieldName
     * @param string $ownerDocId
     * @param string $fileName
     * @return Response
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function downloadFile(CatalogService $catalogService, $ownerType, $fieldName, $ownerDocId, $fileName)
    {
        $collection = $catalogService->getCollection($ownerType);
        $document = $collection->findOne(['_id' => (int) $ownerDocId]);

        if (!$document || !isset($document[$fieldName])) {
            throw $this->createNotFoundException();
        }

        $fileData = $document[$fieldName];

        $fileDocument = $this->getRepository()->findOneBy([
            'id' => $fileData['fileId'],
            'ownerType' => $ownerType,
            'ownerDocId' => (int) $ownerDocId,
            'fileName' => $fileName
        ]);

        if (!$document || !$fileDocument) {
            throw $this->createNotFoundException();
        }
        
        $filesDirPath = $this->params->get('app.files_dir_path');
        $fileDocument->setUploadRootDir($filesDirPath);

        $filePath = $fileDocument->getUploadedPath();
        if (!file_exists($filePath)) {
            throw $this->createNotFoundException();
        }

        $fileDocument->incrementDownloads();
        $this->dm->flush();

        $fileData['downloads'] = $fileDocument->getDownloads();
        $collection->updateOne(
            ['_id' => (int) $ownerDocId],
            ['$set' => [$fieldName => $fileData]]
        );

        return UtilsService::downloadFile($filePath, $fileDocument->getOriginalFileName());
    }

    /**
     * @return CategoryRepository|ObjectRepository
     */
    public function getCategoryRepository()
    {
        return $categoryRepository = $this->dm->getRepository(Category::class);
    }

    /**
     * @return FileDocumentRepository|ObjectRepository
     */
    public function getRepository()
    {
        return $categoryRepository = $this->dm->getRepository(FileDocument::class);
    }
}
