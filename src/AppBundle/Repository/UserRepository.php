<?php

namespace AppBundle\Repository;

use AppBundle\AppBundle;
use AppBundle\Document\User;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * UserRepository
 */
class UserRepository extends DocumentRepository implements UserLoaderInterface
{

    public function loadUserByUsername($username)
    {
        $qb = $this->createQueryBuilder(User::class);
        return $qb
            ->addOr($qb->expr()->field('username')->equals($username))
            ->addOr($qb->expr()->field('email')->equals($username))
            ->getQuery()
            ->getSingleResult();
    }

}
