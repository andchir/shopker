<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use \Doctrine\Common\Collections\ArrayCollection;

/**
 * @MongoDB\Document(collection="content_type",repositoryClass="AppBundle\Repository\ContentTypeRepository")
 */
class ContentType
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     */
    protected $id;

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
    protected $collection;

    /**
     * @MongoDB\Field(type="collection")
     */
    protected $fields;

    /**
     * @MongoDB\Field(type="collection")
     */
    protected $groups;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $isActive;

    /**
     * @MongoDB\ReferenceMany(targetDocument="Category", mappedBy="contentType")
     */
    protected $categories;

    /**
     * Get id
     *
     * @return int $id
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
     * Set fields
     *
     * @param array $fields
     * @return self
     */
    public function setFields($fields)
    {
        $this->fields = $fields;
        return $this;
    }

    /**
     * Get fields
     *
     * @return array $fields
     */
    public function getFields()
    {
        return $this->fields;
    }

    /**
     * Set groups
     *
     * @param array $groups
     * @return self
     */
    public function setGroups($groups)
    {
        $this->groups = $groups;
        return $this;
    }

    /**
     * Get groups
     *
     * @return array $groups
     */
    public function getGroups()
    {
        return $this->groups;
    }

    /**
     * Set collection
     *
     * @param string $collection
     * @return self
     */
    public function setCollection($collection)
    {
        $this->collection = $collection;
        return $this;
    }

    /**
     * Get collection
     *
     * @return string $collection
     */
    public function getCollection()
    {
        return $this->collection;
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
     * @param bool $full
     * @return array
     */
    public function toArray($full = false)
    {
        $output = [
            'id' => $this->getId(),
            'title' => $this->getTitle(),
            'name' => $this->getName(),
            'description' => $this->getDescription(),
            'collection' => $this->getCollection(),
            'isActive' => $this->getIsActive()
        ];
        if($full){
            $output = array_merge($output, [
                'groups' => $this->getGroups(),
                'fields' => $this->getFields()
            ]);
        }
        return $output;
    }

    public function __construct()
    {
        $this->categories = new ArrayCollection();
    }
    
    /**
     * Add category
     *
     * @param Category $category
     */
    public function addCategory(Category $category)
    {
        $this->categories[] = $category;
    }

    /**
     * Remove category
     *
     * @param Category $category
     */
    public function removeCategory(Category $category)
    {
        $this->categories->removeElement($category);
    }

    /**
     * Get categories
     *
     * @return \Doctrine\Common\Collections\Collection $categories
     */
    public function getCategories()
    {
        return $this->categories;
    }
}
