<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\EmbeddedDocument()
 */
class OrderContent
{
    /**
     * @MongoDB\Id(type="int")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $uniqId;

    /**
     * @MongoDB\Field(type="int")
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
    protected $image;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $uri;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $contentTypeName;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     * @var float
     */
    protected $count;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     * @var float
     */
    protected $price;

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     * @Groups({"details"})
     * @var array
     */
    protected $parameters = [];

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     * @Groups({"details"})
     * @var array
     */
    protected $files = [];

    /**
     * @MongoDB\Field(type="hash")
     * @Groups({"details", "list"})
     * @var array
     */
    protected $options;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $currency;

    /**
     * Get uniqId
     * @return int
     */
    public function getUniqId()
    {
        return $this->uniqId;
    }

    /**
     * Get id
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set id
     * @param int $id
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Set title
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
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set image
     * @param string $image
     * @return $this
     */
    public function setImage($image)
    {
        $this->image = $image;
        return $this;
    }

    /**
     * Get image
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set uri
     * @param string $uri
     * @return $this
     */
    public function setUri($uri)
    {
        $this->uri = $uri;
        return $this;
    }

    /**
     * Get uri
     * @return string
     */
    public function getUri()
    {
        return $this->uri;
    }

    /**
     * Set contentTypeName
     * @param string $contentTypeName
     * @return $this
     */
    public function setContentTypeName($contentTypeName)
    {
        $this->contentTypeName = $contentTypeName;
        return $this;
    }

    /**
     * Get contentTypeName
     * @return string
     */
    public function getContentTypeName()
    {
        return $this->contentTypeName;
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
     * Set price
     * @param float $price
     * @param int $currencyRate
     * @return $this
     */
    public function setPrice($price, $currencyRate = 1)
    {
        $this->price = round($price / $currencyRate, 2);
        return $this;
    }

    /**
     * @param int $value
     * @return $this
     */
    public function incrementCount($value)
    {
        $this->count += (int) $value;
        return $this;
    }

    /**
     * Get price
     * @return float
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Set parameters
     * @param array $parameters
     * @param int $currencyRate
     * @return $this
     */
    public function setParameters($parameters, $currencyRate = 1)
    {
        if (!empty($parameters) && $currencyRate !== 1) {
            foreach ($parameters as &$parameter) {
                $parameter['price'] = round($parameter['price'] / $currencyRate, 2);
            }
        }
        $this->parameters = $parameters;
        return $this;
    }

    /**
     * Get parameters
     * @return array
     */
    public function getParameters()
    {
        return $this->parameters;
    }

    /**
     * Add file
     * @param array $files
     * @return $this
     */
    public function setFiles($files)
    {
        $this->files = $files;
        return $this;
    }

    /**
     * Get files
     * @return array
     */
    public function getFiles()
    {
        return $this->files;
    }

    /**
     * Add file
     * @param FileDocument $fileDocument
     * @return $this
     */
    public function addFile(FileDocument $fileDocument)
    {
        $this->files[] = $fileDocument->getRecordData();
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
     * @return string
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
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param $key
     * @param string $default
     * @return mixed|string
     */
    public function getOptionValue($key, $default = '')
    {
        return isset($this->options[$key])
            ? $this->options[$key]
            : $default;
    }

    /**
     * @param $key
     * @param $value
     * @return $this
     */
    public function setOptionValue($key, $value)
    {
        $options = $this->getOptions();
        $options[$key] = $value;
        $this->setOptions($options);
        return $this;
    }

    /**
     * Get parameters price
     * @return float|int
     */
    public function getParametersPrice()
    {
        $parametersPrice = 0;
        $parameters = $this->getParameters();
        foreach ($parameters as $parameter) {
            if (!empty($parameter['price'])) {
                $parametersPrice += $parameter['price'];
            }
        }
        $parametersPrice *= $this->getCount();
        return $parametersPrice;
    }

    /**
     * Get price total
     * @return float
     */
    public function getPriceTotal()
    {
        $priceTotal = $this->getPrice() * $this->getCount();
        $parametersPrice = $this->getParametersPrice();
        return $priceTotal + $parametersPrice;
    }

    /**
     * Get parameters string
     * @return string
     */
    public function getParametersString()
    {
        return self::getParametersStrFromArray($this->getParameters());
    }

    /**
     * @param array $parameters
     * @param string $currency
     * @return string
     */
    public static function getParametersStrFromArray($parameters = [], $currency = '')
    {
        $outputArr = [];
        foreach ($parameters as $parameter) {
            $str = '';
            if ($parameter['name']) {
                $str = $parameter['name'];
            }
            if ($parameter['value']) {
                $str .= ": {$parameter['value']}";
            }
            if (!empty($parameter['price'])) {
                $str .= $currency
                    ? " ({$parameter['price']} {$currency})"
                    : " ({$parameter['price']})";
            }
            array_push($outputArr, $str);
        }
        return implode(', ', $outputArr);
    }

    /**
     * Get files string
     * @return string
     */
    public function getFilesString()
    {
        return self::getFilesStrFromArray($this->getFiles());
    }

    /**
     * Get files string from array
     * @param array|null $files
     * @return string
     */
    public static function getFilesStrFromArray($files = null)
    {
        if (!$files) {
            return '';
        }
        $outputArr = [];
        foreach ($files as $file) {
            if ($file instanceof FileDocument) {
                /** @var FileDocument $file */
                $str = $file->getTitle() . '.' . $file->getExtension();
            } else {
                $str = $file['title'] . '.' . $file['extension'];
            }
            array_push($outputArr, $str);
        }
        return implode(', ', $outputArr);
    }

    /**
     * @param $key
     * @param string $default
     * @return mixed|string
     */
    public function getByKey($key, $default = '')
    {
        if (method_exists($this, 'get' . $key)) {
            return call_user_func([$this, 'get' . $key]);
        }
        return $default;
    }

    /**
     * To array
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'title' => $this->getTitle(),
            'count' => $this->getCount(),
            'price' => $this->getPrice(),
            'priceTotal' => $this->getPriceTotal(),
            'image' => $this->getImage(),
            'uri' => $this->getUri(),
            'contentTypeName' => $this->getContentTypeName(),
            'parameters' => $this->getParameters(),
            'files' => $this->getFiles(),
            'parametersString' => '',
            'filesString' => $this->getFilesString()
        ];
    }

    /**
     * From array
     * @param array $data
     * @return $this
     */
    public function fromArray($data)
    {
        $this
            ->setId($data['id'])
            ->setTitle($data['title'])
            ->setCount($data['count'])
            ->setPrice($data['price'])
            ->setImage($data['image'])
            ->setUri($data['uri'])
            ->setContentTypeName($data['contentTypeName'])
            ->setParameters($data['parameters'])
            ->setFiles($data['files']);
        return $this;
    }

    /**
     * @param OrderContent $object
     * @param float|int $currencyRate
     * @return $this
     */
    public function cloneFrom($object, $currencyRate = 1)
    {
        $this
            ->setId($object->getId())
            ->setTitle($object->getTitle())
            ->setCount($object->getCount())
            ->setPrice($object->getPrice(), $currencyRate)
            ->setImage($object->getImage())
            ->setUri($object->getUri())
            ->setContentTypeName($object->getContentTypeName())
            ->setParameters($object->getParameters(), $currencyRate)
            ->setFiles($object->getFiles());

        return $this;
    }
}
