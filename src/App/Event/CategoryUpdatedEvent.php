<?php

namespace App\Event;

use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Contracts\EventDispatcher\Event;
use App\MainBundle\Document\Category;

class CategoryUpdatedEvent extends Event
{
    const NAME = 'category.updated';

    /** @var DocumentManager|ObjectManager */
    protected $dm;
    /** @var Category */
    protected $category;
    /** @var int */
    protected $previousParentId;

    public function __construct($dm, Category $category = null, $previousParentId = 0)
    {
        $this->category = $category;
        $this->dm = $dm;
        $this->previousParentId = $previousParentId;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function getDocumentManager()
    {
        return $this->dm;
    }

    public function getPreviousParentId()
    {
        return $this->previousParentId;
    }
}
