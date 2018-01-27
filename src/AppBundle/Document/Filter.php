<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="field_type",repositoryClass="AppBundle\Repository\FilterRepository")
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
     * @MongoDB\Field(type="string")
     */
    protected $name;

    /**
     * @MongoDB\Field(type="collection")
     */
    protected $values;

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
}
