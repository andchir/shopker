<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="payment",repositoryClass="AppBundle\Repository\PaymentRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class Payment
{

    const STATUS_CREATED = 'created';
    const STATUS_CANCELED = 'canceled';
    const STATUS_SUCCESS = 'success';
    const STATUS_ERROR = 'error';

    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $email;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $status;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     */
    protected $userId;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     */
    protected $orderId;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     */
    protected $amount;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $currency;

    /**
     * @MongoDB\Field(type="hash")
     * @Groups({"details", "list"})
     */
    protected $options;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     * @Groups({"details", "list"})
     */
    protected $createdDate;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     * @Groups({"details", "list"})
     */
    protected $updatedDate;

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
     * @MongoDB\PrePersist()
     */
    public function prePersist()
    {
        $this->createdDate = new \DateTime();
        $this->updatedDate = new \DateTime();
    }

    /**
     * @MongoDB\PreUpdate()
     */
    public function preUpdate()
    {
        $this->updatedDate = new \DateTime();
    }

    /**
     * Set email
     *
     * @param string $email
     * @return $this
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Get email
     *
     * @return string $email
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set status
     *
     * @param string $status
     * @return $this
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * Get status
     *
     * @return string $status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set userId
     *
     * @param integer $userId
     * @return $this
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * Get userId
     *
     * @return integer $userId
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set amount
     *
     * @param float $amount
     * @return $this
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
        return $this;
    }

    /**
     * Get amount
     *
     * @return float $amount
     */
    public function getAmount()
    {
        return $this->amount;
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
     * Set options
     *
     * @param array $options
     * @return $this
     */
    public function setOptions($options)
    {
        $this->options = $options;
        return $this;
    }

    /**
     * Get options
     *
     * @return array $options
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * Set createdDate
     *
     * @param \DateTime $createdDate
     * @return $this
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;
        return $this;
    }

    /**
     * Get createdDate
     *
     * @return \DateTime $createdDate
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * Set updatedDate
     *
     * @param \DateTime $updatedDate
     * @return $this
     */
    public function setUpdatedDate($updatedDate)
    {
        $this->updatedDate = $updatedDate;
        return $this;
    }

    /**
     * Get updatedDate
     *
     * @return \DateTime $updatedDate
     */
    public function getUpdatedDate()
    {
        return $this->updatedDate;
    }

    /**
     * Set orderId
     *
     * @param integer $orderId
     * @return $this
     */
    public function setOrderId($orderId)
    {
        $this->orderId = $orderId;
        return $this;
    }

    /**
     * Get orderId
     *
     * @return integer $orderId
     */
    public function getOrderId()
    {
        return $this->orderId;
    }
}
