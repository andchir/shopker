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
    protected $parentId;

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
    protected $contentTypeName;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $isFolder;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $isActive;

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
     * Set ID
     *
     * @param int $id
     * @return self
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
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
        $this->parentId = $parentId;
        return $this;
    }

    /**
     * Get parentId
     *
     * @return int $parentId
     */
    public function getParentId()
    {
        return $this->parentId;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'parentId' => $this->getParentId(),
            'name' => $this->getName(),
            'title' => $this->getTitle(),
            'description' => $this->getDescription(),
            'contentTypeName' => $this->getContentTypeName(),
            'isFolder' => $this->getIsFolder(),
            'isActive' => $this->getIsActive()
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
        $this->contentTypeName = $contentTypeName;
        return $this;
    }

    /**
     * Get contentTypeName
     *
     * @return string $contentTypeName
     */
    public function getContentTypeName()
    {
        return $this->contentTypeName;
    }

    /**
     * Set isFolder
     *
     * @param boolean $isFolder
     * @return self
     */
    public function setIsFolder($isFolder)
    {
        $this->isFolder = $isFolder;
        return $this;
    }

    /**
     * Get isFolder
     *
     * @return boolean $isFolder
     */
    public function getIsFolder()
    {
        return $this->isFolder;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     * @return self
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;
        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean $isActive
     */
    public function getIsActive()
    {
        return $this->isActive;
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
