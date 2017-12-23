<?php

namespace AppBundle\Controller\Admin;

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
     * @Route("/", name="admin_homepage")
     */
    public function indexAction(Request $request)
    {
        $settings = [
            'filesDirUrl' => $this->getParameter('files_dir_url'),
            'baseDir' => realpath($this->getParameter('kernel.root_dir').'/..').DIRECTORY_SEPARATOR,
            'locale' => $this->getParameter('locale')
        ];
        return $this->render('admin/homepage.html.twig', ['settings' => $settings]);
    }

}
