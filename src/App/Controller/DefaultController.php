<?php

namespace App\Controller;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\User;
use App\Form\Type\SetupType;
use App\Service\CatalogService;
use App\Service\SettingsService;
use Doctrine\Bundle\MongoDBBundle\ManagerRegistry;
use Doctrine\Common\DataFixtures\Executor\MongoDBExecutor;
use Doctrine\Common\DataFixtures\Purger\MongoDBPurger;
use Doctrine\ODM\MongoDB\Configuration;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\HttpKernel\KernelInterface;
use Doctrine\Common\DataFixtures\Loader as DataFixturesLoader;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

/**
 * Class DefaultController
 * @package App\Controller
 */
class DefaultController extends Controller
{

    /** @var SettingsService */
    protected $settingsService;

    /**
     * DefaultController constructor.
     * @param SettingsService $settingsService
     */
    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    /**
     * @Route(
     *     "/{_locale}/",
     *     name="homepage_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/", name="homepage")
     * @param Request $request
     * @param CatalogService $catalogService
     * @return Response
     */
    public function homepageAction(Request $request, CatalogService $catalogService)
    {
        if (empty($this->getParameter('mongodb_database'))) {
            return $this->redirectToRoute('setup');
        }

        $categoriesRepository = $catalogService->getCategoriesRepository();
        $categoriesTopLevel = $catalogService->getChildCategories(0, [], true);

        // Get categorits count
        $countCategories = $categoriesRepository
            ->createQueryBuilder()
            ->field('name')->notEqual('root')
            ->field('isActive')->equals(true)
            ->count()
            ->getQuery()
            ->execute();

        // Get products count
        $productsController = new Admin\ProductController();
        $productsController->setContainer($this->container);
        $collection = $productsController->getCollection('products');
        $countProducts = $collection->countDocuments(['isActive' => true]);

        // Get page description
        $description = '';
        /** @var Category $rootCategory */
        $rootCategory = $categoriesRepository->findOneBy(['name' => 'root']);
        if ($rootCategory) {
            $description = $rootCategory->getDescription();
        }

        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $currency = $settingsService->getCurrency();

        $response = $this->render('homepage.html.twig', [
            'categoriesTopLevel' => $categoriesTopLevel,
            'currentUri' => '',
            'activeCategoriesIds' => [],
            'currency' => $currency,
            'description' => $description,
            'countCategories' => $countCategories,
            'currentId' => 0,
            'countProducts' => $countProducts
        ]);
        $response->setEtag(md5($response->getContent()));
        $response->setPublic();
        $response->isNotModified($request);

        return $response;
    }

    /**
     * @Route("/locale_switch/{locale}", name="locale_switch")
     * @param Request $request
     * @param string $locale
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function localeSwitchAction(Request $request, $locale)
    {
        $referer = $request->headers->get('referer');
        $request->getSession()->set('_locale', $locale);
        return $this->redirect($referer);
    }

    /**
     * @Route("/404", name="404")
     * @param CatalogService $catalogService
     * @return Response
     */
    public function pageNotFoundAction(CatalogService $catalogService)
    {
        $categoriesTopLevel = $catalogService->getChildCategories(0, [], true);

        return $this->render('errors/404.html.twig', [
            'currentUri' => '404',
            'categoriesTopLevel' => $categoriesTopLevel
        ]);
    }

