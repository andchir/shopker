<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="category",repositoryClass="AppBundle\Repository\CategoryRepository")
 */
class Category
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     */
    protected $id;

    /**
     * @MongoDB\Field(type="int")
     */
    protected $parent_id;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $title;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $name;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $description;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $content_type;

    /**
     * Get id
     *
     * @return string $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return self
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set parentId
     *
     * @param int $parentId
     * @return self
     */
    public function setParentId($parentId)
    {
        $this->parent_id = $parentId;
        return $this;
    }

    /**
     * Get parentId
     *
     * @return int $parentId
     */
    public function getParentId()
    {
        return $this->parent_id;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'parent_id' => $this->getParentId(),
            'name' => $this->getName(),
            'title' => $this->getTitle(),
            'description' => $this->getDescription(),
            'content_type' => $this->getContentType()
        ];
    }

    /**
     * Set contentType
     *
     * @param string $contentType
     * @return self
     */
    public function setContentType($contentType)
    {
        $this->content_type = $contentType;
        return $this;
    }

    /**
     * Get contentType
     *
     * @return string $contentType
     */
    public function getContentType()
    {
        return $this->content_type;
    }
}
