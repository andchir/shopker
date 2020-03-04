<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ExceptionListener
{
    protected $twig;
    protected $container;

    public function __construct(\Twig\Environment $twig, ContainerInterface $container)
    {
        $this->twig = $twig;
        $this->container = $container;
    }

    public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();
        $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
        $environment = $this->container->get('kernel')->getEnvironment();
        $displayErrors = $this->container->hasParameter('app.display_errors')
            ? !empty($this->container->getParameter('app.display_errors'))
            : true;
        $message = '';

        if ($request->get('_route') == 'setup'
            || strpos($request->get('_route'), 'omnipay_') !== false) {
                return;
        }

        $headers = [];
        if ($exception instanceof HttpExceptionInterface) {
            $statusCode = $exception->getStatusCode();
            $headers = $exception->getHeaders();
        } else {
            $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
        }
        if (strpos($exception->getFile(), '/IsGrantedListener') !== false) {
            $message = $this->container->get('translator')->trans($exception->getMessage(), [], 'validators');
        } else if ($environment === 'dev' || $displayErrors) {
            $filePath = str_replace($rootPath, '', $exception->getFile());
            if (strpos($filePath, '/vendor/') !== false) {
                $filePath = substr($filePath, strpos($filePath, '/vendor/'));
            }
            $message = $exception->getMessage() . " - {$filePath} ({$exception->getLine()})";
        }

        if($request->isXmlHttpRequest()) {
            $content = [
                'error' => $message ?: 'Not found.',
                'statusCode' => $statusCode
            ];
        } else {
            $content = $this->twig->render('/errors/404.html.twig', [
                'message' => $message ?: 'Not found.',
                'currentUri' => '404',
                'activeCategoriesIds' => []
            ]);
        }

        if (is_array($content)) {
            $response = new JsonResponse($content);
        } else {
            $response = new Response($content);
        }
        $response->setStatusCode($statusCode);
        if (!empty($headers)) {
            $response->headers->replace($headers);
        }

        $event->setResponse($response);
    }
}
