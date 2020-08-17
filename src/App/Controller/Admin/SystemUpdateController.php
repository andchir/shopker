<?php

namespace App\Controller\Admin;

use App\Service\UtilsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class SystemUpdateController
 * @package App\Controller\Admin
 * @Route("/admin/system_update")
 */
class SystemUpdateController extends AbstractController
{
    /** @var ParameterBagInterface */
    protected $params;
    /** @var TranslatorInterface */
    protected $translator;
    
    public function __construct(ParameterBagInterface $params, TranslatorInterface $translator)
    {
        $this->params = $params;
        $this->translator = $translator;
    }
    
    /**
     * @Route("/upload", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     */
    public function uploadAction(Request $request)
    {
        $rootPath = $this->params->get('kernel.project_dir');
        $targetDirPath = $rootPath . '/var/updates';
        if (!is_dir($targetDirPath)) {
            mkdir($targetDirPath);
        }
    
        /** @var UploadedFile $file */
        $file = $request->files->get('file') ?? null;
        
        if (!$file) {
            return $this->setError($this->translator->trans('File not found.', [], 'validators'));
        }
        $ext = strtolower($file->getClientOriginalExtension());
        if ($ext !== 'zip') {
            return $this->setError($this->translator->trans('File type is not allowed.', [], 'validators'));
        }

        UtilsService::cleanDirectory($targetDirPath);
        $fileName = $file->getClientOriginalName();
        $file->move($targetDirPath, $fileName);

        if (!UtilsService::unZip($targetDirPath . DIRECTORY_SEPARATOR . $fileName, $targetDirPath)) {
            return $this->setError($this->translator->trans('Error unpacking archive.', [], 'validators'));
        }
    
        return $this->json([
            'fileName' => $fileName,
            'success' => true
        ]);
    }
    
    /**
     * @param $message
     * @param int $status
     * @return JsonResponse
     */
    public function setError($message, $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        $response = new JsonResponse(["error" => $message]);
        $response = $response->setStatusCode($status);
        return $response;
    }
}
