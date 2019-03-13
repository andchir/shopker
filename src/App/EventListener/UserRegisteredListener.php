<?php

namespace App\EventListener;

use App\MainBundle\Document\User;
use App\Event\UserRegisteredEvent;
use Symfony\Component\DependencyInjection\ContainerInterface;

class UserRegisteredListener
{
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function setContainer(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param UserRegisteredEvent $event
     */
    public function onCalled(UserRegisteredEvent $event)
    {
        /** @var User $user */
        $user = $event->getUser();

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->container->get('doctrine_mongodb')->getManager();

        // $user->setIsActive(false);

        // $dm->flush();
    }

}
