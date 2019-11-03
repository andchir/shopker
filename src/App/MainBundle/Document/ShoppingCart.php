<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use App\MainBundle\Document\OrderContent;
use Twig\Environment as TwigEnvironment;

/**
 * @MongoDB\Document(collection="shopping_cart",repositoryClass="App\Repository\ShoppingCartRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class ShoppingCart {

    const SESSION_KEY = 'shoppingcart_sessid';
    const TYPE_MAIN = 'shop';

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
     * @MongoDB\Field(type="collection")
     * @MongoDB\EmbedMany(targetDocument="App\MainBundle\Document\OrderContent")
     * @Groups({"details"})
     * @var array
     */
    protected $content;

    /**
     * @Groups({"details", "list"})
     * @var float
     */
    protected $price;

    /**
     * @Groups({"details", "list"})
     * @var int
     */
    protected $count;

    public function __construct()
    {
        $this->content = new ArrayCollection();
    }

    /**
     * @MongoDB\PrePersist()
     */
    public function prePersist()
    {
        $this->createdOn = new \DateTime();
        $this->editedOn = new \DateTime();
        $this->updateTotal();
    }

    /**
     * @MongoDB\PreUpdate()
     */
    public function preUpdate()
    {
        $this->editedOn = new \DateTime();
        $this->updateTotal();
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
    public function addContent(OrderContent $content)
    {
        $this->content[] = $content;
    }

    /**
     * @param ArrayCollection $collection
     * @return $this
     */
    public function setContent(ArrayCollection $collection)
    {
        $this->content = $collection;
        return $this;
    }

    /**
     * Remove content
     *
     * @param OrderContent $content
     * @return $this
     */
    public function removeContent(OrderContent $content)
    {
        $this->content->removeElement($content);
        $this->content = new ArrayCollection(array_merge($this->content->toArray()));// clear indexes
        return $this;
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

    /**
     * Sort by content type
     * @return array|ArrayCollection
     */
    public function getContentSorted()
    {
        $content = $this->content;
        $tmp = [[], []];
        $collection = new ArrayCollection();
        /** @var OrderContent $cont */
        foreach ($content as $cont) {
            $index = array_search($cont->getContentTypeName(), $tmp[0]);
            if ($index === false) {
                $tmp[0][] = $cont->getContentTypeName();
                $tmp[1][] = [];
                $index = count($tmp[0]) - 1;
            }
            $tmp[1][$index][] = $cont;
        }
        unset($cont);
        foreach ($tmp[1] as $group) {
            foreach ($group as $cont) {
                $collection->add($cont);
            }
        }
        return $collection;
    }

    /**
     * Set price
     *
     * @param $price
     * @param int $currencyRate
     * @return $this
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
     * Set count
     * @param float $count
     * @return $this
     */
    public function setCount($count)
    {
        $this->count = $count;
        return $this;
    }

    /**
     * Get count
     * @return float
     */
    public function getCount()
    {
        return $this->count;
    }

    /**
     * @return $this
     */
    public function updateTotal()
    {
        $countTotal = 0;
        $priceTotal = 0;
        /** @var OrderContent $content */
        foreach ($this->content as $content) {
            $priceTotal += $content->getPriceTotal();
            $countTotal += $content->getCount();
        }
        if ($this->deliveryPrice) {
            $priceTotal += $this->deliveryPrice;
        }
        $this
            ->setPrice($priceTotal)
            ->setCount($countTotal);
        return $this;
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
     * @param float $deliveryPrice
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
     * @return float $deliveryPrice
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
     * @param string $key
     * @return array
     */
    public function getContentValues($key)
    {
        $shoppingCartContent = $this->getContent();
        $outputArr = array_map(function($content) use ($key) {
            return $content->getByKey($key, '');
        }, $shoppingCartContent->toArray());
        return array_unique(array_merge($outputArr));
    }

    /**
     * @param TwigEnvironment $twig
     * @param array $productData
     * @param string $fieldName
     * @return string
     */
    public function getCartContentParametersString($twig, $productData, $fieldName = 'parameters')
    {
        if (!($twig instanceof TwigEnvironment)) {
            return '';
        }
        $parameters = isset($productData[$fieldName]) && is_array($productData[$fieldName])
            ? $productData[$fieldName]
            : [];
        if (empty($parameters)) {
            return '';
        }
        return $twig->render('shop_cart/shop_cart_parameter.html.twig', [
            'parameters' => $parameters
        ]);
    }

    /**
     * @param TwigEnvironment|null $twig
     * @return array
     */
    public function getContentArray($twig = null)
    {
        $output = [];
        $shoppingCartContent = $this->getContentSorted();

        /** @var OrderContent $content */
        foreach ($shoppingCartContent as $content) {
            $productData = $content->toArray();
            $productData['parametersString'] = $this->getCartContentParametersString($twig, $productData);
            $output[] = $productData;
        }
        return $output;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $this->updateTotal();
        $shoppingCartContent = $this->getContent();
        return [
            'type' => $this->getType(),
            'price_total' => $this->getPrice(),
            'items_total' => $this->getCount(),
            'items_unique_total' => count($shoppingCartContent),
            'delivery_price' => $this->getDeliveryPrice(),
            'delivery_name' => $this->getDeliveryName(),
            'ids' => $this->getContentValues('id')
        ];
    }
}
