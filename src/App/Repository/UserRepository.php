<?php

namespace App\Repository;

use App\MainBundle\Document\User;
use Doctrine\ODM\MongoDB\Query\Builder;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * UserRepository
 */
class UserRepository extends BaseRepository implements UserLoaderInterface
{

    /**
     * @param string $email
     * @return array|null|object
     */
    public function loadUserByUsername($email)
    {
        $email = mb_strtolower($email);
        $qb = $this->createQueryBuilder(User::class);
        return $qb
            ->addOr($qb->expr()->field('username')->equals($email))
            ->addOr($qb->expr()->field('email')->equals($email))
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

    /**
     * @param bool $superAdminsOnly
     * @return array
     */
    public function getAdminIds($superAdminsOnly = false)
    {
        $qb = $this->createQueryBuilder();
        if ($superAdminsOnly) {
            $qb->field('roles')->all(['ROLE_SUPER_ADMIN']);
        } else {
            $qb->addOr($qb->expr()->field('roles')->equals('ROLE_ADMIN'));
            $qb->addOr($qb->expr()->field('roles')->equals('ROLE_SUPER_ADMIN'));
        }
        $admins = $qb->getQuery()->toArray();

        $output = array_map(function($admin) {
            /** @var User $admin */
            return $admin->getId();
        }, $admins);

        return array_merge($output);
    }

    /**
     * @param Builder $query
     * @param $searchWord
     */
    public function addSearchQuery(&$query, $searchWord)
    {
        if (!$searchWord) {
            return;
        }
        $query->addOr(
            $query->expr()
                ->addOr($query->expr()->field('fullName')->equals(new \MongoRegex("/{$searchWord}/i")))
                ->addOr($query->expr()->field('email')->equals(new \MongoRegex("/{$searchWord}/i")))
        );
    }
}
