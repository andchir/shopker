<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Document\ContentType;
use AppBundle\Document\FileDocument;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

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
        $categoryId = $request->get('categoryId');
        $files = $request->files;

        $now = new \DateTime();

        $filesDirPath = $this->getParameter('files_dir_path');
        if (!is_dir($filesDirPath)) {
            $fs->mkdir($filesDirPath, 0777);
        }

        if (!$itemId) {
            return $this->setError('item not found.');
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

        /**
         * @var string $key
         * @var UploadedFile $file
         */
        foreach ($files as $key => $file) {

            $error = '';

            $fields = self::search($contentTypeFields, 'name', $key);
            if (empty($fields)) {
                continue;
            }

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
                ->setOwnerId($itemId)
                //->setUserId($user->getId())
                ->setFile($file);

            $dm->persist($fileDocument);
            $outputFiles[] = $fileDocument->toArray();

            $entity[$key] = $fileDocument->getFullFileName();
        }

        if ($error) {
            return $this->setError($error);
        } else {
            $dm->flush();
            $collection->update(['_id' => $entity['_id']], ['$set' => $entity]);
        }

        return new JsonResponse($outputFiles);
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