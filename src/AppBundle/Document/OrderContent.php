<?php

namespace AppBundle\Document;

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
     */
    protected $uniqId;

    /**
     * @MongoDB\Field(type="int")
     * @Groups({"details", "list"})
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $title;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $image;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $uri;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $contentTypeName;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     */
    protected $count;

    /**
     * @MongoDB\Field(type="float")
     * @Groups({"details", "list"})
     */
    protected $price;

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     * @Groups({"details"})
     */
    protected $parameters = [];

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     * @Groups({"details"})
     */
    protected $files = [];

    /**
     * Get uniqId
     *
     * @return $uniqId
     */
    public function getUniqId()
    {
        return $this->uniqId;
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
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set image
     *
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
     *
     * @return string $image
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set uri
     *
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
     *
     * @return string $uri
     */
    public function getUri()
    {
        return $this->uri;
    }

    /**
     * Set contentTypeName
     *
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
     *
     * @return string $contentTypeName
     */
    public function getContentTypeName()
    {
        return $this->contentTypeName;
    }

    /**
     * Set count
     *
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
     *
     * @return float $count
     */
    public function getCount()
    {
        return $this->count;
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
     * @return float $price
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Set parameters
     *
     * @param $parameters
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
     *
     * @return array $parameters
     */
    public function getParameters()
    {
        return $this->parameters;
    }

    /**
     * Add file
     *
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
     *
     * @return array
     */
    public function getFiles()
    {
        return $this->files;
    }

    /**
     * @param FileDocument $fileDocument
     * @return $this
     */
    public function addFile(FileDocument $fileDocument)
    {
        $this->files[] = $fileDocument->getRecordData();
        return $this;
    }

    /**
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
                $str = "{$parameter['name']}: ";
            }
            $str .= $parameter['value'];
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
     * @param array|null $files
     * @return string
     */
    public static function getFilesStrFromArray($files = null)
    {
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
            'parameters' => $this->getParameters()
        ];
    }

    /**
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
            ->setParameters($data['parameters']);
            //->setFiles($data['files']);
        return $this;
    }
}
