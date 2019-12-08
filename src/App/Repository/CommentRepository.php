<?php

namespace App\Repository;

use Andchir\CommentsBundle\Repository\CommentAdminRepositoryAbstract;
use Doctrine\ODM\MongoDB\Query\Builder;

class CommentRepository extends CommentAdminRepositoryAbstract
{

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
                ->addOr($query->expr()->field('comment')->equals(new \MongoDB\BSON\Regex("{$searchWord}", "i")))
                ->addOr($query->expr()->field('reply')->equals(new \MongoDB\BSON\Regex("{$searchWord}", "i")))
        );
    }

}
