<?php

namespace App\Event;

use Symfony\Component\EventDispatcher\Event;
use App\MainBundle\Document\Category;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CategoryUpdatedEvent extends Event
{
    const NAME = 'category.updated';

    protected $category;
    protected $container;
    protected $previousParentId;

    public function __construct(ContainerInterface $container, Category $category = null, $previousParentId = 0)
    {
        $this->category = $category;
        $this->container = $container;
        $this->previousParentId = $previousParentId;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function getContainer()
    {
        return $this->container;
    }

    public function getPreviousParentId()
    {
        return $this->previousParentId;
    }
}
