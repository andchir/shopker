<?php

namespace App\Repository;

use App\MainBundle\Document\User;
use Doctrine\Bundle\MongoDBBundle\Repository\ServiceDocumentRepository;
use Doctrine\Bundle\MongoDBBundle\ManagerRegistry;
use Doctrine\ODM\MongoDB\Query\Builder;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

/**
 * UserRepository
 */
class UserRepository extends ServiceDocumentRepository implements UserLoaderInterface
{
    use BaseRepositoryTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @param string $id
     * @return object|\Symfony\Component\Security\Core\User\UserInterface|null
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function loadUserByIdentifier($userIdentifier)
    {
        return $this->findOneBy([
            'id' => (int) $userIdentifier,
            'isActive' => true
        ]);
    }

    /**
     * @param string $id
     * @return object|\Symfony\Component\Security\Core\User\UserInterface|null
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function loadUserByApiToken($userIdentifier)
    {
        return $this->findOneBy([
            'apiToken' => $userIdentifier,
            'isActive' => true
        ]);
    }

    /**
     * @param string $email
     * @return array|null|object
     */
    public function loadUserByUsername(string $email)
    {
        $email = mb_strtolower($email);
        $qb = $this->createQueryBuilder();
        return $qb
            ->addAnd(
                $qb->expr()
                    ->addOr($qb->expr()->field('username')->equals($email))
                    ->addOr($qb->expr()->field('email')->equals($email))
            )
            ->addAnd($qb->expr()->field('isActive')->equals(true))
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
            ->count()
            ->getQuery()
            ->execute();
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
                ->addOr($query->expr()->field('fullName')->equals(new \MongoDB\BSON\Regex("{$searchWord}", "i")))
                ->addOr($query->expr()->field('email')->equals(new \MongoDB\BSON\Regex("{$searchWord}", "i")))
        );
    }
}
