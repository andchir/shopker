<?php

namespace App\Controller;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment as TwigEnvironment;

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
     * @param FormInterface $form
     * @param array $output
     * @param string $parentFormName
     * @return array
     */
    public function getErrorsFromForm(FormInterface $form, $output = [], $parentFormName = '')
    {
        foreach ($form->getErrors() as $error) {
            if ($parentFormName) {
                if (!isset($output[$parentFormName])) {
                    $output[$parentFormName] = [];
                }
                $output[$parentFormName][$form->getName()] = $error->getMessage();
            } else {
                $output[$form->getName()] = $error->getMessage();
            }
        }
        foreach ($form->all() as $childForm) {
            if ($childForm instanceof FormInterface) {
                $output = $this->getErrorsFromForm($childForm, $output, $form->getName());
            }
        }
        return $output;
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

    /**
     * @param TwigEnvironment $twigEnvironment
     * @param string $mainTemplateName
     * @param string $prefix
     * @param string $path
     * @param string $format
     * @return string
     */
    public function getTemplateName(TwigEnvironment $twigEnvironment, $mainTemplateName, $prefix, $path = '', $format = 'html')
    {
        $templateName = $path . sprintf('%s_%s.%s.twig', $prefix, $mainTemplateName, $format);
        if ($twigEnvironment->getLoader()->exists($templateName)) {
            return $templateName;
        }
        return $path . sprintf('%s.%s.twig', $mainTemplateName, $format);
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function getIsJsonApi(Request $request)
    {
        return strpos($request->getPathInfo(), '/api/') !== false
            && $request->headers->get('Accept') === 'application/json';
    }
}
