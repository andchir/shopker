<?php

namespace App\EventListener;

use App\Event\CategoryUpdatedEvent;
use App\Event\UserRegisteredEvent;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class KernelEventListener
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param RequestEvent $event
     */
    public function onKernelRequest(RequestEvent $event)
    {
        $dispatcher = $this->container->get('event_dispatcher');

        //Add events listeners
        $categoryUpdateListener = new CategoryUpdateListener();
        $dispatcher->addListener(CategoryUpdatedEvent::NAME, [$categoryUpdateListener, 'onUpdated']);

        $userRegisteredListener = new UserRegisteredListener($this->container);
        $dispatcher->addListener(UserRegisteredEvent::NAME, [$userRegisteredListener, 'onCalled']);
    }

}

