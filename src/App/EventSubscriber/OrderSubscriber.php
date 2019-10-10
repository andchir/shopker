<?php

namespace App\EventSubscriber;

use App\MainBundle\Document\Order;
use App\Events;
use App\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Contracts\Translation\TranslatorInterface;

class OrderSubscriber implements EventSubscriberInterface
{

    /** @var ContainerInterface */
    private $container;

    public function __construct($container) {
        $this->container = $container;
    }

    public static function getSubscribedEvents()
    {
        return [
            Events::ORDER_BEFORE_CREATE => 'onOrderBeforeCreate',
            Events::ORDER_CREATED => 'onOrderCreated',
            Events::ORDER_STATUS_UPDATED => 'onOrderStatusUpdated'
        ];
    }

    public function onOrderBeforeCreate(GenericEvent $event)
    {
        /** @var Order $order */
        $order = $event->getSubject();

        // Do something...

    }

    public function onOrderCreated(GenericEvent $event)
    {
        /** @var Order $order */
        $order = $event->getSubject();

        // Do something...

    }

    /**
     * @param GenericEvent $event
     * @throws \Twig\Error\RuntimeError
     * @throws \Twig\Error\SyntaxError
     */
    public function onOrderStatusUpdated(GenericEvent $event)
    {
        /** @var Order $order */
        $order = $event->getSubject();

        /** @var UtilsService $utilsService */
        $utilsService = $this->container->get('app.utils');
        /** @var TranslatorInterface $translator */
        $translator = $this->container->get('translator');

        $isOrderNew = $order->getCreatedDate()->getTimestamp() === $order->getUpdatedDate()->getTimestamp();
        $emailSubject = $isOrderNew
            ? $this->container->getParameter('app.name') . ' - ' . $translator->trans('mail_subject.new_order')
            : $this->container->getParameter('app.name') . ' - ' . $translator->trans('mail_subject.order_status_change');

        $utilsService->orderSendMail(
            $emailSubject,
            $order
        );

        // Sending a notification to the admin
        if ($isOrderNew || $order->getIsPaid()) {
            $utilsService->orderSendMail(
                $emailSubject,
                $order,
                'adminNotify',
                $this->container->getParameter('app.admin_email')
            );
        }
    }
}

