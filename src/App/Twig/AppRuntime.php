<?php

namespace App\Twig;

use App\MainBundle\Document\Order;
use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\Setting;
use App\MainBundle\Document\ShoppingCart;
use App\Service\CatalogService;
use App\Service\SettingsService;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormBuilder;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment as TwigEnvironment;
use Psr\Cache\CacheItemInterface;

class AppRuntime
{
    /** @var ContainerInterface */
    protected $container;
    /** @var  RequestStack */
    protected $requestStack;

    public function __construct(ContainerInterface $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->requestStack = $requestStack;
    }

    /**
     * @param TwigEnvironment $environment
     * @param string $chunkName
     * @param string $type
     * @param string $emptyChunkName
     * @param ShoppingCart|null $shoppingCart
     * @return string
     */
    public function shopCartFunction(TwigEnvironment $environment, $chunkName = 'shop_cart', $type = 'shop', $emptyChunkName = '', $shoppingCart = null)
    {
        if (empty($this->container->getParameter('mongodb_database'))) {
            return '';
        }

        if (!$shoppingCart) {
            /** @var ShopCartService $shopCartService */
            $shopCartService = $this->container->get('app.shop_cart');
            $shoppingCart = $shopCartService->getShoppingCartByType($type);
        }
        $shoppingCartContent = $shoppingCart ? $shoppingCart->getContent() : null;
        $templatesPath = 'shop_cart/';

        if (empty($shoppingCartContent) && $emptyChunkName) {
            $templateName = $this->getTemplateName($environment, $templatesPath, $emptyChunkName);
            return $environment->render($templateName, [
                'countTotal' => 0,
                'priceTotal' => 0,
                'items' => []
            ]);
        }

        $templateName = $this->getTemplateName($environment, $templatesPath, $chunkName);
        if ($shoppingCart) {
            $shoppingCart->updateTotal();
        }
        $data = [
            'currencySelected' => ShopCartService::getCurrencyCookie(),
            'currency' => $shoppingCart ? $shoppingCart->getCurrency() : '',
            'countTotal' => $shoppingCart ? $shoppingCart->getCount() : 0,
            'countUniqueTotal' => $shoppingCartContent ? count($shoppingCartContent) : 0,
            'priceTotal' => $shoppingCart ? $shoppingCart->getPrice() : 0,
            'type' => $shoppingCart ? $shoppingCart->getType() : '',
            'items' => $shoppingCart ? $shoppingCart->getContentArray($environment) : [],
            'templatePath' => $templatesPath . $chunkName,
            'itemsIds' => $shoppingCart ? $shoppingCart->getContentValues('id') : []
        ];

        return $environment->render($templateName, $data);
    }

    /**
     * @param string $contentTypeName
     * @param string $type
     * @param int $productId
     * @return bool
     */
    public function shopCartProductCountFunction($contentTypeName, $type = 'shop', $productId = 0)
    {
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->container->get('app.shop_cart');
        $shoppingCart = $shopCartService->getShoppingCartByType($type);
        $shoppingCartContent = $shoppingCart ? $shoppingCart->getContent() : null;
        if (!$shoppingCartContent) {
            return 0;
        }
        if (!$productId) {
            return count($shoppingCartContent);
        }

        $count = 0;
        /** @var OrderContent $content */
        foreach ($shoppingCartContent as $content) {
            if ($content->getContentTypeName() == $contentTypeName
                && $content->getId() == (int) $productId) {
                    $count += $content->getCount();
            }
        }

        return $count;
    }

