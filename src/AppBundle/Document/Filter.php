<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="filters",repositoryClass="AppBundle\Repository\FilterRepository")
 */
class Filter
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     */
    protected $id;

    /**
     * @MongoDB\Field(type="int")
     */
    protected $categoryId;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $name;

    /**
     * @MongoDB\Field(type="hash")
     */
    protected $values;

    /**
     * @MongoDB\ReferenceOne(targetDocument="Category", inversedBy="filterData")
     * @var Category
     */
    protected $category;

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
     * Set categoryId
     *
     * @param int $categoryId
     * @return $this
     */
    public function setCategoryId($categoryId)
    {
        $this->categoryId = $categoryId;
        return $this;
    }

    /**
     * Get categoryId
     *
     * @return int $categoryId
     */
    public function getCategoryId()
    {
        return $this->categoryId;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return $this
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
     * Set values
     *
     * @param array $values
     * @return $this
     */
    public function setValues($values)
    {
        $this->values = $values;
        return $this;
    }

    /**
     * Get values
     *
     * @return array $values
     */
    public function getValues()
    {
        return $this->values;
    }

    /**
     * Set category
     *
     * @param Category category
     * @return self
     */
    public function setCategory($category)
    {
        $this->category = $category;
        if ($category) {
            $this->setCategoryId($category->getId());
        }
        return $this;
    }

    /**
     * Get category
     *
     * @return Category category
     */
    public function getCategory()
    {
        return $this->category;
    }
}
