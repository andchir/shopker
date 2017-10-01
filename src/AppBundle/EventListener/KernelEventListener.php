<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use AppBundle\Event\CategoryUpdatedEvent;
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

    }

}

