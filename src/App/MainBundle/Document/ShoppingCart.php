<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use App\MainBundle\Document\OrderContent;

/**
 * @MongoDB\Document(collection="shopping_cart",repositoryClass="App\Repository\ShoppingCartRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class ShoppingCart {

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
    protected $sessionId;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $currency;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $type;

    /**
     * @MongoDB\Field(type="int")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $ownerId;

    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $createdOn;

    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $editedOn;

    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $expiresOn;

    /**
     * @MongoDB\Field(type="collection")
     * @MongoDB\EmbedMany(targetDocument="OrderContent")
     * @Groups({"details"})
     * @var array
     */
    protected $content;

    public function __construct()
    {
        $this->content = new ArrayCollection();
    }

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
     * Set sessionId
     *
     * @param string $sessionId
     * @return $this
     */
    public function setSessionId($sessionId)
    {
        $this->sessionId = $sessionId;
        return $this;
    }

    /**
     * Get sessionId
     *
     * @return string $sessionId
     */
    public function getSessionId()
    {
        return $this->sessionId;
    }

    /**
     * Set currency
     *
     * @param string $currency
     * @return $this
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;
        return $this;
    }

    /**
     * Get currency
     *
     * @return string $currency
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     *
     * @return string $type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set ownerId
     *
     * @param int $ownerId
     * @return $this
     */
    public function setOwnerId($ownerId)
    {
        $this->ownerId = $ownerId;
        return $this;
    }

    /**
     * Get ownerId
     *
     * @return int $ownerId
     */
    public function getOwnerId()
    {
        return $this->ownerId;
    }

    /**
     * Set createdOn
     *
     * @param \DateTime $createdOn
     * @return $this
     */
    public function setCreatedOn($createdOn)
    {
        $this->createdOn = $createdOn;
        return $this;
    }

    /**
     * Get createdOn
     *
     * @return \DateTime $createdOn
     */
    public function getCreatedOn()
    {
        return $this->createdOn;
    }

    /**
     * Set editedOn
     *
     * @param \DateTime $editedOn
     * @return $this
     */
    public function setEditedOn($editedOn)
    {
        $this->editedOn = $editedOn;
        return $this;
    }

    /**
     * Get editedOn
     *
     * @return \DateTime $editedOn
     */
    public function getEditedOn()
    {
        return $this->editedOn;
    }

    /**
     * Set expiresOn
     *
     * @param \DateTime $expiresOn
     * @return $this
     */
    public function setExpiresOn($expiresOn)
    {
        $this->expiresOn = $expiresOn;
        return $this;
    }

    /**
     * Get expiresOn
     *
     * @return \DateTime $expiresOn
     */
    public function getExpiresOn()
    {
        return $this->expiresOn;
    }

    /**
     * Add content
     *
     * @param OrderContent $content
     */
    public function addContent(\App\MainBundle\Document\OrderContent $content)
    {
        $this->content[] = $content;
    }

    /**
     * Remove content
     *
     * @param OrderContent $content
     */
    public function removeContent(\App\MainBundle\Document\OrderContent $content)
    {
        $this->content->removeElement($content);
    }

    /**
     * Get content
     *
     * @return ArrayCollection $content
     */
    public function getContent()
    {
        return $this->content;
    }
}
