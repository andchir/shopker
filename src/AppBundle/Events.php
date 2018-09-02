<?php

namespace AppBundle;

final class Events
{
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const PRODUCT_CREATED = 'product.deleted';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const PRODUCT_DELETED = 'product.deleted';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const ORDER_CREATED = 'order.created';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const ORDER_DELETED = 'order.deleted';
}
