<?php

namespace App\EventListener;

use App\MainBundle\Document\ShoppingCart;
use App\MainBundle\Document\User;
use App\Service\ShopCartService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class LoginListener
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function onSecurityInteractiveLogin(InteractiveLoginEvent $event)
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->container->get('doctrine_mongodb')->getManager();
        /** @var User $user */
        $user = $event->getAuthenticationToken()->getUser();

        // Update shopping cart owner ID
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->container->get('app.shop_cart');
        $sessionId = $shopCartService->getSessionId();

        $shoppingCartRepository = $dm->getRepository(ShoppingCart::class);
        $shoppingCarts = $shoppingCartRepository->findBy([
            'sessionId' => $sessionId
        ]);
        if (!empty($shoppingCarts)) {
            /** @var ShoppingCart $shoppingCart */
            foreach ($shoppingCarts as $shoppingCart) {
                $shoppingCart->setOwnerId($user->getId());
            }
            $dm->flush();
        }
    }
}
