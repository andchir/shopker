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
            new TwigFilter('price', array($this, 'priceFilter')),
            new TwigFilter('outputType', array($this, 'outputTypeFilter'))
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
     * @param $type
     * @param $properties
     * @param array $options
     * @return string
     */
    public function outputTypeFilter($value, $type, $properties, $options = [])
    {
        if (!$value) {
            return '';
        }
        /** @var \Twig_Environment $twig */
        $twig = $this->container->get('twig');
        $chunkName = !empty($properties['chunkName']) ? $properties['chunkName'] : $type;
        $properties = array_merge($properties, $options, ['value' => $value]);
        $properties['systemName'] = !empty($options[$properties['systemNameField']])
            ? $options[$properties['systemNameField']]
            : '';
        $templateName = sprintf('chunks/fields/%s.html.twig', $chunkName);
        if (!$twig->getLoader()->exists($templateName)) {
            $templateName = sprintf('chunks/fields/%s.html.twig', 'text');
        }
        return $twig->render($templateName, $properties);
    }

}
