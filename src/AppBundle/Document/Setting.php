<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="settings",repositoryClass="AppBundle\Repository\SettingRepository")
 */
class Setting
{
    const GROUP_MAIN = 'SETTINGS_MAIN';
    const GROUP_ORDER_STATUSES = 'SETTINGS_ORDER_STATUSES';
    const GROUP_DELIVERY = 'SETTINGS_DELIVERY';
    const GROUP_PAYMENT = 'SETTINGS_PAYMENT';

    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details"})
     */
    private $id;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    private $name;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details"})
     */
    private $description;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details"})
     */
    private $groupName;

    /**
     * @MongoDB\Field(type="hash")
     * @Groups({"details", "list"})
     */
    private $options;

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
     * Set name
     *
     * @param string $name
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return self
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set groupName
     *
     * @param string $groupName
     * @return self
     */
    public function setGroupName($groupName)
    {
        $this->groupName = $groupName;
        return $this;
    }

    /**
     * Get groupName
     *
     * @return string $groupName
     */
    public function getGroupName()
    {
        return $this->groupName;
    }

    /**
     * Set options
     *
     * @param array $options
     * @return self
     */
    public function setOptions($options)
    {
        $this->options = $options;
        return $this;
    }

    /**
     * Get options
     * @param bool $pretty
     * @return mixed
     */
    public function getOptions($pretty = false)
    {
        if (!$pretty) {
            return $this->options;
        }
        $output = [];
        foreach ($this->options as $key => $val) {
            $output[$key] = $val['type'] === 'number'
                ? floatval($val['value'])
                : $val['value'];
        }
        return $output;
    }

    /**
     * @param array $newOptions
     */
    public function updateOptionsValues($newOptions)
    {
        $options = $this->getOptions();
        foreach ($options as $key => &$option) {
            if (isset($newOptions[$key]) && isset($newOptions[$key]['value'])) {
                $option['value'] = $newOptions[$key]['value'];
                if ($option['type'] == 'number' && is_string($newOptions[$key]['value'])) {
                    $option['value'] = preg_replace('/[^0-9,\.]/', '', strval($option['value']));
                    $option['value'] = (float) str_replace(',', '.', $option['value']);
                }
            }
        }
        $this->setOptions($options);
    }

    /**
     * @param string $optionName
     * @return mixed
     */
    public function getOption($optionName)
    {
        $output = null;
        $options = $this->getOptions();
        if (isset($options[$optionName])
            && isset($options[$optionName]['value'])) {
                $output = $options[$optionName]['value'];
        }
        return $output;
    }

    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'description' => $this->getDescription(),
            'options' => $this->getOptions(true)
        ];
    }
}
