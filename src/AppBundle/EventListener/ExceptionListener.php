<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ExceptionListener
{
    protected $twig;
    protected $container;

    public function __construct(\Twig_Environment $twig, ContainerInterface $container)
    {
        $this->twig = $twig;
        $this->container = $container;
    }

    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();
        $request = $event->getRequest();
        $environment = $this->container->get('kernel')->getEnvironment();
        $message = '';

        $headers = [];
        if ($exception instanceof HttpExceptionInterface) {
            $statusCode = $exception->getStatusCode();
            $headers = $exception->getHeaders();
        } else {
            $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
        }
        if ($environment === 'dev') {
            $message = $exception->getMessage();
        }

        if($request->isXmlHttpRequest()) {
            $content = [
                'error' => $message ?: 'Not found.',
                'statusCode' => $statusCode
            ];
        } else {
            $content = $this->twig->render('/errors/404.html.twig', [
                'message' => $message
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
