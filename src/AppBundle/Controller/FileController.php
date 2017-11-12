<?php

namespace AppBundle\Controller;

use AppBundle\Document\FileDocument;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Filesystem\Filesystem;
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
    public function createItemAction(Request $request)
    {
        /** @var Filesystem $fs */
        $fs = $this->get('filesystem');
        $user = $this->getUser();

        $itemId = (int) $request->get('itemId');
        $ownerType = $request->get('ownerType');
        $files = $request->files;

        $now = new \DateTime();

        $filesDirPath = $this->getParameter('files_dir_path');
        if (!is_dir($filesDirPath)) {
            $fs->mkdir($filesDirPath, 0777);
        }

        if (!$itemId || !$ownerType) {
            return $this->setError('The owner of the files is not specified.');
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        $outputFiles = [];
        foreach ($files as $key => $file) {
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
        }

        $dm->flush();

        return new JsonResponse($outputFiles);
    }

}