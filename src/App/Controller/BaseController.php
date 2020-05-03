<?php

namespace App\Controller;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class BaseController extends AbstractController
{
    /** @var ParameterBagInterface */
    protected $params;
    /** @var DocumentManager */
    protected $dm;
    /** @var TranslatorInterface */
    protected $translator;

    public function __construct(ParameterBagInterface $params, DocumentManager $dm, TranslatorInterface $translator)
    {
        $this->params = $params;
        $this->dm = $dm;
        $this->translator = $translator;
    }

    /**
     * @param $message
     * @param int $status
     * @return JsonResponse
     */
    public function setError($message, $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        $response = new JsonResponse(['error' => $message]);
        $response = $response->setStatusCode($status);
        return $response;
    }

    /**
     * @return string
     */
    public function getRootPath()
    {
        return $this->params->get('kernel.project_dir');
    }
}
