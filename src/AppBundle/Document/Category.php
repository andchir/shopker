<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use AppBundle\Document\ContentType;

/**
 * @MongoDB\Document(collection="category",repositoryClass="AppBundle\Repository\CategoryRepository")
 * @MongoDB\HasLifecycleCallbacks()
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
    protected $content_type_name;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $is_folder;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $is_active;

    /**
     * @MongoDB\ReferenceOne(targetDocument="ContentType", inversedBy="category")
     */
    protected $contentType;

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
            'content_type_name' => $this->getContentTypeName(),
            'is_folder' => $this->getIsFolder(),
            'is_active' => $this->getIsActive()
        ];
    }

    /**
     * Set contentTypeName
     *
     * @param string $contentTypeName
     * @return self
     */
    public function setContentTypeName($contentTypeName)
    {
        $this->content_type_name = $contentTypeName;
        return $this;
    }

    /**
     * Get contentTypeName
     *
     * @return string $contentTypeName
     */
    public function getContentTypeName()
    {
        return $this->content_type_name;
    }

    /**
     * Set isFolder
     *
     * @param boolean $isFolder
     * @return self
     */
    public function setIsFolder($isFolder)
    {
        $this->is_folder = $isFolder;
        return $this;
    }

    /**
     * Get isFolder
     *
     * @return boolean $isFolder
     */
    public function getIsFolder()
    {
        return $this->is_folder;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     * @return self
     */
    public function setIsActive($isActive)
    {
        $this->is_active = $isActive;
        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean $isActive
     */
    public function getIsActive()
    {
        return $this->is_active;
    }

    /**
     * @MongoDB\PostUpdate
     */
    public function updateParentIsFolder()
    {

        //var_dump('updateParentIsFolder', $this); exit;

    }

    /**
     * Set contentType
     *
     * @param ContentType $contentType
     * @return self
     */
    public function setContentType(ContentType $contentType)
    {
        $this->contentType = $contentType;
        return $this;
    }

    /**
     * Get contentType
     *
     * @return ContentType $contentType
     */
    public function getContentType()
    {
        return $this->contentType;
    }
}
