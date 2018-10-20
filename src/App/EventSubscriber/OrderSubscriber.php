<?php

namespace App\EventSubscriber;

use App\MainBundle\Document\Order;
use App\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class OrderSubscriber implements EventSubscriberInterface
{

    public static function getSubscribedEvents()
    {
        return [
            Events::ORDER_CREATED => 'onOrderCreated',
        ];
    }

    public function onOrderCreated(GenericEvent $event)
    {
        /** @var Order $order */
        $order = $event->getSubject();

    }
}