    /**
     * @param string $contentTypeName
     * @param int $productId
     * @return bool
     */
    public function isPaidProductFunction($contentTypeName, $productId)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->container->get('doctrine_mongodb')->getManager();
        $categoryRepository = $dm->getRepository(Order::class);
        $user = $this->getUser();
        if (!$user) {
            return false;
        }
        $countPaid = $categoryRepository->getPaidByProduct($user->getId(), $contentTypeName, $productId);
        return $countPaid > 0;
    }

    /**
     * @param TwigEnvironment $environment
     * @return string
     */
    public function currencyListFunction(TwigEnvironment $environment)
    {
        if (empty($this->container->getParameter('mongodb_database'))) {
                return '';
        }
        $cacheKey = 'currency.list';
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        /** @var FilesystemAdapter $cache */
        $cache = $this->container->get('app.filecache');
        /** @var CacheItemInterface $cacheItemHtml */
        $cacheItemHtml = $cache->getItem($cacheKey);

        if ($cacheItemHtml->isHit()) {
            return $environment->createTemplate($cacheItemHtml->get())->render([]);
        }

        $properties = [
            'data' => $settingsService->getSettingsGroup(Setting::GROUP_CURRENCY)
        ];
        $templateName = 'catalog/currency_list.html.twig';

        if (count($properties['data']) <= 1) {
            $output = '';
        } else {
            $output = $environment->render($templateName, $properties);
        }
        $cacheItemHtml->set($output);
        $cache->save($cacheItemHtml);

        return $output;
    }

    /**
     * @param TwigEnvironment $environment
     * @param string $settingName
     * @param string $templateName
     * @param bool $cacheEnabled
     * @param bool $cacheDataEnabled
     * @param array $data
     * @return string
     */
    public function settingsListFunction(TwigEnvironment $environment, $settingName, $templateName, $cacheEnabled = false, $cacheDataEnabled = false, $data = [])
    {
        if (empty($this->container->getParameter('mongodb_database'))) {
            return '';
        }
        $cacheKey = 'settings.list_' . $settingName;
        $cacheDataKey = 'settings.list_data_' . $settingName;
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        /** @var FilesystemAdapter $cache */
        $cache = $this->container->get('app.filecache');
        /** @var CacheItemInterface $cacheItemHtml */
        $cacheItemHtml = $cacheEnabled ? $cache->getItem($cacheKey) : null;
        /** @var CacheItemInterface $cacheItemData */
        $cacheItemData = $cacheDataEnabled ? $cache->getItem($cacheKey) : null;

        if ($cacheItemHtml && $cacheItemHtml->isHit()) {
            return $environment->createTemplate($cacheItemHtml->get())->render([]);
        }
        if ($cacheItemData && $cacheItemData->isHit()) {
            $settingsData = $cacheItemData->get();
        } else {
            $settingsData = $settingsService->getSettingsGroup($settingName);
            if ($cacheItemData) {
                $cacheItemData->set($settingsData);
                $cache->save($cacheItemData);
            }
        }
        $properties = ['data' => $settingsData];
        $templatePath = 'catalog/' . $templateName . '.html.twig';

        if (count($properties['data']) <= 1) {
            $output = '';
        } else {
            try {
                $output = $environment->render($templatePath, array_merge($data, $properties));
            } catch (\Exception $e) {
                return $this->twigAddError($e->getMessage());
            }
        }
        if ($cacheItemHtml) {
            $cacheItemHtml->set($output);
            $cache->save($cacheItemHtml);
        }

        return $output;
    }

    /**
     * @param $productData
     * @return string
     */
    public function getCartContentFilesString($productData)
    {
        $files = isset($productData['files']) && is_array($productData['files'])
            ? $productData['files']
            : [];
        return OrderContent::getFilesStrFromArray($files);
    }

    /**
     * @param TwigEnvironment $environment
     * @param $path
     * @param $chunkName
     * @param string $chunkNamePrefix
     * @param string $chunkNameSuffix
     * @param string $defaultName
     * @return string
     */
    public function getTemplateName(
        TwigEnvironment $environment,
        $path,
        $chunkName,
        $chunkNamePrefix = '',
        $chunkNameSuffix = '',
        $defaultName = 'default'
    )
    {
        $templateName = sprintf($path . '%s%s%s.html.twig', $chunkNamePrefix, $chunkName, $chunkNameSuffix);
        if (!$environment->getLoader()->exists($templateName)) {
            $templateName = $path . $defaultName . '.html.twig';
        }
        return $templateName;
    }

    /**
     * @param $number
     * @param int|null $decimals
     * @param string $decPoint
     * @param string $thousandsSep
     * @return string
     */
    public function priceFilter($number, $decimals = null, $decPoint = '.', $thousandsSep = ' ')
    {
        if ($decimals === null) {
            $decimals = $number - floor($number) === (float) 0 ? 0 : 2;
        }
        $price = number_format($number, $decimals, $decPoint, $thousandsSep);
        return $price;
    }

    /**
     * @param array|null $itemData
     * @param string $defaultUrl
     * @return string
     */
    public function fileUrlFunction($itemData, $defaultUrl = '')
    {
        if (empty($itemData)) {
            return $defaultUrl;
        }
        $format = !empty($itemData['fileId']) ? '/uploads/%s/%s.%s' : '%s/%s.%s';
        return sprintf(
            $format,
            $itemData['dirPath'],
            $itemData['fileName'],
            $itemData['extension']
        );
    }

    /**
     * @param $pagesOptions
     * @param int $pageNumber
     * @param int $limit
     * @param string $orderBy
     * @return string
     */
    public function pageUrlFunction($pagesOptions, $pageNumber = 0, $limit = 0, $orderBy = '')
    {
        $currentUri = $this->getCurrentURI();
        if (!$orderBy) {
            $orderBy = isset($_GET[$pagesOptions['orderByVar']])
                ? $_GET[$pagesOptions['orderByVar']]
                : 'id_desc';
        }
        if (!$pageNumber) {
            $pageNumber = isset($_GET[$pagesOptions['pageVar']])
                ? $_GET[$pagesOptions['pageVar']]
                : $pagesOptions['current'];
        }
        if (!$limit) {
            $limit = isset($_GET[$pagesOptions['limitVar']])
                ? $_GET[$pagesOptions['limitVar']]
                : $pagesOptions['limit'];
        }
        $output = $currentUri;
        $output .= "?{$pagesOptions['limitVar']}={$limit}";
        $output .= "&{$pagesOptions['pageVar']}={$pageNumber}";
        $output .= "&{$pagesOptions['orderByVar']}={$orderBy}";
        return $output;
    }

    /**
     * @param TwigEnvironment $environment
     * @param $itemData
     * @param $fieldsData
     * @param $fieldBaseName
     * @param string $chunkName
     * @param string $chunkNamePrefix
     * @return string
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public function renderOutputGalleryFunction(TwigEnvironment $environment, $itemData, $fieldsData, $fieldBaseName, $chunkName = 'gallery', $chunkNamePrefix = '')
    {
        $templateName = $this->getTemplateName($environment, 'chunks/fields/', $chunkName, $chunkNamePrefix);

        $fileFields = array_filter($itemData, function($val, $key) use ($fieldBaseName) {
            return ($key === $fieldBaseName || strpos($key, "{$fieldBaseName}__") !== false)
                && is_array($val);
        }, ARRAY_FILTER_USE_BOTH);

        return $environment->render($templateName, [
            'fieldBaseName' => $fieldBaseName,
            'fileFields' => $fileFields
        ]);
    }

    /**
     * @param TwigEnvironment $environment
     * @param int $parentId
     * @param string $chunkName
     * @param array|null $data
     * @param array|null $activeCategoriesIds
     * @param bool $cacheEnabled
     * @param string $activeClassName
     * @return string
     */
    public function categoriesTreeFunction(
        TwigEnvironment $environment,
        $parentId = 0,
        $chunkName = 'menu_tree',
        $data = null,
        $activeCategoriesIds = null,
        $cacheEnabled = false,
        $activeClassName = 'active')
    {
        $request = $this->requestStack->getCurrentRequest();
        $currentUri = substr($request->getPathInfo(), 1);
        $uriArr = UtilsService::getUriArray($currentUri);
        $locale = $request->getLocale();

        $cacheKey = "tree.{$chunkName}.{$locale}";
        /** @var FilesystemAdapter $cache */
        $cache = $this->container->get('app.filecache');
        /** @var CacheItemInterface $cacheItemHtml */
        $cacheItemHtml = $cacheEnabled ? $cache->getItem($cacheKey) : null;
        $output = '';

        if ($data === null) {
            if ($cacheItemHtml && $cacheItemHtml->isHit()) {
                $output = $cacheItemHtml->get();
            } else {
                /** @var CatalogService $catalogService */
                $catalogService = $this->container->get('app.catalog');
                $categoriesTree = $catalogService->getCategoriesTree($parentId, $locale);
                $data = !empty($categoriesTree) ? $categoriesTree[0] : [];
            }
        }

        if (!$output) {
            $templateName = $this->getTemplateName($environment, 'nav/', $chunkName);
            if (empty($data['children'])) {
                return '';
            }
            $data['currentUri'] = $currentUri;
            $data['uriArr'] = $uriArr;
            $data['activeCategoriesIds'] = $activeCategoriesIds;
            try {
                $output = $environment->render($templateName, $data);
            } catch (\Exception $e) {
                $output .= $this->twigAddError($e->getMessage());
            }
            if ($cacheItemHtml) {
                $cacheItemHtml->set($output);
                $cache->save($cacheItemHtml);
            }
        }

        if (!empty($activeCategoriesIds)) {
            $output = str_replace(
                array_map(function($id) {return "active{$id}-"; }, $activeCategoriesIds),
                $activeClassName,
                $output
            );
        }

        return $output;
    }

    /**
     * @param TwigEnvironment $environment
     * @param string $formName
     * @param string|null $layoutPath
     * @param string $varName
     * @return string
     */
    public function renderFormFunction(TwigEnvironment $environment, $formName = '', $layoutPath = null, $varName = 'form')
    {
        if (!$formName) {
            return '';
        }
        /** @var Request $request */
        $request = $this->requestStack->getCurrentRequest();
        /** @var TranslatorInterface $translator */
        $translator = $this->container->get('translator');
        /** @var UtilsService $utilsService */
        $utilsService = $this->container->get('app.utils');
        /** @var FormBuilder $formBuilder */
        $formBuilder = $this->container->get('form.factory')->createBuilder();
        $formOptions = $utilsService->parseYaml($formName, 'forms/');

        if (empty($formOptions) || !is_array($formOptions) || empty($formOptions['fields'])) {
            return '';
        }

        UtilsService::formAddFields($formBuilder, $formOptions['fields']);

        $form = $formBuilder->getForm();
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $emailTo = !empty($formOptions['emailTo'])
                ? $formOptions['emailTo']
                : $this->container->getParameter('app.admin_email');

            if (empty($emailTo)) {

                $form->addError(new FormError($translator->trans('email.recipient_error')));

            } else {

                $formData = $form->getData();
                $emailSubject = !empty($formOptions['emailSubject'])
                    ? $translator->trans($formOptions['emailSubject'])
                    : '';
                if (!empty($formData['subject'])) {
                    $emailSubject .= ($emailSubject ? ' - ' : '') . $formData['subject'];
                }

                $formTextFields = array_filter($formOptions['fields'], function($field) {
                    return !in_array($field['type'], ['SubmitType', 'CaptchaType']);
                });
                $emailBody = $environment->render('email/email_custom_form.html.twig', [
                    'fields' => $formTextFields,
                    'formData' => $formData
                ]);

                if ($utilsService->sendMail($emailSubject, $emailBody, $emailTo)) {
                    $request->getSession()
                        ->getFlashBag()
                        ->add('messages', 'email.send_successful');

                    return '';
                }
            }
        }

        return $environment->render('form/custom_form.html.twig', [
            'form' => $form->createView(),
            'varName' => $varName,
            'layoutPath' => $layoutPath
        ]);
    }

    /**
     * @param array $itemData
     * @param array $fieldsData
     * @param string $chunkName
     * @return string
     */
    public function getFieldNameByChunkFunction($itemData, $fieldsData, $chunkName)
    {
        $fields = array_filter($fieldsData, function($field) use ($chunkName) {
            return $field['outputProperties']['chunkName'] === $chunkName;
        });
        if (empty($fields)) {
            return '';
        }
        $fields = array_merge($fields);
        return !empty($fields) ? $fields[0]['name'] : '';
    }

    /**
     * @param array $dataArr
     * @param string $fieldName
     * @return string
     */
    public function fieldByLocaleFunction($dataArr, $fieldName)
    {
        $request = $this->requestStack->getCurrentRequest();
        $locale = $request->getLocale();
        if (empty($dataArr['translations']) || empty($dataArr['translations'][$fieldName])) {
            return $dataArr[$fieldName] ?? '';
        }
        return isset($dataArr['translations'][$fieldName][$locale])
            ? $dataArr['translations'][$fieldName][$locale]
            : $dataArr[$fieldName] ?? '';
    }

    /**
     * @param $errorMessage
     * @return string
     */
    public function twigAddError($errorMessage)
    {
        if (!empty($this->container->getParameter('app.display_errors'))) {
            $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
            $errorMessage = str_replace($rootPath, '', $errorMessage);
            return sprintf('<div class="alert alert-danger py-1 px-2">%s</div>', $errorMessage);
        }
        return '';
    }

    /**
     * @param mixed $needle
     * @param array $haystack
     * @return int
     */
    public function arraySearchFunction($needle, $haystack)
    {
        $index = array_search($needle, $haystack);
        if ($index === false) {
            return -1;
        }
        return $index;
    }

    /**
     * @param $input
     * @param $caseArr
     * @param $valuesArr
     * @return mixed
     */
    public function switchFunction($input, $caseArr, $valuesArr)
    {
        $index = array_search($input, $caseArr);
        if ($index === false) {
            return end($valuesArr);
        }
        return $valuesArr[$index];
    }

    /**
     * @return string
     */
    public function getCurrentURI()
    {
        $request = $this->requestStack->getCurrentRequest();
        $currentUri = $request->getRequestUri();
        if (strpos($currentUri, '?') !== false) {
            $currentUri = substr($currentUri, 0, strpos($currentUri, '?'));
        }
        return $currentUri;
    }

    public function getUser()
    {
        if (null === $token = $this->container->get('security.token_storage')->getToken()) {
            return null;
        }
        if (!is_object($user = $token->getUser())) {
            return null;
        }
        return $user;
    }
}

