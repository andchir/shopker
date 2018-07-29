<?php

namespace AppBundle\EventListener;

use AppBundle\Event\CategoryUpdatedEvent;
use AppBundle\Event\UserRegisteredEvent;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\DependencyInjection\ContainerInterface;

class KernelEventListener
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param GetResponseEvent $event
     */
    public function onKernelRequest(GetResponseEvent $event)
    {
        $dispatcher = $this->container->get('event_dispatcher');

        //Add events listeners
        $categoryUpdateListener = new CategoryUpdateListener();
        $dispatcher->addListener(CategoryUpdatedEvent::NAME, [$categoryUpdateListener, 'onUpdated']);

        $userRegisteredListener = new UserRegisteredListener($this->container);
        $dispatcher->addListener(UserRegisteredEvent::NAME, [$userRegisteredListener, 'onCalled']);
    }

}

