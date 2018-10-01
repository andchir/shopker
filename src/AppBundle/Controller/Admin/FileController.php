<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Document\Category;
use AppBundle\Document\ContentType;
use AppBundle\Document\FileDocument;
use AppBundle\Service\UtilsService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class FileControllerAbstract
 * @package AppBundle\Controller
 * @Route("/admin/files")
 */
class FileController extends BaseController
{

    /**
     * @Route("/upload")
     * @Method({"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadFilesAction(Request $request)
    {
        /** @var Filesystem $fs */
        $fs = $this->get('filesystem');
        $user = $this->getUser();

        $itemId = (int) $request->get('itemId');
        $ownerType = $request->get('ownerType');
        $categoryId = (int) $request->get('categoryId');
        $fieldsSort = explode(',', $request->get('fieldsSort', ''));
        $files = $request->files;

        $now = new \DateTime();

        $filesDirPath = $this->getParameter('files_dir_path');
        if (!is_dir($filesDirPath)) {
            $fs->mkdir($filesDirPath, 0777);
        }

        if (!$itemId) {
            return $this->setError('Item not found.');
        }
        if (!$categoryId) {
            return $this->setError('Category not found.');
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        $categoryRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Category');

        /** @var Category $category */
        $category = $categoryRepository->find($categoryId);
        if (!$category) {
            return $this->setError('Category not found.');
        }

        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        if(!$contentType || $ownerType !== $contentType->getName()){
            return $this->setError('Content type not found.');
        }
        $contentTypeFields = $contentType->getFields();

        // Get owner entity
        $productController = new ProductController();
        $productController->setContainer($this->container);

        $collection = $productController->getCollection($contentType->getCollection());

        $entity = $collection->findOne(['_id' => $itemId]);
        if(!$entity){
            return $this->setError('Product not found.');
        }

        $error = '';
        $outputFiles = [];
        $fileIds = [];

        foreach($entity as $fieldName => $value) {
            if (in_array($fieldName, ['_id', 'parentId', 'isActive'])) {
                continue;
            }

            $baseFieldName = ContentType::getCleanFieldName($fieldName);
            $fields = self::search($contentTypeFields, 'name', $baseFieldName);
            if (empty($fields)) {
                continue;
            }
            if ($fields[0]['inputType'] === 'file' && !empty($value['fileId'])) {
                $fileIds[] = $value['fileId'];
            }

            /** @var UploadedFile $file */
            $file = $files->get($fieldName);

            if (!empty($file)) {
                if($error = $productController->validateField($file->getClientOriginalName(), $fields[0], [
                    'mimeType' => $file->getMimeType()
                ])){
                    break;
                }

                $fileDocument = new FileDocument();
                $fileDocument
                    ->setUploadRootDir($filesDirPath)
                    ->setCreatedDate($now)
                    ->setOwnerType($ownerType)
                    ->setOwnerDocId($itemId)
                    ->setUserId($user->getId())
                    ->setFile($file);

                $dm->persist($fileDocument);
                $dm->flush();

                $fileIds[] = $fileDocument->getId();
                $outputFiles[] = $fileDocument->toArray();
                $entity[$fieldName] = $fileDocument->getRecordData();
            }
        }

        $dm->flush();

        if ($error) {
            return $this->setError($error);
        } else {
            $collection->update(['_id' => $entity['_id']], ['$set' => $entity]);
        }

        $fileIds = array_unique($fileIds);
        $this->deleteUnused($ownerType, $itemId, $fileIds);
        $productController->sortAdditionalFields($contentType->getCollection(), $entity, $fieldsSort);

        return new JsonResponse($outputFiles);
    }

    /**
     * @param string $ownerType
     * @param int $ownerDocId
     * @param array $usedIds
     * @return int
     */
    public function deleteUnused($ownerType, $ownerDocId, $usedIds)
    {
        $count = 0;
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $fileDocumentRepository = $this->getRepository();

        $fileDocumentsUnused = $fileDocumentRepository->findUnused($ownerType, $ownerDocId, $usedIds);
        /** @var FileDocument $fileDocument */
        foreach ($fileDocumentsUnused as $fileDocument) {
            $dm->remove($fileDocument);
        }
        $dm->flush();

        return $count;
    }

    /**
     * @Route("/download/{id}")
     * @Method({"GET"})
     * @param FileDocument $fileDocument
     * @return Response
     */
    public function downloadFileAction(FileDocument $fileDocument)
    {
        if (!$fileDocument) {
            throw $this->createNotFoundException();
        }
        $filesDirPath = $this->getParameter('files_dir_path');
        $fileDocument->setUploadRootDir($filesDirPath);
        $filePath = $fileDocument->getUploadedPath();

        if (!$filePath || !file_exists($filePath)) {
            throw $this->createNotFoundException();
        }

        return UtilsService::downloadFile($filePath, $fileDocument->getTitle());
    }

    /**
     * @return \AppBundle\Repository\FileDocumentRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(FileDocument::class);
    }

    /**
     * @param $array
     * @param $key
     * @param $value
     * @return array
     */
    public static function search($array, $key, $value)
    {
        $results = [];
        if (is_array($array)) {
            if (isset($array[$key]) && $array[$key] == $value) {
                $results[] = $array;
            }
            foreach ($array as $subarray) {
                $results = array_merge($results, self::search($subarray, $key, $value));
            }
        }
        return $results;
    }
}