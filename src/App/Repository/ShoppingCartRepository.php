<?php

namespace App\Repository;

use Doctrine\ODM\MongoDB\Repository\DocumentRepository;
use Doctrine\ODM\MongoDB\Query\Builder;

/**
 * ShoppingCartRepositoryy
 */
class ShoppingCartRepository extends DocumentRepository
{

    /**
     * @param string $type
     * @param int|null $userId
     * @param int|null $sessionId
     * @return array|null|object
     */
    public function findByUserOrSession($type, $userId, $sessionId)
    {
        $qb = $this->createQueryBuilder();
        if ($userId && $sessionId) {
            $qb
                ->addOr($qb->expr()->field('ownerId')->equals($userId))
                ->addOr($qb->expr()->field('sessionId')->equals($sessionId));
        } else if ($userId) {
            $qb->field('ownerId')->equals($userId);
        } else if ($sessionId) {
            $qb->field('sessionId')->equals($sessionId);
        }
        $qb->addAnd($qb->expr()->field('type')->equals($type));
        return $qb->getQuery()->getSingleResult();
    }

    /**
     * @param $date_timezone
     * @return mixed
     */
    public function findExpired($date_timezone)
    {
        $dateTime = new \DateTime('now', new \DateTimeZone($date_timezone));
        $qb = $this->createQueryBuilder();
        $qb->field('expiresOn')->exists(true);
        $qb->field('expiresOn')->lte($dateTime);
        return $qb->getQuery()->execute();
    }

}
