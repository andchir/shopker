<?php

namespace App\Repository;

use App\MainBundle\Document\Setting;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

/**
 * SettingRepository
 */
class SettingRepository extends DocumentRepository
{
    /**
     * @param bool $returnArray
     * @return array
     */
    public function getAll($returnArray = false)
    {
        $output = [];
        $settings = $this->findBy([], ['id' => 'asc']);
        /** @var Setting $setting */
        foreach ($settings as $setting) {
            if (!isset($output[$setting->getGroupName()])) {
                $output[$setting->getGroupName()] = [];
            }
            $output[$setting->getGroupName()][] = $returnArray
                ? $setting->toArray()
                : $setting;
        }
        return $output;
    }

    /**
     * @param $groupName
     * @return array
     */
    public function getSettingsGroup($groupName)
    {
        return $this->findBy([
            'groupName' => $groupName
        ], ['id' => 'asc']);
    }

    /**
     * @param string $settingName
     * @param string|null $groupName
     * @return object
     */
    public function getSetting($settingName, $groupName = null)
    {
        if (null === $groupName) {
            return $this->findOneBy([
                'name' => $settingName
            ]);
        } else {
            return $this->findOneBy([
                'groupName' => $groupName,
                'name' => $settingName
            ]);
        }
    }

}
