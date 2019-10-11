<?php

namespace App\Service;

use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Order;
use App\MainBundle\Document\Setting;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormBuilder;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

class UtilsService
{
    /** @var ContainerInterface */
    protected $container;

    /** @var \Twig\Environment */
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
            ->setSubject($subject)
            ->setFrom(
                $this->container->getParameter('mailer_user'),
                $this->container->getParameter('app.name')
            )
            ->setTo($toEmail)
            ->setReplyTo(
                !empty($this->container->getParameter('app.admin_email'))
                    ? $this->container->getParameter('app.admin_email')
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
     * @param string $templateName
     * @param string $emailTo
     * @return bool
     * @throws \Twig\Error\RuntimeError
     * @throws \Twig\Error\SyntaxError
     */
    public function orderSendMail($emailSubject, Order $order, $templateName = '', $emailTo = '')
    {
        if (!$templateName) {
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
        }
        $templatePath = "email/email_order_{$templateName}.html.twig";
        if (!$emailTo) {
            $emailTo = $order->getEmail();
        }
        if (!$emailTo) {
            return false;
        }
        try {
            $emailBody = $this->twig->render($templatePath, array(
                'order' => $order
            ));
        } catch (\Twig\Error\LoaderError $e) {
            return false;
        }
        $this->sendMail($emailSubject, $emailBody, $emailTo);

        return true;
    }

    /**
     * @param array $queryOptions
     * @param int $itemsTotal
     * @param array $catalogNavSettingsDefaults
     * @param array $options
     * @return array
     * @internal param array $pageSizeArr
     */
    public static function getPagesOptions($queryOptions, $itemsTotal, $catalogNavSettingsDefaults = [], $options = [])
    {
        $pagesOptions = [
            'pageSizeArr' => isset($catalogNavSettingsDefaults['pageSizeArr'])
                ? $catalogNavSettingsDefaults['pageSizeArr']
                : [12],
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
     * @param array $catalogNavSettingsDefaults
     * @param array $options
     * @return array
     * @internal param array $pageSizeArr
     */
    public static function getQueryOptions($currentUri, $queryString, $contentTypeFields = [], $catalogNavSettingsDefaults = [], $options = [])
    {
        $queryOptionsDefault = [
            'uri' => '',
            'page' => 1,
            'limit' => isset($catalogNavSettingsDefaults['pageSizeArr'])
                ? $catalogNavSettingsDefaults['pageSizeArr'][0]
                : 12,
            'limit_max' => 100,
            'sort_by' => 'id',
            'sort_dir' => 'desc',
            'order_by' => isset($catalogNavSettingsDefaults['orderBy'])
                ? $catalogNavSettingsDefaults['orderBy']
                : 'id_desc',
            'full' => 1,
            'only_active' => 1,
            'filter' => [],
            'filterStr' => ''
        ];

        parse_str($queryString, $queryOptions);

        if (!empty($options['pageVar'])) {
            $queryOptions['page'] = isset($queryOptions[$options['pageVar']])
                ? $queryOptions[$options['pageVar']]
                : $queryOptionsDefault['page'];
        }
        if (!empty($options['limitVar'])) {
            $queryOptions['limit'] = isset($queryOptions[$options['limitVar']])
                ? $queryOptions[$options['limitVar']]
                : $queryOptionsDefault['limit'];
        }

        $queryOptions['uri'] = $currentUri;

        // Sorting
        if (empty($queryOptions['order_by'])) {
            $queryOptions['order_by'] = $queryOptionsDefault['order_by'];
        }
        if (empty($queryOptions['sort_by']) && strpos($queryOptions['order_by'], '_') !== false) {
            $pos = strrpos($queryOptions['order_by'], '_');
            $queryOptions['sort_by'] = substr($queryOptions['order_by'], 0, $pos);
            $queryOptions['sort_dir'] = substr($queryOptions['order_by'], $pos + 1);
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

        // Sorting options
        $queryOptions['sortOptions'] = [];
        $queryOptions['sortOptionsAggregation'] = [];
        foreach ($queryOptions['sort_by'] as $ind => $sortByName) {
            $queryOptions['sortOptions'][$sortByName] = isset($queryOptions['sort_dir'][$ind])
                ? $queryOptions['sort_dir'][$ind]
                : $queryOptions['sort_dir'][0];
            $queryOptions['sortOptionsAggregation'][$sortByName] = $queryOptions['sortOptions'][$sortByName] == 'asc' ? 1 : -1;
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
        if (!empty($queryOptions['query']) && !is_array($queryOptions['query'])) {
            $queryOptions['filterStr'] = '&' . http_build_query(['query' => $queryOptions['query']]);
        }

        return $queryOptions;
    }

    /**
     * Download file
     *
     * @param string $filePath
     * @param string $fileName
     * @return Response
     */
    public static function downloadFile($filePath, $fileName = ''){

        if(!file_exists($filePath)) {
            return new Response('File not found.', Response::HTTP_NOT_FOUND);
        }

        $pathInfo = pathinfo($filePath);

        if(!$fileName){
            $fileName = $pathInfo['filename'];
            $fileName = str_replace('%', '', $fileName);
            $fileName .= '.' . $pathInfo['extension'];
        }
        if (strpos($fileName, '.' . $pathInfo['extension']) === false) {
            $fileName .= '.' . $pathInfo['extension'];
        }
        $fileName = preg_replace('~[\\\/]+~', '', $fileName);

        $response = new BinaryFileResponse($filePath);
        $disposition = $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $fileName,
            self::toAscii($fileName)
        );
        $response->headers->set('Content-Disposition', $disposition);

        return $response;
    }

    /**
     * Converts UTF-8 string to ASCII.
     * @param $s
     * @return string
     */
    public static function toAscii($s)
    {
        static $transliterator = null;
        if ($transliterator === null && class_exists('Transliterator', false)) {
            $transliterator = \Transliterator::create('Any-Latin; Latin-ASCII');
        }
        $s = preg_replace('#[^\x09\x0A\x0D\x20-\x7E\xA0-\x{2FF}\x{370}-\x{10FFFF}]#u', '', $s);
        $s = strtr($s, '`\'"^~?', "\x01\x02\x03\x04\x05\x06");
        $s = str_replace(
            ["\u{201E}", "\u{201C}", "\u{201D}", "\u{201A}", "\u{2018}", "\u{2019}", "\u{B0}"],
            ["\x03", "\x03", "\x03", "\x02", "\x02", "\x02", "\x04"], $s
        );
        if ($transliterator !== null) {
            $s = $transliterator->transliterate($s);
        }
        if (ICONV_IMPL === 'glibc') {
            $s = str_replace(
                ["\u{BB}", "\u{AB}", "\u{2026}", "\u{2122}", "\u{A9}", "\u{AE}"],
                ['>>', '<<', '...', 'TM', '(c)', '(R)'], $s
            );
            $s = iconv('UTF-8', 'WINDOWS-1250//TRANSLIT//IGNORE', $s);
            $s = strtr($s, "\xa5\xa3\xbc\x8c\xa7\x8a\xaa\x8d\x8f\x8e\xaf\xb9\xb3\xbe\x9c\x9a\xba\x9d\x9f\x9e"
                . "\xbf\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3"
                . "\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8"
                . "\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf8\xf9\xfa\xfb\xfc\xfd\xfe"
                . "\x96\xa0\x8b\x97\x9b\xa6\xad\xb7",
                'ALLSSSSTZZZallssstzzzRAAAALCCCEEEEIIDDNNOOOOxRUUUUYTsraaaalccceeeeiiddnnooooruuuuyt- <->|-.');
            $s = preg_replace('#[^\x00-\x7F]++#', '', $s);
        } else {
            $s = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
        }
        $s = str_replace(['`', "'", '"', '^', '~', '?'], '', $s);
        return strtr($s, "\x01\x02\x03\x04\x05\x06", '`\'"^~?');
    }

    /**
     * @param string $yamlFileName
     * @param string $path
     * @return array|mixed
     */
    public function parseYaml($yamlFileName, $path = '')
    {
        $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
        $ymlFilePath = $rootPath . DIRECTORY_SEPARATOR . "config/resources/{$path}{$yamlFileName}.yaml";
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
            $options = array_filter($field, function($k) {
                return !in_array($k, ['name', 'type']);
            }, ARRAY_FILTER_USE_KEY);
            if (!in_array($field['type'], ['SubmitType', 'CaptchaType'])) {
                $options['required'] = !empty($field['required']);
            }
            if (!empty($options['choices']) && is_array($options['choices'])) {
                $options['choices'] = array_combine($options['choices'], $options['choices']);
            }
            $formBuilder->add(
                $field['name'],
                $classPath,
                $options
            );
        }
    }

    /**
     * @param $string
     * @return array
     */
    public static function stringToArray($string)
    {
        $output = $string ? explode(',', $string) : [];
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
     * Get file extension
     * @param string $filePath
     * @return string
     */
    public static function getExtension($filePath)
    {
        $temp_arr = $filePath ? explode('.', $filePath) : [];
        $ext = !empty($temp_arr) ? end($temp_arr) : '';
        return strtolower($ext);
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
