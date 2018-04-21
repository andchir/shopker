<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Service\SettingsService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Document\ContentType;

/**
 * Class HomepageController
 * @package AppBundle\Controller
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
            'filesDirUrl' => $this->getParameter('files_dir_url'),
            'baseDir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'locale' => $this->getParameter('locale'),
            'systemSettings' => $settings,
            'rolesHierarchy' => $rolesHierarchy
        ];
        return $this->render('admin/homepage.html.twig', ['settings' => $settings]);
    }

}
