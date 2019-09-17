<?php

namespace App;

final class Events
{
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const PRODUCT_CREATED = 'product.created';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const PRODUCT_UPDATED = 'product.updated';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const PRODUCT_DELETED = 'product.deleted';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const ORDER_BEFORE_CREATE = 'order.before_create';
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
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const ORDER_STATUS_UPDATED = 'order.status_updated';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const USER_EMAIL_CONFIRMED = 'user.email_confirmed';
    /**
     * @Event("Symfony\Component\EventDispatcher\GenericEvent")
     * @var string
     */
    const SHOPPING_CART_ADD_PRODUCT = 'shopping_cart.add_product';
}
