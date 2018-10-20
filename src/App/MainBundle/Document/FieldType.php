<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="field_type",repositoryClass="App\Repository\FieldTypeRepository")
 */
class FieldType
{

    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $title;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $name;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $description;

    /**
     * @MongoDB\Field(type="collection")
     * @Groups({"details", "list"})
     * @var array
     */
    protected $inputProperties;

    /**
     * @MongoDB\Field(type="collection")
     * @Groups({"details", "list"})
     * @var array
     */
    protected $outputProperties;

    /**
     * @MongoDB\Field(type="boolean")
     * @Groups({"details", "list"})
     * @var boolean
     */
    protected $isActive;


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
     * Set title
     *
     * @param string $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
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
     * Set description
     *
     * @param string $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     * @return $this
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;
        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean
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
            'isActive' => $this->getIsActive()
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
     * @return $this
     */
    public function setInputProperties($inputProperties)
    {
        $this->inputProperties = $inputProperties;
        return $this;
    }

    /**
     * Get inputProperties
     *
     * @return array
     */
    public function getInputProperties()
    {
        return $this->inputProperties;
    }

    /**
     * Set outputProperties
     *
     * @param array $outputProperties
     * @return $this
     */
    public function setOutputProperties($outputProperties)
    {
        $this->outputProperties = $outputProperties;
        return $this;
    }

    /**
     * Get outputProperties
     *
     * @return array
     */
    public function getOutputProperties()
    {
        return $this->outputProperties;
    }
}
