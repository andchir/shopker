<?php

namespace AppBundle\Service;

use AppBundle\Document\Order;
use AppBundle\Document\Setting;
use Symfony\Component\DependencyInjection\ContainerInterface;

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
     * @return array
     */
    public static function getPagesOptions($queryOptions, $itemsTotal, $pageSizeArr = [10])
    {
        $pagesOptions = [
            'pageSizeArr' => $pageSizeArr,
            'current' => $queryOptions['page'],
            'limit' => $queryOptions['limit'],
            'total' => ceil($itemsTotal / $queryOptions['limit']),
            'prev' => max(1, $queryOptions['page'] - 1),
            'skip' => $skip = ($queryOptions['page'] - 1) * $queryOptions['limit']
        ];
        $pagesOptions['next'] = min($pagesOptions['total'], $queryOptions['page'] + 1);

        return $pagesOptions;
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

}
