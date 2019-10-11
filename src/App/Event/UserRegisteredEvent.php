<?php

namespace App\Event;

use App\MainBundle\Document\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\EventDispatcher\Event;

class UserRegisteredEvent extends Event
{
    const NAME = 'user.registered';

    protected $user;
    protected $request;

    public function __construct(User $user, Request $request)
    {
        $this->user = $user;
        $this->request = $request;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getRequest()
    {
        return $this->request;
    }

}
