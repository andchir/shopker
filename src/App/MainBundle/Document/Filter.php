<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="filters",repositoryClass="App\Repository\FilterRepository")
 */
class Filter
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $id;

    /**
     * @MongoDB\Field(type="int")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $categoryId;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details", "list"})
     * @var string
     */
    protected $name;

    /**
     * @MongoDB\Field(type="hash")
     * @Groups({"details", "list"})
     * @var array
     */
    protected $values;

    /**
     * @MongoDB\Field(type="hash")
     * @Groups({"details", "list"})
     * @var array
     */
    protected $valuesData;

    /**
     * @MongoDB\ReferenceOne(targetDocument="App\MainBundle\Document\Category", inversedBy="filterData")
     * @var Category
     */
    protected $category;

    /**
     * Get id
     *
     * @return int
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
     * @return int
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
     * @return string
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
     * @return array
     */
    public function getValues()
    {
        return $this->values;
    }

    /**
     * Set valuesData
     *
     * @param array $valuesData
     * @return $this
     */
    public function setValueData($valuesData)
    {
        $this->valuesData = $valuesData;
        return $this;
    }

    /**
     * Get valuesData
     *
     * @return array
     */
    public function getValuesData()
    {
        return $this->valuesData;
    }

    /**
     * Set category
     *
     * @param Category category
     * @return $this
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
     * @return Category
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * Set valuesData
     *
     * @param hash $valuesData
     * @return $this
     */
    public function setValuesData($valuesData)
    {
        $this->valuesData = $valuesData;
        return $this;
    }
}
