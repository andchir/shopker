<?php

namespace App\Controller\Admin;

use App\Service\SettingsService;
use App\Service\UtilsService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class HomepageController
 * @package App\Controller
 * @Route("/admin")
 */
class HomepageController extends Controller
{
    /**
     * @Route("/", name="admin")
     * @param Request $request
     * @return Response
     */
    public function indexAction(Request $request)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $settings = $settingsService->getArray();

        $userController = new UserController();
        $userController->setContainer($this->container);
        $rolesHierarchy = $userController->getRolesHierarchy();

        $localeList = $this->getParameter('app.locale_list');
        $localeList = UtilsService::stringToArray($localeList);

        $settings = [
            'filesDirUrl' => $this->getParameter('app.files_dir_url'),
            'baseDir' => realpath($this->getParameter('kernel.root_dir').'/../..') . DIRECTORY_SEPARATOR,
            'locale' => $this->getParameter('locale'),
            'localeList' => $localeList,
            'systemSettings' => $settings,
            'rolesHierarchy' => $rolesHierarchy
        ];

        $response = $this->render('admin/homepage.html.twig', ['settings' => $settings]);
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
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
        $moduleTemplatePath = $rootPath . '/public/admin/bundle-' . $moduleName;
        if ($environment == 'dev') {
            $moduleTemplatePath .= '-dev';
        }
        $moduleTemplatePath .= '/index.html';
        if (!file_exists($moduleTemplatePath)) {
            throw $this->createNotFoundException();
        }
        $content = file_get_contents($moduleTemplatePath);
        $response = new Response($content);
        $response->setEtag(md5($response->getContent()));
        $response->setPublic();
        $response->isNotModified($request);

        return $response;
    }
}
