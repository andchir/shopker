<?php

namespace AppBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * FileRepository
 *
 */
class FileDocumentRepository extends DocumentRepository
{

    /**
     * @param string $ownerType
     * @param int $seconds
     * @return mixed
     */
    public function findTemporaryByTime($ownerType, $seconds)
    {
        return $this->createQueryBuilder()
            ->field('ownerType')->equals($ownerType)
            ->field('createdDate')->lt(new \MongoDate(time() - $seconds))
            ->getQuery()
            ->execute();
    }

    /**
     * @param string $ownerType
     * @param int $ownerDocId
     * @param array $usedIds
     * @return mixed
     */
    public function findUnused($ownerType, $ownerDocId, $usedIds)
    {
        return $this->createQueryBuilder()
            ->field('ownerType')->equals($ownerType)
            ->field('ownerDocId')->equals($ownerDocId)
            ->field('id')->notIn($usedIds)
            ->getQuery()
            ->execute();
    }


}