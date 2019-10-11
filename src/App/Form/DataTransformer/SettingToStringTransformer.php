<?php

namespace App\Form\DataTransformer;

use App\MainBundle\Document\Setting;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class SettingToStringTransformer implements DataTransformerInterface
{
    private $documentManager;
    private $groupName;

    public function __construct(DocumentManager $documentManager, $groupName = null)
    {
        $this->documentManager = $documentManager;
        $this->groupName = $groupName;
    }

    /**
     * @param string $groupName
     * @return $this
     */
    public function setGroupName($groupName)
    {
        $this->groupName = $groupName;
        return $this;
    }

    /**
     * @param mixed $valueString
     * @return Setting|null
     */
    public function transform($valueString)
    {
        if (!$valueString) {
            return null;
        }
        $setting = $this->documentManager
            ->getRepository(Setting::class)
            ->getSetting($valueString, $this->groupName);

        if (null === $setting) {
            throw new TransformationFailedException(sprintf(
                'Setting with name "%s" does not exist.',
                $valueString
            ));
        }
        return $setting;
    }

    /**
     * @param Setting|null $setting
     * @return string
     */
    public function reverseTransform($setting)
    {
        if (null === $setting) {
            return '';
        }
        return $setting->getName();
    }

}
