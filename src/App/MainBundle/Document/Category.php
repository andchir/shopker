<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="category",repositoryClass="App\Repository\CategoryRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class Category
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $id;

    /**
     * @MongoDB\Field(type="int")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $parentId;

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
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details", "list"})
     * @var string
     */
    protected $uri;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $description;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $contentTypeName;

    /**
     * @MongoDB\Field(type="boolean")
     * @Groups({"details", "list"})
     * @var boolean
     */
    protected $isFolder;

    /**
     * @MongoDB\Field(type="boolean")
     * @Groups({"details", "list"})
     * @var boolean
     */
    protected $isActive;

    /**
     * @MongoDB\Field(type="hash")
     * @Groups({"details", "list"})
     * @var array
     */
    protected $image;

    /**
     * @MongoDB\Field(type="int")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $menuIndex;

    /**
     * @MongoDB\ReferenceOne(targetDocument="App\MainBundle\Document\ContentType", inversedBy="category")
     * @Groups({"details", "list"})
     * @var ContentType
     */
    protected $contentType;

    /**
     * @MongoDB\ReferenceOne(targetDocument="App\MainBundle\Document\Filter", inversedBy="category", orphanRemoval=true, cascade={"all"})
     * @Groups({"details", "list"})
     * @var Filter
     */
    protected $filterData;

    /**
     * @MongoDB\Field(type="hash")
     * @Groups({"details", "list"})
     * @var array
     */
    protected $translations;

    /**
     * Get id
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set ID
     *
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
     * @param string $locale
     * @return string
     */
    public function getTitle($locale = '')
    {
        if (!$locale || !is_array($this->translations)) {
            return $this->title;
        }
        return !empty($this->translations['title']) && !empty($this->translations['title'][$locale])
            ? $this->translations['title'][$locale]
            : $this->title;
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
     * @param string $locale
     * @return string
     */
    public function getUri($locale = '')
    {
        if ($locale) {
            return $locale . '/' . $this->uri;
        }
        return $this->uri;
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
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set parentId
     *
     * @param int $parentId
     * @return $this
     */
    public function setParentId($parentId)
    {
        $this->parentId = $parentId;
        return $this;
    }

    /**
     * Get parentId
     *
     * @return int
     */
    public function getParentId()
    {
        return $this->parentId;
    }

    /**
     * To array
     * @param string $locale
     * @return array
     */
    public function toArray($locale = '')
    {
        return [
            'id' => $this->getId(),
            'parentId' => $this->getParentId(),
            'name' => $this->getName(),
            'title' => $this->getTitle($locale),
            'description' => $this->getDescription(),
            'contentTypeName' => $this->getContentTypeName(),
            'menuIndex' => $this->getMenuIndex(),
            'isFolder' => $this->getIsFolder(),
            'isActive' => $this->getIsActive()
        ];
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
     * @return string
     */
    public function getContentTypeName()
    {
        return $this->contentTypeName;
    }

    /**
     * Set filterData
     *
     * @param Filter $filterData
     * @return $this
     */
    public function setFilterData($filterData)
    {
        $this->filterData = $filterData;
        return $this;
    }

    /**
     * Get filterData
     * @return Filter
     */
    public function getFilterData()
    {
        return $this->filterData;
    }

    /**
     * Set isFolder
     *
     * @param boolean $isFolder
     * @return $this
     */
    public function setIsFolder($isFolder)
    {
        $this->isFolder = $isFolder;
        return $this;
    }

    /**
     * Get isFolder
     *
     * @return boolean
     */
    public function getIsFolder()
    {
        return $this->isFolder;
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
     * Set contentType
     *
     * @param ContentType $contentType
     * @return $this
     */
    public function setContentType(ContentType $contentType)
    {
        $this->contentType = $contentType;
        return $this;
    }

    /**
     * Get contentType
     *
     * @return ContentType $contentType
     */
    public function getContentType()
    {
        return $this->contentType;
    }

    /**
     * Get menu data
     * @param array $breadcrumbsUriArr
     * @param string $locale
     * @return array
     */
    public function getMenuData($breadcrumbsUriArr = [], $locale = '')
    {
        return [
            'id' => $this->getId(),
            'title' => $this->getTitle($locale),
            'name' => $this->getName(),
            'description' => $this->getDescription(),
            'uri' => $this->getUri(),
            'image' => $this->getImage(),
            'isActive' => in_array($this->getUri(), $breadcrumbsUriArr),
            'menuIndex' => $this->getMenuIndex(),
            'translations' => $this->getTranslations(),
            'children' => []
        ];
    }

    /**
     * Parse uri
     * @param string $uri
     * @return array
     */
    public static function parseUri($uri)
    {
        if (strrpos($uri, '/') === false) {
            $pageAlias = $uri;
        } else {
            $pageAlias = strrpos($uri, '/') < strlen($uri) - 1
                ? substr($uri, strrpos($uri, '/')+1)
                : '';
        }
        $parentUri = strrpos($uri, '/') !== false
            ? substr($uri, 0, strrpos($uri, '/')+1)
            : '';
        $levelNum = substr_count($parentUri, '/');
        return [$pageAlias, $parentUri, $levelNum];
    }


    /**
     * Set image
     *
     * @param array $image
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
     * @return array
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set menuIndex
     *
     * @param int $menuIndex
     * @return $this
     */
    public function setMenuIndex($menuIndex)
    {
        $this->menuIndex = $menuIndex;
        return $this;
    }

    /**
     * Get menuIndex
     *
     * @return int
     */
    public function getMenuIndex()
    {
        return $this->menuIndex;
    }

    /**
     * Set translations
     *
     * @param array $translations
     * @return $this
     */
    public function setTranslations($translations)
    {
        $this->translations = $translations;
        return $this;
    }

    /**
     * Get translations
     *
     * @return array $translations
     */
    public function getTranslations()
    {
        return $this->translations;
    }
}
