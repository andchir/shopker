<?php

namespace AppBundle;

final class Events
{
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const ORDER_CREATED = 'order.created';
}
