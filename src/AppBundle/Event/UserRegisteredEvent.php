<?php

namespace AppBundle\Event;

use AppBundle\Document\User;
use Symfony\Component\EventDispatcher\Event;
use AppBundle\Document\Category;
use Symfony\Component\DependencyInjection\ContainerInterface;

class UserRegisteredEvent extends Event
{
    const NAME = 'user.registered';

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }

}
