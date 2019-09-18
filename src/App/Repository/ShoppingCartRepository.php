<?php

namespace App\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;
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
        return $qb->getQuery()->getSingleResult();
    }
}
