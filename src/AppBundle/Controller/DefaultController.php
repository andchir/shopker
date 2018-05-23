<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Document\User;
use AppBundle\Form\Type\SetupType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class DefaultController extends CatalogController
{
    /**
     * @Route("/", name="homepage")
     * @return Response
     */
    public function homepageAction()
    {
        if (empty($this->container->getParameter('mongodb_database'))
            || empty($this->container->getParameter('mongodb_user'))) {
                return $this->redirectToRoute('setup');
        }
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
     * @Route("/setup/{_locale}", name="setup", requirements={"_locale"}, defaults={"_locale": "en"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param UserPasswordEncoderInterface $encoder
     * @return Response
     */
    public function setupAction(
        Request $request,
        TranslatorInterface $translator,
        UserPasswordEncoderInterface $encoder
    )
    {
        if (!empty($this->container->getParameter('mongodb_database'))
            || !empty($this->container->getParameter('mongodb_user'))) {
                return $this->redirectToRoute('homepage');
        }
        $settingsDefault = [
            'locale' => $request->getLocale(),
            'app_name' => $this->getParameter('app_name'),
            'mongodb_server' => $this->getParameter('mongodb_server'),
            'mailer_transport' => $this->getParameter('mailer_transport'),
            'mailer_host' => $this->getParameter('mailer_host'),
            'mailer_port' => $this->getParameter('mailer_port'),
            'mailer_user' => $this->getParameter('mailer_user'),
            'mailer_password' => $this->getParameter('mailer_password'),
            'mailer_encryption' => $this->getParameter('mailer_encryption'),
            'mailer_auth_mode' => $this->getParameter('mailer_auth_mode'),
        ];

        $form = $this->createForm(SetupType::class, $settingsDefault);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $data = $form->getData();

            $dm = $this->get('doctrine_mongodb')->getManager();
            $dbConnection = $dm->getConnection();
            $serverUrl = "mongodb://{$data['mongodb_user']}:{$data['mongodb_password']}@{$data['mongodb_server']}";

            try {
                $mongoClient = new \MongoClient($serverUrl);
                $dbConnection->setMongo($mongoClient);
                $connectResult = $dbConnection->isConnected();
            } catch (\Exception $e) {
                $connectResult = false;
            }

            if (!$connectResult) {
                $form->addError(new FormError($translator->trans('install.mongodb_connection_fail', [], 'validators')));
            } else {

                $dm->getConfiguration()->setDefaultDb($data['mongodb_database']);

                $adminEmail = $data['admin_email'];
                $adminPassword = $data['admin_password'];

                unset($data['admin_email'], $data['admin_password']);

                $this->saveSettingsToYaml('settings', array_merge($settingsDefault, $data));

                $user = new User();
                $encodedPassword = $encoder->encodePassword($user, $adminPassword);

                $user
                    ->setUsername('admin')
                    ->setEmail($adminEmail)
                    ->setRoles(['ROLE_SUPER_ADMIN'])
                    ->setPassword($encodedPassword)
                    ->setIsActive(true);

                $dm->persist($user);
                $dm->flush();

                return $this->redirectToRoute('login');
            }
        }

        return $this->render('setup.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @param string $yamlFileName
     * @param $data
     * @return bool|int
     */
    public function saveSettingsToYaml($yamlFileName = 'settings', $data)
    {
        $rootPath = $this->getParameter('kernel.root_dir');
        $settingsFilePath = $rootPath . DIRECTORY_SEPARATOR . "config/{$yamlFileName}.yml";
        $yaml = Yaml::dump(['parameters' => $data]);

        return file_put_contents($settingsFilePath, $yaml);
    }

}
