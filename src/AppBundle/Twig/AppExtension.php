<?php

namespace AppBundle\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Symfony\Component\DependencyInjection\ContainerInterface;

class AppExtension extends AbstractExtension
{
    /** @var ContainerInterface */
    protected $container;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getFilters()
    {
        return array(
            new TwigFilter('price', [$this, 'priceFilter']),
            new TwigFilter('outputType', [$this, 'outputTypeFilter']),
            new TwigFilter('outputTypeArray', [$this, 'outputTypeArrayFilter'])
        );
    }

    public function getFunctions()
    {
        return array(
            new TwigFunction('catalogPath', array($this, 'catalogPathFunction'))
        );
    }

    public function catalogPathFunction($parentUri = '', $systemName = '')
    {
        $baseUrl = $this->container->get('router')->getContext()->getBaseUrl();
        $path = $baseUrl;
        if ($parentUri) {
            $path .= '/' . $parentUri;
        }
        $path .= $systemName;
        return $path;
    }

    public function priceFilter($number, $decimals = 0, $decPoint = '.', $thousandsSep = ' ')
    {
        $price = number_format($number, $decimals, $decPoint, $thousandsSep);
        return $price;
    }

    /**
     * @param $value
     * @param string $type
     * @param array $properties
     * @param array $options
     * @return string
     */
    public function outputTypeFilter($value, $type, $properties, $options = [])
    {
        if (empty($value)) {
            $value = '';
        }
        /** @var \Twig_Environment $twig */
        $twig = $this->container->get('twig');
        $chunkName = !empty($properties['chunkName']) ? $properties['chunkName'] : $type;
        $chunkNamePrefix = !empty($properties['chunkPrefix'])
            ? $properties['chunkPrefix']
            : '';
        $chunkNameSuffix = empty($value) ? '_empty' : '';
        if (is_array($value)) {
            $properties = array_merge($properties, $options, ['value' => '', 'data' => $value]);
        } else {
            $properties = array_merge($properties, $options, ['value' => $value]);
        }
        $properties['systemName'] = !empty($options[$properties['systemNameField']])
            ? $options[$properties['systemNameField']]
            : '';
        $templateName = sprintf('chunks/fields/%s%s%s.html.twig', $chunkNamePrefix, $chunkName, $chunkNameSuffix);
        if (!$twig->getLoader()->exists($templateName)) {
            if (empty($value)) {
                return '';
            }
            if ($chunkNamePrefix
                && $twig->getLoader()->exists(sprintf('chunks/fields/%s.html.twig',  $chunkName))) {
                $templateName = sprintf('chunks/fields/%s.html.twig',  $chunkName);
            } else {
                $templateName = sprintf('chunks/fields/%s.html.twig', 'text');
            }
        }
        return $twig->render($templateName, $properties);
    }

    /**
     * @param $itemData
     * @param $fields
     * @param string $chunkPrefix
     * @return string
     */
    public function outputTypeArrayFilter($itemData, $fields, $chunkPrefix = '')
    {
        if (empty($itemData)) {
            return '';
        }
        $output = '';
        foreach ($fields as $field) {
            $output .= $this->outputTypeFilter(
                $itemData[$field['name']],
                $field['type'],
                array_merge($field['properties'], ['chunkPrefix' => $chunkPrefix]),
                $itemData
            );
        }
        return $output;
    }

}
