<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use \Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="content_type",repositoryClass="App\Repository\ContentTypeRepository")
 */
class ContentType
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
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $collection;

    /**
     * @MongoDB\Field(type="collection")
     * @Groups({"details"})
     * @var array
     */
    protected $fields;

    /**
     * @MongoDB\Field(type="collection")
     * @Groups({"details"})
     * @var array
     */
    protected $groups;
    
    /**
     * @MongoDB\Field(type="bool")
     * @Groups({"details", "list"})
     * @var bool
     */
    protected $isCreateByUsersAllowed;

    /**
     * @MongoDB\Field(type="bool")
     * @Groups({"details", "list"})
     * @var bool
     */
    protected $isActive;

    /**
     * @MongoDB\ReferenceMany(targetDocument="App\MainBundle\Document\Category", mappedBy="contentType")
     * @var array
     */
    protected $categories;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
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
     * Set fields
     *
     * @param array $fields
     * @return $this
     */
    public function setFields($fields)
    {
        $this->fields = $fields;
        return $this;
    }

    /**
     * Get fields
     *
     * @return array
     */
    public function getFields()
    {
        return $this->fields;
    }

    /**
     * Set groups
     *
     * @param array $groups
     * @return $this
     */
    public function setGroups($groups)
    {
        $this->groups = $groups;
        return $this;
    }

    /**
     * Get groups
     *
     * @return array
     */
    public function getGroups()
    {
        return $this->groups;
    }

    /**
     * Set collection
     *
     * @param string $collection
     * @return $this
     */
    public function setCollection($collection)
    {
        $this->collection = $collection;
        return $this;
    }

    /**
     * Get collection
     *
     * @return string
     */
    public function getCollection()
    {
        return $this->collection;
    }

    /**
     * Set isActive
     *
     * @param bool $isActive
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
     * @return bool
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
            'collection' => $this->getCollection(),
            'isCreateByUsersAllowed' => $this->getIsCreateByUsersAllowed(),
            'isActive' => $this->getIsActive()
        ];
        if($full){
            $output = array_merge($output, [
                'groups' => $this->getGroups(),
                'fields' => $this->getFields()
            ]);
        }
        return $output;
    }

    /**
     * Add category
     *
     * @param Category $category
     * @return $this
     */
    public function addCategory(Category $category)
    {
        $this->categories->add($category);
        return $this;
    }

    /**
     * Remove category
     *
     * @param Category $category
     * @return $this
     */
    public function removeCategory(Category $category)
    {
        $this->categories->removeElement($category);
        return $this;
    }

    /**
     * Get categories
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCategories()
    {
        return $this->categories;
    }

    /**
     * Clean field name
     * @param string $fieldName
     * @return string
     */
    public static function getCleanFieldName($fieldName) {
        if (strpos($fieldName, '__') !== false) {
            $tmp = explode('__', $fieldName);
            if (isset($tmp[1]) && is_numeric($tmp[1])) {
                $fieldName = $tmp[0];
            }
        }
        return $fieldName;
    }

    /**
     * Get current file name
     * @param string $fieldKey
     * @param array $fieldsSort
     * @return string
     */
    public static function getCurrentFieldName($fieldKey, $fieldsSort)
    {
        if (!in_array($fieldKey, $fieldsSort)) {
            return $fieldKey;
        }
        $fieldName = ContentType::getCleanFieldName($fieldKey);
        $num = 0;
        foreach ($fieldsSort as $fldName) {
            if (strpos($fldName, $fieldName . '__') !== false) {
                $num++;
                if ($fldName === $fieldKey) {
                    break;
                }
            }
        }
        return $fieldName . '__' . $num;
    }

    /**
     * @param string $chunkName
     * @param string $default
     * @return false|int|string
     */
    public function getFieldByChunkName($chunkName, $default = '')
    {
        $contentTypeFields = $this->getFields();
        $index = array_search(
            $chunkName,
            array_map( function($outputProperties) {
                return $outputProperties['chunkName'] ?? '';
            }, array_column($contentTypeFields, 'outputProperties'))
        );
        return $index !== false ? $contentTypeFields[$index]['name'] : $default;
    }

    /**
     * @param $fieldName
     * @return array|null
     */
    public function getFieldByName($fieldName)
    {
        $contentTypeFields = $this->getFields();
        $fields = array_filter($contentTypeFields, function($contentTypeField) use ($fieldName) {
            return in_array($fieldName, [$contentTypeField['name'], $contentTypeField['title']]);
        });
        $fields = array_merge($fields);
        return !empty($fields) ? $fields[0] : null;
    }

    /**
     * Get system field name
     * @return string
     */
    public function getSystemNameField()
    {
        $output = '';
        $contentTypeFields = $this->getFields();
        foreach ($contentTypeFields as $contentTypeField) {
            if (!empty($contentTypeField['inputType'])
                && $contentTypeField['inputType'] == 'system_name') {
                    $output = $contentTypeField['name'];
                    break;
            }
        }
        return $output;
    }

    /**
     * @return mixed|string
     */
    public function getCategoriesFieldName()
    {
        $contentTypeFields = $this->getFields();
        $categoriesField = array_filter($contentTypeFields, function($field){
            return $field['inputType'] == 'categories';
        });
        $categoriesField = array_merge($categoriesField);
        return !empty($categoriesField) ? $categoriesField[0]['name'] : '';
    }

    /**
     * Get price field name
     * @return string
     */
    public function getPriceFieldName()
    {
        return $this->getFieldByChunkName('price');
    }

    /**
     * @param string $inputType
     * @return array
     */
    public function getByInputType($inputType)
    {
        $fields = array_filter($this->getFields(), function($field) use ($inputType) {
            return $field['inputType'] === $inputType;
        });
        $fields = array_merge($fields);
        return array_map(function($field) {
            return $field['name'];
        }, $fields);
    }
    
    /**
     * @param string $showFlagName
     * @param string $sortField
     * @param array $filterFields
     * @return array
     */
    public function getFieldsByFlag($showFlagName = 'showInList', $sortField = 'listOrder', $filterFields = [])
    {
        $fields = array_filter($this->getFields(), function($field) use ($showFlagName) {
            return !empty($field[$showFlagName]);
        });
        if (!empty($filterFields)) {
            $fields = array_filter($fields, function($field) use ($filterFields) {
                return !in_array($field['name'], $filterFields);
            });
        }
        if ($sortField) {
            usort($fields, function($a, $b) use ($sortField) {
                if (!isset($a[$sortField])) {
                    $a[$sortField] = 0;
                }
                if (!isset($b[$sortField])) {
                    $b[$sortField] = 0;
                }
                if ($a[$sortField] == $b[$sortField]) {
                    return 0;
                }
                return ($a[$sortField] < $b[$sortField]) ? -1 : 1;
            });
        }
        return array_merge($fields);
    }
    
    /**
     * @param array $filterFields
     * @return array
     */
    public function getFieldsForList($filterFields = [])
    {
        return $this->getFieldsByFlag('showInList', 'listOrder', $filterFields);
    }
    
    /**
     * @param array $filterFields
     * @return array
     */
    public function getFieldsForPage($filterFields = [])
    {
        return $this->getFieldsByFlag('showOnPage', 'pageOrder', $filterFields);
    }

    /**
     * @param array $data
     * @param string $locale
     * @param string $fieldName
     * @return string
     */
    public static function getValueByLocale($data, $locale = '', $fieldName = 'title')
    {
        if (!$locale || !isset($data['translations']) || !is_array($data['translations'])) {
            return $data[$fieldName] ?? '';
        }
        return !empty($data['translations'][$fieldName]) && !empty($data['translations'][$fieldName][$locale])
            ? $data['translations'][$fieldName][$locale]
            : $data[$fieldName] ?? '';
    }

    /**
     * @param string $locale
     * @param string $localeDefault
     * @param bool $addFieldsOnly
     * @return array
     */
    public function getAggregationFields($locale, $localeDefault, $addFieldsOnly = false)
    {
        $aggregateFields = [];
        if ($locale === $localeDefault && $addFieldsOnly) {
            return [];
        }
        foreach ($this->getFields() as $contentTypeField) {
            if ($locale !== $localeDefault
                && in_array($contentTypeField['inputType'], ['text', 'textarea', 'rich_text'])) {
                    $aggregateFields[$contentTypeField['name']] = "\$translations.{$contentTypeField['name']}.{$locale}";
            } else if (!$addFieldsOnly) {
                $aggregateFields[$contentTypeField['name']] = 1;
            }
        }
        if (!$addFieldsOnly) {
            $aggregateFields['parentId'] = 1;
        }
        return $aggregateFields;
    }
    
    /**
     * @return bool
     */
    public function getIsCreateByUsersAllowed()
    {
        return $this->isCreateByUsersAllowed;
    }
    
    /**
     * @param bool $isCreateByUsersAllowed
     * @return ContentType
     */
    public function setIsCreateByUsersAllowed($isCreateByUsersAllowed)
    {
        $this->isCreateByUsersAllowed = $isCreateByUsersAllowed;
        return $this;
    }
}
