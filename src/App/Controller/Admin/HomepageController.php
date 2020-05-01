<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class HomepageController
 * @package App\Controller
 * @Route("/admin")
 */
class HomepageController extends AbstractController
{

    /** @var ParameterBagInterface */
    protected $params;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }
    
    /**
     * @Route("/", name="admin")
     * @param Request $request
     * @param KernelInterface $kernel
     * @return Response
     */
    public function indexAction(Request $request, KernelInterface $kernel)
    {
        $environment = $kernel->getEnvironment();
        $publicDirPath = realpath($this->params->get('app.web_dir_path'));
        $indexPagePath = $publicDirPath . '/admin/bundle';
        if ($environment == 'dev') {
            $indexPagePath .= '-dev';
        }
        $indexPagePath .= '/index.html';

        $content = $this->getIndexPageContent($indexPagePath, $request->getLocale());
        if (!$content) {
            throw $this->createNotFoundException('index.html page not found.');
        }

        $response = new Response($content);
        $response->setEtag(md5($response->getContent()));
        $response->setPublic();
        $response->isNotModified($request);

        return $response;
    }

    /**
     * @Route(
     *     "/module/{moduleName}",
     *     name="admin_module",
     *     requirements={"moduleName"="[a-z\-_]+"})
     * @param Request $request
     * @param $moduleName
     * @param KernelInterface $kernel
     * @return Response
     */
    public function moduleAction(Request $request, $moduleName, KernelInterface $kernel)
    {
        $environment = $kernel->getEnvironment();
        $publicDirPath = realpath($this->params->get('app.web_dir_path'));
        $moduleName = str_replace(['_', '-'], '', $moduleName);
        $indexPagePath = $publicDirPath . '/bundles/' . $moduleName . '/admin/bundle';
        if ($environment == 'dev') {
            $indexPagePath .= '-dev';
        }
        $indexPagePath .= '/index.html';

        $content = $this->getIndexPageContent($indexPagePath, $request->getLocale());
        if (!$content) {
            throw $this->createNotFoundException();
        }

        $response = new Response($content);
        $response->setEtag(md5($response->getContent()));
        $response->setPublic();
        $response->isNotModified($request);

        return $response;
    }

    /**
     * @param $indexPagePath
     * @param $locale
     * @return string
     */
    public function getIndexPageContent($indexPagePath, $locale)
    {
        if (!file_exists($indexPagePath)) {
            return '';
        }
        $content = file_get_contents($indexPagePath);
        $content = str_replace([
            '{{locale}}', '{{timestamp}}', '{{app_name}}'
        ], [
            $locale, time(), $this->params->get('app.name')
        ], $content);
        return $content;
    }
}
