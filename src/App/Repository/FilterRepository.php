<?php

namespace App\Repository;

use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

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
