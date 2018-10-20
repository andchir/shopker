<?php

namespace App\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * FilterRepository
 */
class FilterRepository extends DocumentRepository
{

    /**
     * @param int $categoryId
     * @return object
     */
    public function findByCategory($categoryId)
    {
        return $this->findOneBy([
            'categoryId' => $categoryId
        ]);
    }

}
