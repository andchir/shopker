<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\FileDocument;
use App\MainBundle\Document\User;
use App\Service\UtilsService;
use Symfony\Component\HttpFoundation\FileBag;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Class FileControllerAbstract
 * @package App\Controller
 * @Route("/admin/files")
 */
class FileController extends BaseController
{

    /**
     * @Route("/upload", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadFilesAction(Request $request)
    {
        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');

        $categoryId = (int) $request->get('categoryId');
        $options = [];
        $options['itemId'] = (int) $request->get('itemId');
        $options['ownerType'] = $request->get('ownerType');
        if ($options['ownerType'] == FileDocument::OWNER_CATEGORY) {
            $categoryId = $options['itemId'];
        }
        $options['fieldsSort'] = explode(',', $request->get('fieldsSort', ''));
        /** @var FileBag $files */
        $files = $request->files;

        if (is_null($options['itemId'])) {
            return $this->setError($translator->trans('Item not found.', [], 'validators'));
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        /** @var Category $category */
        $category = $dm->getRepository('AppMainBundle:Category')->find($categoryId);
        if (!$category) {
            return $this->setError($translator->trans('Category not found.', [], 'validators'));
        }

        if ($options['ownerType'] == 'category') {
            list($usedFiles, $error) = $this->saveFileForCategory($category, $options, $files);
        } else {
            list($usedFiles, $error) = $this->saveFileForDocument($category, $options, $files);
        }

        if ($error) {
            return $this->setError($translator->trans($error, [], 'validators'));
        } else {

            $fileIds = array_map(function($item) {
                return $item['id'];
            }, $usedFiles);
            $this->deleteUnused($options['ownerType'], $options['itemId'], $fileIds);

            return new JsonResponse($usedFiles);
        }
    }

    /**
     * @param Category $category
     * @param array $options
     * @param FileBag $files
     * @return array
     */
    public function saveFileForCategory(Category $category, $options, $files)
    {
        $error = '';
        $usedFiles = [];

        /** @var User $user */
        $user = $this->getUser();
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        /** @var UploadedFile $file */
        $file = $files->get('image');

        if (empty($file)) {
            $error = 'File is empty.';
            return [$usedFiles, $error];
        }

        if (!$this->fileUploadAllowed($file->getClientOriginalName(), ['jpg','jpeg','png','gif'])) {
            $error = 'File type is not allowed.';
            return [$usedFiles, $error];
        }

        $filesDirPath = $this->getParameter('app.files_dir_path');
        if (!is_dir($filesDirPath)) {
            mkdir($filesDirPath);
        }

        $fileDocument = new FileDocument();
        $fileDocument
            ->setUploadRootDir($filesDirPath)
            ->setCreatedDate(new \DateTime())
            ->setOwnerType($options['ownerType'])
            ->setOwnerDocId($options['itemId'])
            ->setUserId($user->getId())
            ->setFile($file);

        $dm->persist($fileDocument);
        $dm->flush();

        $usedFiles[] = $fileDocument->toArray();

        // Update image data in category
        $category->setImage($fileDocument->getRecordData());
        $dm->flush();

        return [$usedFiles, $error];
    }

    /**
     * @param Category $category
     * @param array $options
     * @param FileBag $files
     * @return array
     */
    public function saveFileForDocument(Category $category, $options, $files)
    {
        $error = '';
        $usedFiles = [];

        /** @var User $user */
        $user = $this->getUser();
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        /** @var ContentType $contentType */
        $contentType = $category->getContentType();
        $fileDocumentRepository = $this->getRepository();
        if(!$contentType || $options['ownerType'] !== $contentType->getName()){
            $error = 'Content type not found.';
            return [$usedFiles, $error];
        }
        $contentTypeFields = $contentType->getFields();

        // Get owner entity
        $productController = new ProductController();
        $productController->setContainer($this->container);

        $collection = $productController->getCollection($contentType->getCollection());

        $entity = $collection->findOne(['_id' => $options['itemId']]);
        if(!$entity){
            $error = 'Product not found.';
            return [$usedFiles, $error];
        }

        $now = new \DateTime();

        $filesDirPath = $this->getParameter('app.files_dir_path');
        if (!is_dir($filesDirPath)) {
            mkdir($filesDirPath);
        }

        foreach($entity as $fieldName => $value) {
            if (in_array($fieldName, ['_id', 'parentId', 'isActive'])) {
                continue;
            }

            $baseFieldName = ContentType::getCleanFieldName($fieldName);
            $fields = self::search($contentTypeFields, 'name', $baseFieldName);
            if (empty($fields)) {
                continue;
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
                    ->setOwnerType($options['ownerType'])
                    ->setOwnerDocId($options['itemId'])
                    ->setUserId($user->getId())
                    ->setFile($file);

                $dm->persist($fileDocument);
                $dm->flush();

                $usedFiles[] = $fileDocument->toArray();
                $entity[$fieldName] = $fileDocument->getRecordData();

            } else if ($fields[0]['inputType'] === 'file' && !empty($value['fileId'])) {

                $fileDocument = null;
                try {
                    /** @var FileDocument $fileDocument */
                    $fileDocument = $fileDocumentRepository->find($value['fileId']);
                } catch (\Exception $e) {
                    $error = $e->getMessage();
                    break;
                }
                if ($fileDocument) {
                    $usedFiles[] = $fileDocument->toArray();
                }
            }
        }

        $dm->flush();

        if ($error) {
            return [$usedFiles, $error];
        } else {
            $collection->updateOne(['_id' => $entity['_id']], ['$set' => $entity]);
        }

        $productController->sortAdditionalFields($contentType->getCollection(), $entity, $options['fieldsSort']);

        return [$usedFiles, $error];
    }

    /**
     * @param string $ownerType
     * @param int $ownerDocId
     * @param array $usedIds
     * @return int
     */
    public function deleteUnused($ownerType, $ownerDocId, $usedIds = [])
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
     * @Route("/download/{id}", methods={"GET"})
     * @param FileDocument $fileDocument
     * @return Response
     */
    public function downloadFileAction(FileDocument $fileDocument)
    {
        if (!$fileDocument) {
            throw $this->createNotFoundException();
        }
        $filesDirPath = $this->getParameter('app.files_dir_path');
        $fileDocument->setUploadRootDir($filesDirPath);
        $filePath = $fileDocument->getUploadedPath();

        if (!$filePath || !file_exists($filePath)) {
            throw $this->createNotFoundException();
        }

        return UtilsService::downloadFile($filePath, $fileDocument->getTitle());
    }

    /**
     * @param string | array $value
     * @param array $allowedExtensions
     * @return bool
     */
    public function fileUploadAllowed($value, $allowedExtensions = [])
    {
        $filesExtBlacklist = $this->getParameter('app.files_ext_blacklist');
        if (is_array($value)) {
            $ext = !empty($value['extension']) ? strtolower($value['extension']) : null;
        } else {
            $ext = UtilsService::getExtension($value);
        }
        if (in_array($ext, $filesExtBlacklist)) {
            return false;
        }

        if ($ext === null || !in_array($ext, $allowedExtensions)) {
            return false;
        }

        return true;
    }

    /**
     * @return \App\Repository\FileDocumentRepository
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
