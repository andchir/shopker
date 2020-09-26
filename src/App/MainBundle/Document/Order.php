<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use App\MainBundle\Document\OrderContent;

/**
 * @MongoDB\Document(collection="order",repositoryClass="App\Repository\OrderRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class Order
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
    protected $email;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $fullName;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $phone;

    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $createdDate;

    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $updatedDate;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $status;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $deliveryName;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     * @var float
     */
    protected $deliveryPrice;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $paymentName;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $paymentValue;
    
    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $promoCode;
    
    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     * @var int|float
     */
    protected $discount;
    
    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     * @var int|float
     */
    protected $discountPercent;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $userId;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $comment;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $note;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     * @var float
     */
    protected $price;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $currency;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     * @var float
     */
    protected $currencyRate;

    /**
     * @MongoDB\Field(type="collection")
     * @Groups({"details"})
     * @var array
     */
    protected $options;

    /**
     * @MongoDB\Field(type="collection")
     * @MongoDB\EmbedMany(targetDocument="App\MainBundle\Document\OrderContent")
     * @Groups({"details"})
     * @var array
     */
    protected $content;

    /**
     * @MongoDB\ReferenceMany(targetDocument="App\MainBundle\Document\FileDocument", mappedBy="order", orphanRemoval=true, cascade={"all"}, storeAs="id")
     * @Groups({"details"})
     * @var array
     */
    protected $files;

    /**
     * @MongoDB\Field(type="bool")
     * @Groups({"details", "list"})
     * @var bool
     */
    protected $isPaid;

    /**
     * @Groups({"details", "list"})
     * @var int
     */
    protected $contentCount;

    public function __construct()
    {
        $this->content = new ArrayCollection();
        $this->files = new ArrayCollection();
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
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set createdDate
     *
     * @param \DateTime $createdDate
     * @return Order
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;
        return $this;
    }

    /**
     * Get createdDate
     *
     * @return \DateTime
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * Set updatedDate
     *
     * @param \DateTime $updatedDate
     * @return Order
     */
    public function setUpdatedDate($updatedDate)
    {
        $this->updatedDate = $updatedDate;
        return $this;
    }

    /**
     * Get updatedDate
     *
     * @return \DateTime
     */
    public function getUpdatedDate()
    {
        return $this->updatedDate;
    }

    /**
     * Set status
     *
     * @param string $status
     * @param string $paidStatusName
     * @return Order
     */
    public function setStatus($status, $paidStatusName = '')
    {
        $this->status = $status;
        if ($status === $paidStatusName) {
            $this->setIsPaid(true);
        }
        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set userId
     *
     * @param integer $userId
     * @return Order
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * Get userId
     *
     * @return integer
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set comment
     *
     * @param string $comment
     * @return Order
     */
    public function setComment($comment)
    {
        $this->comment = $comment;
        return $this;
    }

    /**
     * Get comment
     *
     * @return string
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * Set email
     *
     * @param string $email
     * @return Order
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set fullName
     *
     * @param string $fullName
     * @return Order
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;
        return $this;
    }

    /**
     * Get fullName
     *
     * @return string
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Set phone
     *
     * @param string $phone
     * @return Order
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * Get phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set deliveryName
     *
     * @param string $deliveryName
     * @return Order
     */
    public function setDeliveryName($deliveryName)
    {
        $this->deliveryName = $deliveryName;
        return $this;
    }

    /**
     * Get deliveryName
     *
     * @return string
     */
    public function getDeliveryName()
    {
        return $this->deliveryName;
    }

    /**
     * Set deliveryPrice
     *
     * @param $deliveryPrice
     * @param int $currencyRate
     * @return Order
     */
    public function setDeliveryPrice($deliveryPrice, $currencyRate = 1)
    {
        $this->deliveryPrice = round($deliveryPrice / $currencyRate, 2);
        return $this;
    }

    /**
     * Get deliveryPrice
     *
     * @return string
     */
    public function getDeliveryPrice()
    {
        return $this->deliveryPrice;
    }

    /**
     * Set paymentName
     *
     * @param string $paymentName
     * @return Order
     */
    public function setPaymentName($paymentName)
    {
        $this->paymentName = $paymentName;
        return $this;
    }

    /**
     * Get paymentName
     *
     * @return string
     */
    public function getPaymentName()
    {
        return $this->paymentName;
    }

    /**
     * Set paymentValue
     *
     * @param string $paymentValue
     * @return Order
     */
    public function setPaymentValue($paymentValue)
    {
        $this->paymentValue = $paymentValue;
        return $this;
    }

    /**
     * Get paymentValue
     *
     * @return string
     */
    public function getPaymentValue()
    {
        return $this->paymentValue;
    }
    
    /**
     * @return string
     */
    public function getPromoCode()
    {
        return $this->promoCode;
    }
    
    /**
     * @param string $promoCode
     * @return Order
     */
    public function setPromoCode(string $promoCode)
    {
        $this->promoCode = $promoCode;
        return $this;
    }
    
    /**
     * @return float|int
     */
    public function getDiscount()
    {
        return $this->discount;
    }
    
    /**
     * @param float|int $discount
     * @param int $currencyRate
     * @return Order
     */
    public function setDiscount($discount, $currencyRate = 1)
    {
        $this->discount = round($discount / $currencyRate, 2);
        return $this;
    }
    
    /**
     * @return float|int
     */
    public function getDiscountPercent()
    {
        return $this->discountPercent;
    }
    
    /**
     * @param float|int $discountPercent
     * @return Order
     */
    public function setDiscountPercent($discountPercent)
    {
        $this->discountPercent = $discountPercent;
        return $this;
    }

    /**
     * Set note
     *
     * @param string $note
     * @return Order
     */
    public function setNote($note)
    {
        $this->note = $note;
        return $this;
    }

    /**
     * Get note
     *
     * @return string
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
     * @param bool $full
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
            'promoCode' => $this->getPromoCode(),
            'discount' => $this->getDiscount(),
            'discountPercent' => $this->getDiscountPercent(),
            'comment' => $this->getComment(),
            'status' => $this->getStatus(),
            'contentCount' => $this->getContentCount(),
            'currency' => $this->getCurrency()
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
     * Set price
     *
     * @param $price
     * @param int $currencyRate
     * @return Order
     */
    public function setPrice($price, $currencyRate = 1)
    {
        $this->price = round($price / $currencyRate, 2);
        return $this;
    }

    /**
     * Get price
     *
     * @return float
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @return Order
     */
    public function updatePriceTotal()
    {
        $priceTotal = 0;
        /** @var OrderContent $content */
        foreach ($this->content as $content) {
            $priceTotal += $content->getPriceTotal();
        }
        if ($this->discount) {
            $priceTotal -= $this->discount;
        } else if ($this->discountPercent) {
            $priceTotal *= $this->discountPercent / 100;
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
     * @return Order
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;
        return $this;
    }

    /**
     * Get currency
     *
     * @return string
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * Set currency rate
     *
     * @param float $currencyRate
     * @return Order
     */
    public function setCurrencyRate($currencyRate)
    {
        $this->currencyRate = $currencyRate;
        return $this;
    }

    /**
     * Get currency rate
     *
     * @return float
     */
    public function getCurrencyRate()
    {
        return $this->currencyRate;
    }

    /**
     * Set options
     *
     * @param array $options
     * @return Order
     */
    public function setOptions($options)
    {
        $this->options = $options;
        return $this;
    }

    /**
     * Get options
     *
     * @return array
     */
    public function getOptions()
    {
        return $this->options ?: [];
    }

    /**
     * @param string $key
     * @param mixed $value
     * @param string $title
     * @return Order
     */
    public function setOptionValue($key, $value, $title = '')
    {
        $newOption = [
            'name' => $key,
            'value' => $value,
            'title' => $title
        ];
        $options = $this->getOptions();
        $index = array_search($key, array_column($options, 'name'));
        if ($index !== false) {
            $options[$index] = $newOption;
        } else {
            $options[] = $newOption;
        }
        $this->setOptions($options);
        return $this;
    }

    /**
     * @param $key
     * @return string|null
     */
    public function getOptionValue($key)
    {
        $options = $this->getOptions();
        $index = array_search($key, array_column($options, 'name'));
        return $index !== false ? $options[$index]['value'] : null;
    }

    /**
     * Get content
     *
     * @return ArrayCollection
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
     * @return Order
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

    /**
     * Add file
     *
     * @param FileDocument $file
     * @return Order
     */
    public function addFile(FileDocument $file)
    {
        $this->files->add($file);
        return $this;
    }

    /**
     * Remove file
     *
     * @param FileDocument $file
     * @return Order
     */
    public function removeFile(FileDocument $file)
    {
        $this->files->removeElement($file);
        return $this;
    }

    /**
     * Get files
     *
     * @return ArrayCollection
     */
    public function getFiles()
    {
        return $this->files;
    }

    /**
     * Set isPaid
     *
     * @param bool $isPaid
     * @return Order
     */
    public function setIsPaid($isPaid)
    {
        $this->isPaid = $isPaid;
        return $this;
    }

    /**
     * Get isPaid
     *
     * @return bool
     */
    public function getIsPaid()
    {
        return $this->isPaid;
    }

    /**
     * Get status color
     * @param $orderStatusSettings
     * @return string
     */
    public function getStatusColor($orderStatusSettings)
    {
        $color = '';
        $orderStatus = $this->getStatus();
        $statusSetting = array_filter($orderStatusSettings, function($setting) use ($orderStatus) {
            /** @var Setting $setting */
            return $setting->getName() == $orderStatus;
        });
        if (!empty($statusSetting)) {
            $statusSetting = current($statusSetting);
            /** @var Setting $statusSetting */
            $settingOptions = $statusSetting->getOptions();

            return $settingOptions['color']['value'];
        }
        return $color;
    }

    /**
     * @param $publicDataKeys
     */
    public function filterOptionsByPublic($publicDataKeys)
    {
        $orderOptions = $this->getOptions();
        $orderOptions = array_filter($orderOptions, function($value) use ($publicDataKeys) {
            return in_array($value['name'], $publicDataKeys);
        });
        $this->setOptions($orderOptions);
    }

    /**
     * @param array $options
     * @param array $productOptions
     * @param array $deliveryOptions
     * @return array
     */
    public function getReceipt($options, $productOptions = [], $deliveryOptions = [])
    {
        $options = array_merge([
            'unit' => '',
            'priceName' => 'price',
            'quantityName' => 'quantity',
            'titleName' => 'name'
        ], $options);
        $receipt = [];
        /** @var OrderContent $content */
        foreach ($this->getContent() as $content) {
            $item = [];
            $item[$options['titleName']] = $content->getTitle() . ($options['unit'] ? ", {$options['unit']}" : $options['unit']);
            $item[$options['quantityName']] = number_format($content->getCount(), 2, '.', '');
            if (strpos($options['priceName'], '.') !== false) {
                $optArr = explode('.', $options['priceName']);
                $item[$optArr[0]] = [];
                $item[$optArr[0]][$optArr[1]] = number_format($content->getPriceTotal(), 2, '.', '');
            } else {
                $item[$options['priceName']] = number_format($content->getPriceTotal(), 2, '.', '');
            }
            $receipt[] = array_merge($item, $productOptions);
        }
        if ($this->getDeliveryPrice() > 0) {
            $item = [];
            $item[$options['titleName']] = $this->getDeliveryName();
            $item[$options['quantityName']] = 1;
            if (strpos($options['priceName'], '.') !== false) {
                $optArr = explode('.', $options['priceName']);
                $item[$optArr[0]] = [];
                $item[$optArr[0]][$optArr[1]] = number_format($this->getDeliveryPrice(), 2, '.', '');
            } else {
                $item[$options['priceName']] = number_format($this->getDeliveryPrice(), 2, '.', '');
            }
            $receipt[] = array_merge($item, $deliveryOptions);
        }

        return $receipt;
    }

    /**
     * @param $shopCartContent
     * @param int $currencyRate
     * @return Order
     */
    public function setContentFromCart($shopCartContent, $currencyRate = 1)
    {
        /** @var OrderContent $content */
        foreach ($shopCartContent as $content) {
            $orderContent = new OrderContent();
            $orderContent->cloneFrom($content, $currencyRate);
            $this->addContent($orderContent);
        }
        return $this;
    }
}