    /**
     * @Route("/setup/{_locale}", name="setup", requirements={"_locale"=".+"}, defaults={"_locale": "en"})
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param UserPasswordEncoderInterface $encoder
     * @param CatalogService $catalogService
     * @param DocumentManager $dm
     * @return RedirectResponse|Response
     */
    public function setupAction(
        Request $request,
        TranslatorInterface $translator,
        UserPasswordEncoderInterface $encoder,
        CatalogService $catalogService,
        DocumentManager $dm
    )
    {
        if (!empty($this->getParameter('mongodb_database'))) {
            return $this->redirectToRoute('homepage');
        }
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');

        $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
        $parametersYamlPath = $rootPath . DIRECTORY_SEPARATOR . 'config/settings.yaml.dist';
        $parameters = [];
        if ($parametersYamlPath) {
            try {
                $parameters = Yaml::parse(file_get_contents($parametersYamlPath));
                $parameters = $parameters['parameters'];
            } catch (ParseException $e) {
                $request->getSession()
                    ->getFlashBag()
                    ->add('errors', $e->getMessage());
            }
        }

        $settingsDefault = array_merge($parameters, [
            'locale' => $request->getLocale(),
            'app.locale_list' => $request->getLocale() == 'ru' ? 'ru,en' : 'en,ru',
            'app.name' => $this->getParameter('app.name'),
            'mongodb_server' => $this->getParameter('mongodb_server'),
            'mongodb_port' => $this->getParameter('mongodb_port'),
            'mongodb_user' => '',
            'mongodb_password' => '',
            'mongodb_database' => '',
            'mailer_transport' => $this->getParameter('mailer_transport'),
            'mailer_host' => $this->getParameter('mailer_host'),
            'mailer_port' => $this->getParameter('mailer_port'),
            'mailer_user' => $this->getParameter('mailer_user'),
            'mailer_password' => $this->getParameter('mailer_password'),
            'mailer_encryption' => $this->getParameter('mailer_encryption'),
            'mailer_auth_mode' => $this->getParameter('mailer_auth_mode')
        ]);

        $form = $this->createForm(SetupType::class, array_merge($settingsDefault, [
            'app_name' => $settingsDefault['app.name']
        ]));

        if (!empty($request->get('setup')['form_reload'])) {
            // Reload form
            $data = $request->get('setup');
            foreach ($data as $key => $value) {
                if ($form->has($key) && !in_array($key, ['form_reload', 'drop_database'])) {
                    $form->get($key)->setData($value);
                }
            }
        } else {
            $form->handleRequest($request);
        }

        if ($form->isSubmitted()) {

            $data = $form->getData();

            if ($form->isValid() && !$data['form_reload']) {

                if (!empty($data['mongodb_uri'])) {
                    $serverUrl = $data['mongodb_uri'];
                } else if (empty($data['mongodb_user']) && empty($data['mongodb_password'])) {
                    $data['mongodb_user'] = '';
                    $data['mongodb_password'] = '';
                    $serverUrl = "mongodb://{$data['mongodb_server']}:{$data['mongodb_port']}";
                } else {
                    $serverUrl = "mongodb://{$data['mongodb_user']}:{$data['mongodb_password']}@{$data['mongodb_server']}";
                    if ($data['mongodb_port']) {
                        $serverUrl .= ':' . $data['mongodb_port'];
                    }
                }

                try {
                    $mongoClient = new \MongoDB\Client($serverUrl, [], ['typeMap' => ['root' => 'array', 'document' => 'array']]);
                    // $connectResult = $mongoClient->listDatabases();
                    $connectResult = true;
                } catch (\Exception $e) {
                    $connectResult = false;
                }

                if ($connectResult === false) {
                    $form->addError(new FormError($translator->trans('install.mongodb_connection_fail', [], 'validators')));
                } else {

                    /** @var \MongoDB\Database $dataBase */
                    $dataBase = $mongoClient->selectDatabase($data['mongodb_database']);
                    $collections = null;
                    try {
                        $collections = $dataBase->listCollections();
                    } catch (\Exception $e) {
                        $form->addError(new FormError($translator->trans('install.mongodb_connection_fail', [], 'validators')));
                    }

                    if ($form->isValid() && $collections && iterator_count($collections) > 0) {

                        if ($data['drop_database']) {

                            // Drop collections
                            $result = null;
                            /** @var \MongoDB\Model\CollectionInfo $collection */
                            foreach ($collections as $collection) {
                                $dbCollection = $mongoClient->selectCollection($data['mongodb_database'], $collection->getName());
                                if ($dbCollection) {
                                    $result = $dbCollection->drop();
                                }
                            }
                            if (!$result || empty($result['ok'])) {
                                $form->addError(new FormError($translator->trans('install.mongodb_database_clear_error', [],
                                    'validators')));
                            }

                        } else if (iterator_count($collections) > 0) {
                            $form->addError(new FormError($translator->trans('install.mongodb_database_not_empty', [],
                                'validators')));
                        }
                    }

                    if (!is_writable($settingsService->getConfigYamlFilePath('settings'))) {
                        $form->addError(new FormError($translator->trans('install.settings_file_not_writable', [], 'validators')));
                    }

                    if ($form->isValid()) {

                        $data['app.name'] = $data['app_name'];
                        $data['app.admin_email'] = $data['admin_email'];
                        $settings = array_merge($settingsDefault, $data);
                        $settings = array_filter($settings, function ($key) use ($settingsDefault) {
                            return in_array($key, array_keys($settingsDefault));
                        }, ARRAY_FILTER_USE_KEY);
                        $settingsService->saveSettingsToYaml($settings, 'settings');
                        $this->systemCacheClear();

                        $adminEmail = $data['admin_email'];
                        $adminPassword = $data['admin_password'];

                        unset($data['admin_email'], $data['admin_password'], $data['form_reload']);

                        // Add Super Admin
                        /** @var \Doctrine\ODM\MongoDB\DocumentManager $documentManagerDefault */
                        $documentManagerDefault = $this->get('doctrine_mongodb')->getManager();
                        $documentManagerDefault->getConfiguration()->setDefaultDb($data['mongodb_database']);

                        $config = $documentManagerDefault->getConfiguration();
                        $config->setDefaultDb($data['mongodb_database']);
                        $documentManager = DocumentManager::create($mongoClient, $config);

                        $user = new User();
                        $encodedPassword = $encoder->encodePassword($user, $adminPassword);

                        $user
                            ->setUsername('admin')
                            ->setEmail($adminEmail)
                            ->setRoles(['ROLE_SUPER_ADMIN'])
                            ->setPassword($encodedPassword)
                            ->setIsActive(true);

                        $documentManager->persist($user);
                        $documentManager->flush();

                        $this->loadDataFixtures($documentManager, $data['locale']);
                        // $this->loadDataFixturesCommand($data['locale']);

                        // Update user auto_increment record
                        $autoincrementCollection = $mongoClient->selectCollection($data['mongodb_database'], 'doctrine_increment_ids');
                        $catalogService->getNextId('user', $data['mongodb_database'], $autoincrementCollection);

                        // Success message
                        $request->getSession()
                            ->getFlashBag()
                            ->add('messages', 'app_install.message.success');

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
     * @param DocumentManager $dm
     * @param $locale
     * @return bool
     */
    public function loadDataFixtures(DocumentManager $dm, $locale)
    {
        $rootPath = realpath($this->getParameter('kernel.root_dir').'/../..');
        $fixturesPath = $rootPath . '/src/App/DataFixtures/MongoDB/' . $locale;
        if (!is_dir($fixturesPath)) {
            return false;
        }

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
            '--group' => $locale,
            '--env' => $environment,
            '--quiet' => ''
        ));
        $output = new BufferedOutput();
        $application->run($input, $output);

        return $output->fetch();
    }

    /**
     * Clear system cache
     * @param bool $clearFileCache
     * @return string|bool
     * @throws \Exception
     */
    public function systemCacheClear($clearFileCache = true)
    {
        if ($clearFileCache) {
            $this->settingsService->fileCacheClear();
        }
        return $this->settingsService->systemCacheClear(false);
    }

}
