<?php

namespace AppBundle\Twig;

use AppBundle\Controller\CatalogController;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Symfony\Component\DependencyInjection\ContainerInterface;

class AppExtension extends AbstractExtension
{
    /** @var ContainerInterface */
    protected $container;
    /** @var \Twig_Environment */
    protected $twig;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->twig = $this->container->get('twig');
    }

    public function getFilters()
    {
        return array(
            new TwigFilter('price', [$this, 'priceFilter'])
        );
    }

    public function getFunctions()
    {
        return array(
            new TwigFunction('catalogPath', array($this, 'catalogPathFunction')),
            new TwigFunction('outputFilter', [$this, 'outputFilterFunction']),
            new TwigFunction('outputType', [$this, 'outputTypeFunction']),
            new TwigFunction('outputTypeArray', [$this, 'outputTypeArrayFunction']),
            new TwigFunction('outputTypeChunk', [$this, 'outputTypeChunkFunction']),
            new TwigFunction('categoriesTree', [$this, 'categoriesTreeFunction'])
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
    public function outputTypeFunction($value, $type, $properties, $options = [])
    {
        if (empty($value)) {
            $value = '';
        }
        $chunkName = !empty($properties['chunkName']) ? $properties['chunkName'] : $type;
        $chunkNamePrefix = !empty($properties['chunkNamePrefix'])
            ? $properties['chunkNamePrefix']
            : '';
        if (is_array($value)) {
            $properties = array_merge($properties, $options, ['value' => '', 'data' => $value]);
        } else {
            $properties = array_merge($properties, $options, ['value' => $value]);
        }
        $properties['systemName'] = !empty($options[$properties['systemNameField']])
            ? $options[$properties['systemNameField']]
            : '';
        if (!empty($value)) {
            $templateName = $this->getTemplateName(
                'chunks/fields/',
                $chunkName,
                $chunkNamePrefix,
                '',
                'text'
            );
        } else {
            $templateName = $this->getTemplateName(
                'chunks/fields/',
                $chunkName,
                $chunkNamePrefix,
                '_empty',
                'empty'
            );
        }
        return $this->twig->render($templateName, $properties);
    }

    /**
     * @param $itemData
     * @param $fields
     * @param string $chunkNamePrefix
     * @return string
     */
    public function outputTypeArrayFunction($itemData, $fields, $chunkNamePrefix = '')
    {
        if (empty($itemData)) {
            return '';
        }
        $output = '';
        foreach ($fields as $field) {
            if (!isset($itemData[$field['name']])) {
                continue;
            }
            $output .= $this->outputTypeFunction(
                $itemData[$field['name']],
                $field['type'],
                array_merge($field['properties'], ['chunkNamePrefix' => $chunkNamePrefix]),
                $itemData
            );
        }
        return $output;
    }

    /**
     * @param array $filtersData
     * @param string $chunkNamePrefix
     * @return string
     */
    public function outputFilterFunction($filtersData, $chunkNamePrefix = '')
    {
        if (empty($filtersData)) {
            return '';
        }
        $templateName = $this->getTemplateName('chunks/filters/', $filtersData['outputType'], $chunkNamePrefix);
        return $this->twig->render($templateName, ['filter' => $filtersData]);
    }

    /**
     * @param array $itemData
     * @param array $fields
     * @param string $chunkName
     * @param string $chunkNamePrefix
     * @return string
     */
    public function outputTypeChunkFunction($itemData, $fields, $chunkName, $chunkNamePrefix = '')
    {
        $chunkNamesArr = array_column(array_column($fields, 'properties'), 'chunkName');
        $index = array_search($chunkName, $chunkNamesArr);
        if ($index === false) {
            return '';
        }

        $field = $fields[$index];
        $value = $itemData[$field['name']];
        if (is_array($value)) {
            $properties = array_merge($field['properties'], ['value' => '', 'data' => $value]);
        } else {
            $properties = array_merge($field['properties'], ['value' => $value]);
        }
        if (!empty($value)) {
            $templateName = $this->getTemplateName('chunks/fields/', $chunkName, $chunkNamePrefix);
        } else {
            $templateName = $this->getTemplateName(
                'chunks/fields/',
                $chunkName,
                $chunkNamePrefix,
                '_empty',
                'empty'
            );
        }

        return $this->twig->render($templateName, $properties);
    }

    /**
     * @param $parentId
     * @param string $chunkName
     * @param string $chunkNamePrefix
     * @return string
     */
    public function categoriesTreeFunction($parentId = 0, $chunkName = 'menu_tree', $chunkNamePrefix = '')
    {
        $catalogController = new CatalogController();
        $catalogController->setContainer($this->container);
        $categoriesTree = $catalogController->getCategoriesTree();

        $templateName = $this->getTemplateName('nav/', $chunkName, $chunkNamePrefix);

        return $this->twig->render($templateName, $categoriesTree[0]);
    }

    /**
     * @param $path
     * @param string $chunkName
     * @param string $chunkNamePrefix
     * @param string $chunkNameSuffix
     * @param string $defaultName
     * @return string
     */
    public function getTemplateName($path, $chunkName, $chunkNamePrefix = '', $chunkNameSuffix = '', $defaultName = 'default')
    {
        $templateName = sprintf($path . '%s%s%s.html.twig', $chunkNamePrefix, $chunkName, $chunkNameSuffix);
        if (!$this->twig->getLoader()->exists($templateName)) {
            $templateName = $path . $defaultName . '.html.twig';
        }
        return $templateName;
    }

}
