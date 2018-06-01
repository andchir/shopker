<?php

namespace AppBundle\Service;

use Symfony\Component\DependencyInjection\ContainerInterface;

class UtilsService
{
    /** @var ContainerInterface */
    protected $container;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param $subject
     * @param $mailBody
     * @param $toEmail
     * @return int
     */
    public function sendMail($subject, $mailBody, $toEmail)
    {
        /** @var \Swift_Mailer $mailer */
        $mailer = $this->container->get('mailer');
        $message = (new \Swift_Message($subject))
        //$message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom($this->container->getParameter('mailer_user'), $this->container->getParameter('app_name'))
            ->setTo($toEmail)
            ->setBody(
                $mailBody,
                'text/html'
            );

        return $mailer->send($message);
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
