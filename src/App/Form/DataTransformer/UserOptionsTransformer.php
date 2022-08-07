<?php

namespace App\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserOptionsTransformer implements DataTransformerInterface
{
    protected $translator;
    protected $subKey = '';

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function transform($optionsData)
    {
        if (!is_array($optionsData)) {
            return [];
        }
        $options = [];
        foreach ($optionsData as $option) {
            if (!is_array($option) || !isset($option['name'])) {
                continue;
            }
            if ($this->subKey) {
                if (strpos($option['name'], $this->subKey . '.') === false) {
                    continue;
                }
                $options[str_replace($this->subKey . '.', '', $option['name'])] = $option['value'];
            } else {
                $options[$option['name']] = $option['value'];
            }
        }
        return $options;
    }

    public function reverseTransform($options)
    {
        if (!is_array($options)) {
            return [];
        }
        $optionsData = [];
        foreach ($options as $key => $value) {
            $optionsData[] = [
                'name' => $this->subKey ? $this->subKey . '.' . $key : $key,
                'title' => $this->translator->trans('user_options.' . $key),
                'value' => $value
            ];
        }
        return $optionsData;
    }

    /**
     * @param string $subKey
     * @return $this
     */
    public function setSubKey($subKey)
    {
        $this->subKey = $subKey;
        return $this;
    }
}
