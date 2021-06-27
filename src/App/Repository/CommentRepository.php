<?php

namespace App\Repository;

use Andchir\CommentsBundle\Repository\CommentRepositoryInterface;
use Doctrine\ODM\MongoDB\Query\Builder;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

class CommentRepository extends DocumentRepository implements CommentRepositoryInterface
{
    use BaseRepositoryTrait;

    /**
     * @param string $threadId
     * @param string $status
     * @return array
     */
    public function findByStatus($threadId, $status)
    {
        return $this->findBy([
            'threadId' => $threadId,
            'status' => $status
        ], [
            'publishedTime' => 'desc'
        ]);
    }

    /**
     * @param string $threadId
     * @return array
     */
    public function findAllByThread($threadId)
    {
        return $this->findBy([
            'threadId' => $threadId
        ], [
            'publishedTime' => 'desc'
        ]);
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
                ->addOr($query->expr()->field('comment')->equals(new \MongoDB\BSON\Regex("{$searchWord}", "i")))
                ->addOr($query->expr()->field('reply')->equals(new \MongoDB\BSON\Regex("{$searchWord}", "i")))
        );
    }
}
