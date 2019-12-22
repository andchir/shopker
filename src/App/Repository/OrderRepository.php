<?php

namespace App\Repository;

use Andchir\OmnipayBundle\Repository\OrderRepositoryInterface;
use Doctrine\ODM\MongoDB\Query\Builder;
use Doctrine\ORM\ORMInvalidArgumentException;

/**
 * OrderRepository
 */
class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{

    /**
     * @param $id
     * @param $userId
     * @return object
     */
    public function getOneByUser($id, $userId)
    {
        if (!$userId) {
            throw new ORMInvalidArgumentException('User ID is not set.');
        }
        return $this->findOneBy([
            'id' => $id,
            'userId' => $userId
        ]);
    }

    /**
     * @param $userId
     * @param int $skip
     * @param int $limit
     * @return \Doctrine\ODM\MongoDB\Cursor
     */
    public function getAllByUserId($userId, $skip = 0, $limit = 100)
    {
        if (!$userId) {
            throw new ORMInvalidArgumentException('User ID is not set.');
        }

        $query = $this->createQueryBuilder();

        $query
            ->field('userId')->equals($userId)
            ->sort('createdDate', 'desc')
            ->skip($skip)
            ->limit($limit);

        return $query->getQuery()->execute();
    }

    /**
     * @param $userId
     * @return mixed
     */
    public function getCountByUserId($userId)
    {
        if (!$userId) {
            throw new ORMInvalidArgumentException('User ID is not set.');
        }
        $query = $this->createQueryBuilder();
        return $query
            ->field('userId')->equals($userId)
            ->count()
            ->getQuery()
            ->execute();
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
        $query->field('email')->equals(new \MongoDB\BSON\Regex("^{$searchWord}", "i"));
    }

    /**
     * @param $userId
     * @param $contentTypeName
     * @param $productId
     * @return int
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function getPaidByProduct($userId, $contentTypeName, $productId)
    {
        $query = $this->createQueryBuilder();
        return $query
            ->field('userId')->equals($userId)
            ->field('isPaid')->equals(true)
            ->field('content')->elemMatch([
                'contentTypeName' => $contentTypeName,
                'id' => $productId
            ])
            ->count()
            ->getQuery()
            ->execute();
    }
}
