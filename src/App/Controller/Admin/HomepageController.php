<?php

namespace App\Controller\Admin;

use App\Service\SettingsService;
use App\Service\UtilsService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\MainBundle\Document\ContentType;

/**
 * Class HomepageController
 * @package App\Controller
 * @Route("/admin")
 */
class HomepageController extends Controller
{
    /**
     * @Route("/", name="admin")
     */
    public function indexAction(Request $request)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $settings = $settingsService->getArray();

        $userController = new UserController();
        $userController->setContainer($this->container);
        $rolesHierarchy = $userController->getRolesHierarchy();

        $settings = [
            'filesDirUrl' => $this->getParameter('app.files_dir_url'),
            'baseDir' => realpath($this->getParameter('kernel.root_dir').'/../..') . DIRECTORY_SEPARATOR,
            'locale' => $this->getParameter('locale'),
            'systemSettings' => $settings,
            'rolesHierarchy' => $rolesHierarchy
        ];
        return $this->render('admin/homepage.html.twig', ['settings' => $settings]);
    }

    /**
     * @Route("/settings_script", name="admin_settings_script")
     * @param UtilsService $utilsService
     * @return Response
     */
    public function settingsScriptAction(UtilsService $utilsService)
    {
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $settings = $settingsService->getArray();

        $userController = new UserController();
        $userController->setContainer($this->container);
        $rolesHierarchy = $userController->getRolesHierarchy();

        $settings = [
            'filesDirUrl' => $this->getParameter('app.files_dir_url'),
            'baseDir' => realpath($this->getParameter('kernel.root_dir').'/../..') . DIRECTORY_SEPARATOR,
            'locale' => $this->getParameter('locale'),
            'systemSettings' => $settings,
            'rolesHierarchy' => $rolesHierarchy
        ];

        $adminRoutes = $utilsService->parseYaml('admin_routes');
        $adminMenu = $utilsService->parseYaml('admin_menu');
        $content = $this->renderView('admin/settings.js.twig', [
            'settings' => $settings,
            'adminRoutes' => json_encode($adminRoutes['routes']),
            'adminMenu' => json_encode($adminMenu['menu'])
        ]);

        $response = new Response($content);
        $response->headers->set('Content-Type', 'application/javascript');
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Cache-Control', 'post-check=0, pre-check=0', false);
        $response->headers->set('Pragma', 'no-cache');

        return $response;
    }
}
