<?php

namespace App\Twig;

use App\MainBundle\Document\OrderContent;
use App\MainBundle\Document\Setting;
use App\MainBundle\Document\ShoppingCart;
use App\Service\SettingsService;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormBuilder;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Cache\Simple\FilesystemCache;
use Symfony\Component\Translation\TranslatorInterface;
use Twig\Environment as TwigEnvironment;

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
            'priceTotal' => $shoppingCart ? $shoppingCart->getPrice() : 0,
            'type' => $shoppingCart ? $shoppingCart->getType() : '',
            'items' => $shoppingCart ? $shoppingCart->getContentArray($environment) : [],
            'templatePath' => $templatesPath . $chunkName
        ];

        return $environment->render($templateName, $data);
    }

    /**
     * @param int $productId
     * @param string $contentTypeName
     * @param string $type
     * @return bool
     */
    public function shopCartProductCountFunction($productId, $contentTypeName, $type = 'shop')
    {
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->container->get('app.shop_cart');
        $shoppingCart = $shopCartService->getShoppingCartByType($type);
        $shoppingCartContent = $shoppingCart ? $shoppingCart->getContent() : null;
        if (!$shoppingCartContent) {
            return 0;
        }

        $count = 0;
        /** @var OrderContent $content */
        foreach ($shoppingCartContent as $content) {
            if ($content->getContentTypeName() !== $contentTypeName
                || $productId !== $content->getId()) {
                continue;
            }
            $count += $content->getCount();
        }
        return $count;
    }

    /**
     * @param TwigEnvironment $environment
     * @return string
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \Throwable
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public function currencyListFunction(TwigEnvironment $environment)
    {
        if (empty($this->container->getParameter('mongodb_database'))) {
                return '';
        }
        $cacheKey = 'currency.list';
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');

        if ($cache->has($cacheKey)) {
            return $environment->createTemplate($cache->get($cacheKey))->render([]);
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
        $cache->set($cacheKey, $output, 60*60*24);

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
        return sprintf(
            '/uploads/%s/%s.%s',
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
     * @param string $formName
     * @param string|null $layoutPath
     * @param string $varName
     * @return string
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
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
}

