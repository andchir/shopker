<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\Common\Collections\ArrayCollection;
use AppBundle\Document\OrderContent;

/**
 * @MongoDB\Document(collection="order",repositoryClass="AppBundle\Repository\OrderRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class Order
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $email;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $fullName;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $phone;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     */
    protected $createdDate;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     */
    protected $updatedDate;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $status;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $deliveryName;

    /**
     * @MongoDB\Field(type="float", nullable=true)
     */
    protected $deliveryPrice;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $paymentName;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $paymentValue;

    /**
     * @MongoDB\Field(type="integer")
     */
    protected $userId;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $comment;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $note;

    /**
     * @MongoDB\Field(type="float")
     */
    protected $price;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $currency;

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     */
    protected $options;

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     * @MongoDB\EmbedMany(targetDocument="OrderContent")
     */
    protected $content;

    public function __construct()
    {
        $this->content = new ArrayCollection();
    }

    /**
     * @MongoDB\PrePersist()
     */
    public function prePersist()
    {
        $this->createdDate = new \DateTime();
        $this->updatedDate = new \DateTime();
        $this->updatePriceTotal();
    }

    /**
     * @MongoDB\PreUpdate()
     */
    public function preUpdate()
    {
        $this->updatedDate = new \DateTime();
        $this->updatePriceTotal();
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
     * Set comment
     *
     * @param string $comment
     * @return $this
     */
    public function setComment($comment)
    {
        $this->comment = $comment;
        return $this;
    }

    /**
     * Get comment
     *
     * @return string $comment
     */
    public function getComment()
    {
        return $this->comment;
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
     * Set fullName
     *
     * @param string $fullName
     * @return $this
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;
        return $this;
    }

    /**
     * Get fullName
     *
     * @return string $fullName
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Set phone
     *
     * @param string $phone
     * @return $this
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * Get phone
     *
     * @return string $phone
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set deliveryName
     *
     * @param string $deliveryName
     * @return $this
     */
    public function setDeliveryName($deliveryName)
    {
        $this->deliveryName = $deliveryName;
        return $this;
    }

    /**
     * Get deliveryName
     *
     * @return string $deliveryName
     */
    public function getDeliveryName()
    {
        return $this->deliveryName;
    }

    /**
     * Set deliveryPrice
     *
     * @param string $deliveryPrice
     * @return $this
     */
    public function setDeliveryPrice($deliveryPrice)
    {
        $this->deliveryPrice = $deliveryPrice;
        return $this;
    }

    /**
     * Get deliveryPrice
     *
     * @return string $deliveryPrice
     */
    public function getDeliveryPrice()
    {
        return $this->deliveryPrice;
    }

    /**
     * Set paymentName
     *
     * @param string $paymentName
     * @return $this
     */
    public function setPaymentName($paymentName)
    {
        $this->paymentName = $paymentName;
        return $this;
    }

    /**
     * Get paymentName
     *
     * @return string $paymentName
     */
    public function getPaymentName()
    {
        return $this->paymentName;
    }

    /**
     * Set paymentValue
     *
     * @param string $paymentValue
     * @return $this
     */
    public function setPaymentValue($paymentValue)
    {
        $this->paymentValue = $paymentValue;
        return $this;
    }

    /**
     * Get paymentValue
     *
     * @return string $paymentValue
     */
    public function getPaymentValue()
    {
        return $this->paymentValue;
    }

    /**
     * Set note
     *
     * @param string $note
     * @return $this
     */
    public function setNote($note)
    {
        $this->note = $note;
        return $this;
    }

    /**
     * Get note
     *
     * @return string $note
     */
    public function getNote()
    {
        return $this->note;
    }

    /**
     * @return int
     */
    public function getContentCount()
    {
        $countTotal = 0;
        $contentArr = $this->getContent();
        /** @var OrderContent $content */
        foreach ($contentArr as $content) {
            $countTotal += $content->getCount();
        }
        return $countTotal;
    }

    /**
     * @return array
     */
    public function toArray($full = false)
    {
        $output = [
            'id' => $this->getId(),
            'userId' => $this->getUserId(),
            'price' => $this->getPrice(),
            'email' => $this->getEmail(),
            'phone' => $this->getPhone(),
            'fullName' => $this->getFullName(),
            'createdDate' => $this->getCreatedDate(),
            'updatedDate' => $this->getUpdatedDate(),
            'deliveryName' => $this->getDeliveryName(),
            'deliveryPrice' => $this->getDeliveryPrice(),
            'paymentName' => $this->getPaymentName(),
            'deliveryValue' => $this->getPaymentValue(),
            'comment' => $this->getComment(),
            'status' => $this->getStatus(),
            'contentCount' => $this->getContentCount()
        ];
        if($full){
            $output = array_merge($output, [
                'content' => $this->getContentArray(),
                'options' => $this->getOptions()
            ]);
        }
        return $output;
    }

    /**
     * @param $shopCartData
     * @return $this
     */
    public function setContentFromCart($shopCartData)
    {
        foreach ($shopCartData as $contentTypeName => $products) {
            foreach ($products as $product) {
                $uri = $product['parentUri'] . $product['systemName'];
                $orderContent = new OrderContent();
                $orderContent
                    ->setId($product['id'])
                    ->setTitle($product['title'])
                    ->setCount($product['count'])
                    ->setPrice($product['price'])
                    ->setImage($product['image'])
                    ->setUri($uri)
                    ->setContentTypeName($contentTypeName)
                    ->setParameters($product['parameters']);

                $this->addContent($orderContent);
            }
        }
        return $this;
    }

    /**
     * Set price
     *
     * @param float $price
     * @return $this
     */
    public function setPrice($price)
    {
        $this->price = $price;
        return $this;
    }

    /**
     * Get price
     *
     * @return float $price
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @return $this
     */
    public function updatePriceTotal()
    {
        $priceTotal = 0;
        /** @var OrderContent $content */
        foreach ($this->content as $content) {
            $priceTotal += $content->getPriceTotal();
        }
        if ($this->deliveryPrice) {
            $priceTotal += $this->deliveryPrice;
        }
        $this->price = $priceTotal;
        return $this;
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
     * Get content
     *
     * @return ArrayCollection $content
     */
    public function getContent()
    {
        return $this->content;
    }

    public function getContentArray()
    {
        $output = [];
        /** @var OrderContent $content */
        foreach ($this->content as $content) {
            $output[] = $content->toArray();
        }
        return $output;
    }

    /**
     * Set content
     *
     * @param ArrayCollection $content
     * @return $this
     */
    public function setContent($content)
    {
        $this->content = $content;
        return $this;
    }

    /**
     * Add content
     *
     * @param OrderContent $content
     */
    public function addContent(OrderContent $content)
    {
        $this->content->add($content);
    }

    /**
     * Remove content
     *
     * @param OrderContent $content
     */
    public function removeContent(OrderContent $content)
    {
        $this->content->removeElement($content);
    }
}
