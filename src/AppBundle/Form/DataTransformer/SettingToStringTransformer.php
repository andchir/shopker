<?php

namespace AppBundle\Form\DataTransformer;

use AppBundle\Document\Setting;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;

class SettingToStringTransformer implements DataTransformerInterface
{
    private $entityManager;
    private $groupName;

    public function __construct(DocumentManager $entityManager, $groupName = null)
    {
        $this->entityManager = $entityManager;
        $this->groupName = $groupName;
    }

    /**
     * @param $groupName
     */
    public function setGroupName($groupName)
    {
        $this->groupName = $groupName;
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
        $setting = $this->entityManager
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
