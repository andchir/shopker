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


}