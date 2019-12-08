<?php

namespace App\MainBundle\Document;

use Andchir\CommentsBundle\Document\CommentAbstract;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="comment",repositoryClass="App\Repository\CommentRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class Comment extends CommentAbstract {

    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $id;
    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $threadId;
    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $comment;
    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $reply;
    /**
     * @MongoDB\Field(type="int")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $vote;
    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $status;
    /**
     * @MongoDB\ReferenceOne(targetDocument="App\MainBundle\Document\User")
     * @Groups({"details"})
     * @var User
     */
    protected $author;
    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $createdTime;
    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $publishedTime;
    /**
     * @Groups({"details", "list"})
     * @var boolean
     */
    protected $isActive;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @MongoDB\PrePersist()
     */
    public function prePersist()
    {
        $this->createdTime = new \DateTime();
        $this->publishedTime = new \DateTime();
    }
}
