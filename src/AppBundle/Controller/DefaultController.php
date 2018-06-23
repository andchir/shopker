<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Document\User;
use AppBundle\Form\Type\SetupType;
use AppBundle\Service\SettingsService;
use Doctrine\Common\DataFixtures\Executor\MongoDBExecutor;
use Doctrine\Common\DataFixtures\Purger\MongoDBPurger;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\HttpKernel\KernelInterface;
use Doctrine\Common\DataFixtures\Loader as DataFixturesLoader;

class DefaultController extends CatalogController
{
    /**
     * @Route("/", name="homepage")
     * @return Response
     */
    public function homepageAction()
    {
        if (empty($this->getParameter('mongodb_database'))
            || empty($this->getParameter('mongodb_user'))) {
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
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     */
    public function setupAction(
        Request $request,
        TranslatorInterface $translator,
        UserPasswordEncoderInterface $encoder
    )
    {
        if (!empty($this->getParameter('mongodb_database'))
            || !empty($this->getParameter('mongodb_user'))) {
                return $this->redirectToRoute('homepage');
        }
        $settingsDefault = [
            'locale' => $request->getLocale(),
            'app_name' => $this->getParameter('app_name'),
            'mongodb_server' => $this->getParameter('mongodb_server'),
            'mongodb_user' => '',
            'mongodb_password' => '',
            'mongodb_database' => '',
            'mailer_transport' => $this->getParameter('mailer_transport'),
            'mailer_host' => $this->getParameter('mailer_host'),
            'mailer_port' => $this->getParameter('mailer_port'),
            'mailer_user' => $this->getParameter('mailer_user'),
            'mailer_password' => $this->getParameter('mailer_password'),
            'mailer_encryption' => $this->getParameter('mailer_encryption'),
            'mailer_auth_mode' => $this->getParameter('mailer_auth_mode'),
            'payment_status_number' => 1
        ];

        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');

        $form = $this->createForm(SetupType::class, $settingsDefault);

        if (!empty($request->get('setup')['form_reload'])) {
            // Reload form
            $data = $request->get('setup');
            foreach ($data as $key => $value) {
                if ($form->has($key) && $key != 'form_reload') {
                    $form->get($key)->setData($value);
                }
            }
        } else {
            $form->handleRequest($request);
        }

        if ($form->isSubmitted()) {

            $data = $form->getData();

            if ($form->isValid() && !$data['form_reload']) {

                $data = $form->getData();

                $dbConnection = $this->get('doctrine_mongodb.odm.default_connection');
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

                    $dbsList = $dbConnection->getMongo()->listDBs();
                    if (array_search($data['mongodb_database'], array_column($dbsList['databases'], 'name')) === false) {
                        $form->addError(new FormError($translator->trans('install.mongodb_database_not_exist', [], 'validators')));
                    }

                    if ($form->isValid()) {

                        $adminEmail = $data['admin_email'];
                        $adminPassword = $data['admin_password'];

                        unset($data['admin_email'], $data['admin_password'], $data['form_reload']);

                        // Add Super Admin
                        $dm = $this->get('doctrine_mongodb')->getManager();
                        $dm->getConfiguration()->setDefaultDb($data['mongodb_database']);
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

                        // Success message
                        $request->getSession()
                            ->getFlashBag()
                            ->add('messages', 'app_install.message.success');

                        $settingsService->saveSettingsToYaml('settings', array_merge($settingsDefault, $data));

                        $this->systemCacheClear();
                        $this->loadDataFixtures($data['locale'], $data['mongodb_database']);

                        return $this->redirectToRoute('login');
                    }
                }
            }
        }

        return $this->render('setup.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * Load Data fixtures
     * @param $locale
     * @param $databaseName
     * @return bool
     */
    public function loadDataFixtures($locale, $databaseName)
    {
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/..');
        $fixturesPath = $rootPath . '/src/AppBundle/DataFixtures/MongoDB/' . $locale;
        if (!is_dir($fixturesPath)) {
            return false;
        }

        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->getConfiguration()->setDefaultDb($databaseName);

        $loaderClass = $this->container->getParameter('doctrine_mongodb.odm.fixture_loader');
        /** @var DataFixturesLoader $loader */
        $loader = new $loaderClass($this->container);
        $loader->loadFromDirectory($fixturesPath);

        $purger = new MongoDBPurger($dm);
        $executor = new MongoDBExecutor($dm, $purger);
        $executor->execute($loader->getFixtures(), true);

        return true;
    }

    /**
     * Load Data fixtures
     * @param $locale
     * @return string
     */
    public function loadDataFixturesCommand($locale)
    {
        /** @var KernelInterface $kernel */
        $kernel = $this->get('kernel');
        $environment = $kernel->getEnvironment();
        $application = new Application($kernel);
        $application->setAutoExit(false);
        $input = new ArrayInput(array(
            'command' => 'doctrine:mongodb:fixtures:load',
            '--fixtures' => realpath('./../src/AppBundle/DataFixtures/MongoDB/' . $locale),
            '--env' => $environment,
            '--quiet' => ''
        ));
        $output = new BufferedOutput();
        $application->run($input, $output);

        return $output->fetch();
    }

    /**
     * Clear system cache
     * @param null $environment
     * @return string
     */
    public function systemCacheClear($environment = null)
    {
        /** @var KernelInterface $kernel */
        $kernel = $this->container->get('kernel');
        if (!$environment) {
            $environment = $kernel->getEnvironment();
        }
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput([
            'command' => 'cache:clear',
            '--env' => $environment,
            '--quiet' => ''
        ]);

        $output = new BufferedOutput();
        $application->run($input, $output);

        return $output->fetch();
    }

}
