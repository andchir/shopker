<?php

namespace AppBundle\Repository;

use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * UserRepository
 */
class UserRepository extends DocumentRepository implements UserLoaderInterface
{

    public function loadUserByUsername($username)
    {
        return $this->findOneBy(['email' => $username]);
    }

}