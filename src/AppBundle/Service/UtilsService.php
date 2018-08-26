<?php

namespace AppBundle\Service;

use AppBundle\Document\ContentType;
use AppBundle\Document\Order;
use AppBundle\Document\Setting;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormBuilder;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

class UtilsService
{
    /** @var ContainerInterface */
    protected $container;

    /** @var \Twig_Environment */
    protected $twig;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->twig = $this->container->get('twig');
    }

    /**
     * Send mail
     * @param $subject
     * @param $mailBody
     * @param $toEmail
     * @return bool|int
     */
    public function sendMail($subject, $mailBody, $toEmail)
    {
        if (empty($this->container->getParameter('mailer_user'))) {
            return false;
        }
        /** @var \Swift_Mailer $mailer */
        $mailer = $this->container->get('mailer');
        $message = (new \Swift_Message($subject))
        //$message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom(
                $this->container->getParameter('mailer_user'),
                $this->container->getParameter('app_name')
            )
            ->setTo($toEmail)
            ->setReplyTo(
                !empty($this->container->getParameter('admin_email'))
                    ? $this->container->getParameter('admin_email')
                    : $this->container->getParameter('mailer_user')
            )
            ->setBody(
                $mailBody,
                'text/html'
            );

        return $mailer->send($message);
    }

    /**
     * Send mail order status
     * @param $emailSubject
     * @param Order $order
     * @return bool
     */
    public function orderSendMail($emailSubject, Order $order)
    {
        if (!$order->getEmail()) {
            return false;
        }

        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        $orderStatusSettings = $settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);

        $orderStatus = $order->getStatus();
        $statusSetting = array_filter($orderStatusSettings, function($setting) use ($orderStatus) {
            /** @var Setting $setting */
            return $setting->getName() == $orderStatus;
        });

        if (empty($statusSetting)) {
            return false;
        }

        $statusSetting = current($statusSetting);

        /** @var Setting $statusSetting */
        $settingOptions = $statusSetting->getOptions();
        $templateName = $settingOptions['template']['value'];
        if (empty($templateName)) {
            return false;
        }

        $templatePath = "email/email_order_{$templateName}.html.twig";

        $emailBody = $this->twig->render($templatePath, array(
            'order' => $order
        ));

        $this->sendMail($emailSubject, $emailBody, $order->getEmail());

        return true;
    }

    /**
     * @param array $queryOptions
     * @param int $itemsTotal
     * @param array $pageSizeArr
     * @param array $options
     * @return array
     */
    public static function getPagesOptions($queryOptions, $itemsTotal, $pageSizeArr = [10], $options = [])
    {
        $pagesOptions = [
            'pageSizeArr' => $pageSizeArr,
            'current' => $queryOptions['page'],
            'limit' => $queryOptions['limit'],
            'total' => ceil($itemsTotal / $queryOptions['limit']),
            'prev' => max(1, $queryOptions['page'] - 1),
            'skip' => ($queryOptions['page'] - 1) * $queryOptions['limit'],
            'pageVar' => isset($options['pageVar']) ? $options['pageVar'] : 'page',
            'limitVar' => isset($options['limitVar']) ? $options['limitVar'] : 'limit',
            'orderByVar' => isset($options['orderByVar']) ? $options['orderByVar'] : 'order_by'
        ];
        $pagesOptions['next'] = min($pagesOptions['total'], $queryOptions['page'] + 1);

        return $pagesOptions;
    }

    /**
     * @param string $currentUri
     * @param string $queryString
     * @param array $contentTypeFields
     * @param array $pageSizeArr
     * @param array $options
     * @return array
     */
    public static function getQueryOptions($currentUri, $queryString, $contentTypeFields = [], $pageSizeArr = [10], $options = [])
    {
        $queryOptionsDefault = [
            'uri' => '',
            'page' => 1,
            'limit' => $pageSizeArr[0],
            'limit_max' => 100,
            'sort_by' => '_id',
            'sort_dir' => 'desc',
            'order_by' => 'id_desc',
            'full' => 1,
            'only_active' => 1,
            'filter' => [],
            'filterStr' => ''
        ];
        parse_str($queryString, $queryOptions);
        if (isset($options['pageVar']) && isset($queryOptions[$options['pageVar']])) {
            $queryOptions['page'] = $queryOptions[$options['pageVar']];
        }
        if (isset($options['limitVar']) && isset($queryOptions[$options['limitVar']])) {
            $queryOptions['limit'] = $queryOptions[$options['limitVar']];
        }

        $queryOptions['uri'] = $currentUri;
        if (!empty($queryOptions['order_by']) && strpos($queryOptions['order_by'], '_') !== false) {
            $orderByArr = explode('_', $queryOptions['order_by']);
            if (empty($queryOptions['sort_by'])) {
                $queryOptions['sort_by'] = $orderByArr[0];
            }
            if (empty($queryOptions['sort_dir'])) {
                $queryOptions['sort_dir'] = $orderByArr[1];
            }
        }

        $queryOptions = array_merge($queryOptionsDefault, $queryOptions);

        //Field names array
        $fieldNames = [];
        if (!empty($contentTypeFields)) {
            $fieldNames = array_column($contentTypeFields, 'name');
            $fieldNames[] = '_id';
        }

        if($queryOptions['sort_by'] == 'id'){
            $queryOptions['sort_by'] = '_id';
        }

        $queryOptions['sort_by'] = self::stringToArray($queryOptions['sort_by']);
        if (!empty($fieldNames)) {
            $queryOptions['sort_by'] = self::arrayFilter($queryOptions['sort_by'], $fieldNames);
        }
        $queryOptions['sort_dir'] = self::stringToArray($queryOptions['sort_dir']);
        $queryOptions['sort_dir'] = self::arrayFilter($queryOptions['sort_dir'], ['asc', 'desc']);

        if(empty($queryOptions['sort_by'])){
            $queryOptions['sort_by'] = [$queryOptionsDefault['sort_by']];
        }
        if(empty($queryOptions['sort_dir'])){
            $queryOptions['sort_dir'] = [$queryOptionsDefault['sort_dir']];
        }

        // Sorting options
        $queryOptions['sortOptions'] = [];
        foreach ($queryOptions['sort_by'] as $ind => $sortByName) {
            $queryOptions['sortOptions'][$sortByName] = isset($queryOptions['sort_dir'][$ind])
                ? $queryOptions['sort_dir'][$ind]
                : $queryOptions['sort_dir'][0];
        }

        if(!is_numeric($queryOptions['limit'])){
            $queryOptions['limit'] = $queryOptionsDefault['limit'];
        }
        if(!is_numeric($queryOptions['page'])){
            $queryOptions['page'] = $queryOptionsDefault['page'];
        }
        $queryOptions['limit'] = min(abs(intval($queryOptions['limit'])), $queryOptions['limit_max']);
        $queryOptions['page'] = abs(intval($queryOptions['page']));

        if (!empty($queryOptions['filter']) && is_array($queryOptions['filter'])) {
            $queryOptions['filterStr'] = '&' . http_build_query(['filter' => $queryOptions['filter']]);
        }

        return $queryOptions;
    }

    /**
     * @param string $yamlFileName
     * @param string $path
     * @return array|mixed
     */
    public function parseYaml($yamlFileName, $path)
    {
        $rootPath = $this->container->getParameter('kernel.root_dir');
        $ymlFilePath = $rootPath . DIRECTORY_SEPARATOR . "Resources/{$path}{$yamlFileName}.yml";
        $output = [];
        if (file_exists($ymlFilePath)) {
            try {
                $output = Yaml::parse(file_get_contents($ymlFilePath));
            } catch (ParseException $e) {
                return [];
            }
        }
        return $output;
    }

    /**
     * @param FormBuilder $formBuilder
     * @param array $fields
     */
    public static function formAddFields(FormBuilder $formBuilder, $fields)
    {
        $formTypeClassPath = 'Symfony\Component\Form\Extension\Core\Type\\';
        $formCaptchaTypeClassPath = 'Gregwar\CaptchaBundle\Type\\';
        $fieldDefaults = [
            'type' => 'TextType',
            'label' => '',
            'attr' => []
        ];
        foreach ($fields as $field) {
            $field = array_merge($fieldDefaults, $field);
            $classPath = $field['type'] == 'CaptchaType'
                ? "{$formCaptchaTypeClassPath}{$field['type']}"
                : "{$formTypeClassPath}{$field['type']}";
            $formBuilder->add(
                $field['name'],
                $classPath,
                [
                    'label' => $field['label'],
                    'attr' => $field['attr']
                ]
            );
        }
    }

    /**
     * @param $string
     * @return array
     */
    public static function stringToArray($string)
    {
        $output = explode(',', $string);
        return array_map('trim', $output);
    }

    /**
     * @param array $inputArr
     * @param array $targetArr
     * @return array
     */
    public static function arrayFilter($inputArr, $targetArr)
    {
        return array_filter($inputArr, function($val) use ($targetArr) {
            return in_array($val, $targetArr);
        });
    }

    /**
     * @param $uri
     * @return array
     */
    public static function getUriArray($uri)
    {
        $output = [$uri];
        while (!empty($uri)) {
            $index = strrpos(trim($uri, '/'), '/');
            if ($index === false) {
                array_push($output, $uri);
                $uri = '';
            } else {
                $uri = substr($uri, 0, $index + 1);
                array_push($output, $uri);
            }
        }
        return array_unique($output);
    }

    /**
     * @param int $length
     * @return string
     */
    public static function generatePassword($length = 8) {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $count = mb_strlen($chars);
        for ($i = 0, $result = ''; $i < $length; $i++) {
            $index = rand(0, $count - 1);
            $result .= mb_substr($chars, $index, 1);
        }
        return $result;
    }

    /**
     * @param $bytes
     * @param string $unit
     * @param int $decimals
     * @return string
     */
    static function sizeFormat($bytes, $unit = "", $decimals = 2)
    {
        $units = array(
            'B' => 0,
            'KB' => 1,
            'MB' => 2,
            'GB' => 3,
            'TB' => 4,
            'PB' => 5,
            'EB' => 6,
            'ZB' => 7,
            'YB' => 8
        );
        $value = 0;
        if ($bytes > 0) {
            if (!array_key_exists($unit, $units)) {
                $pow = floor(log($bytes) / log(1024));
                $unit = array_search($pow, $units);
            }
            $value = ($bytes / pow(1024, floor($units[$unit])));
        }
        if (!is_numeric($decimals) || $decimals < 0) {
            $decimals = 2;
        }
        return sprintf('%.' . $decimals . 'f ' . $unit, $value);
    }

}
