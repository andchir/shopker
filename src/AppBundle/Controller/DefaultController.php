<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Form\Type\SetupType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Document\ContentType;
use Symfony\Component\Translation\TranslatorInterface;

class DefaultController extends CatalogController
{
    /**
     * @Route("/", name="homepage")
     */
    public function homepageAction()
    {
        $categoriesRepository = $this->getCategoriesRepository();
        $categoriesTopLevel = $this->getChildCategories(0, [], true);

        // Get categorits count
        $countCategories = $categoriesRepository
            ->createQueryBuilder()
            ->getQuery()
            ->execute()
            ->count();

        // Get products count
        $productsController = new Admin\ProductController();
        $productsController->setContainer($this->container);
        $collection = $productsController->getCollection('products');
        $countProducts = $collection->count();

        // Get page description
        $description = '';
        /** @var Category $rootCategory */
        $rootCategory = $categoriesRepository->findOneBy(['name' => 'root']);
        if ($rootCategory) {
            $description = $rootCategory->getDescription();
        }

        return $this->render('homepage.html.twig', [
            'categoriesTopLevel' => $categoriesTopLevel,
            'currentUri' => 'home',
            'description' => $description,
            'countCategories' => $countCategories,
            'currentId' => 0,
            'countProducts' => $countProducts
        ]);
    }

    /**
     * @Route("/404", name="404")
     */
    public function pageNotFoundAction()
    {
        $categoriesTopLevel = $this->getChildCategories(0, [], true);

        return $this->render('errors/404.html.twig', [
            'currentUri' => '404',
            'categoriesTopLevel' => $categoriesTopLevel
        ]);
    }

    /**
     * @Route("/setup", name="setup")
     */
    public function setupAction(Request $request, TranslatorInterface $translator)
    {
        $form = $this->createForm(SetupType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $form->addError(new FormError($translator->trans('install.mongodb_connection_fail', [], 'validators')));

            // TODO: Add validation and save data

        }

        return $this->render('setup.twig', [
            'form' => $form->createView()
        ]);
    }

}
