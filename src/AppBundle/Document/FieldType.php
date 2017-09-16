<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="field_type",repositoryClass="AppBundle\Repository\FieldTypeRepository")
 */
class FieldType
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
     * @MongoDB\Field(type="collection")
     */
    protected $inputProperties;

    /**
     * @MongoDB\Field(type="collection")
     */
    protected $outputProperties;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $is_active;


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
            'is_active' => $this->getIsActive()
        ];
        if( $full ){
            $output['inputProperties'] = $this->getInputProperties();
            $output['outputProperties'] = $this->getOutputProperties();
        }
        return $output;
    }

    /**
     * Set inputProperties
     *
     * @param array $inputProperties
     * @return self
     */
    public function setInputProperties($inputProperties)
    {
        $this->inputProperties = $inputProperties;
        return $this;
    }

    /**
     * Get inputProperties
     *
     * @return array $inputProperties
     */
    public function getInputProperties()
    {
        return $this->inputProperties;
    }

    /**
     * Set outputProperties
     *
     * @param array $outputProperties
     * @return self
     */
    public function setOutputProperties($outputProperties)
    {
        $this->outputProperties = $outputProperties;
        return $this;
    }

    /**
     * Get outputProperties
     *
     * @return array $outputProperties
     */
    public function getOutputProperties()
    {
        return $this->outputProperties;
    }
}
