<?php

namespace App\Repository;

use App\MainBundle\Document\User;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * UserRepository
 */
class UserRepository extends BaseRepository implements UserLoaderInterface
{

    /**
     * @param string $username
     * @return array|null|object
     */
    public function loadUserByUsername($username)
    {
        $qb = $this->createQueryBuilder(User::class);
        return $qb
            ->addOr($qb->expr()->field('username')->equals($username))
            ->addOr($qb->expr()->field('email')->equals($username))
            ->getQuery()
            ->getSingleResult();
    }

    /**
     * @param $fieldName
     * @param $value
     * @return mixed
     */
    public function getUsersCountBy($fieldName, $value)
    {
        return $this->createQueryBuilder()
            ->field($fieldName)->equals($value)
            ->getQuery()
            ->execute()
            ->count();
    }

}
