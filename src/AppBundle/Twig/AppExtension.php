<?php

namespace AppBundle\Twig;

use AppBundle\Controller\CartController;
use AppBundle\Controller\CatalogController;
use AppBundle\Service\UtilsService;
use Symfony\Component\BrowserKit\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\RequestContext;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Cache\Simple\FilesystemCache;
use Symfony\Component\HttpFoundation\RequestStack;

class AppExtension extends AbstractExtension
{
    /** @var ContainerInterface */
    protected $container;
    /** @var \Twig_Environment */
    protected $twig;
    /** @var  RequestStack */
    protected $requestStack;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->twig = $this->container->get('twig');
        $this->requestStack = $requestStack;
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
            new TwigFunction('categoriesTree', [$this, 'categoriesTreeFunction']),
            new TwigFunction('shopCart', [$this, 'shopCartFunction']),
            new TwigFunction('twigNextPass', [$this, 'twigNextPassFunction'])
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
     * @param int $parentId
     * @param string $chunkName
     * @param null $data
     * @param bool $cacheEnabled
     * @return string
     */
    public function categoriesTreeFunction($parentId = 0, $chunkName = 'menu_tree', $data = null, $cacheEnabled = false)
    {
        $request = $this->container->get('router.request_context');
        $currentUri = substr($request->getPathInfo(), 1);
        $uriArr = UtilsService::getUriArray($currentUri);

        $cacheKey = 'tree.' . $chunkName;
        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');

        if ($data === null) {
            if ($cacheEnabled && $cache->has($cacheKey)) {
                return $this->twig->createTemplate($cache->get($cacheKey))->render([
                    'currentUri' => $currentUri,
                    'uriArr' => $uriArr
                ]);
            }
            $catalogController = new CatalogController();
            $catalogController->setContainer($this->container);
            $categoriesTree = $catalogController->getCategoriesTree($parentId);
            $data = $categoriesTree[0];
        }
        $templateName = $this->getTemplateName('nav/', $chunkName);
        if (empty($data['children'])) {
            return '';
        }
        $data['currentUri'] = $currentUri;
        $data['uriArr'] = $uriArr;
        $output = $this->twig->render($templateName, $data);
        if (!$cacheEnabled) {
            return $output;
        }

        $cache->set($cacheKey, $output, 60*60*24);

        return $this->twig->createTemplate($output)->render([
            'currentUri' => $currentUri,
            'uriArr' => $uriArr
        ]);
    }

    /**
     * @param string $string
     * @return mixed|string
     */
    public function twigNextPassFunction($string)
    {
        $vars = func_get_args();
        array_splice($vars, 0, 1);
        $output = '{% '. $string . ' %}';
        foreach ($vars as $ind => $var) {
            $output = str_replace('$'.($ind+1), "'{$var}'", $output);
        }
        return str_replace('$', '', $output);
    }

    /**
     * @param string $chunkName
     * @param string $emptyChunkName
     * @return string
     */
    public function shopCartFunction($chunkName = 'shop_cart', $emptyChunkName = '')
    {
        $properties = [
            'countTotal' => 0,
            'priceTotal' => 0,
            'items' => []
        ];

        $request = $this->requestStack->getCurrentRequest();
        $mongoCache = $this->container->get('mongodb_cache');

        $shopCartData = $mongoCache->fetch(CartController::getCartId());
        if (empty($shopCartData)) {
            if ($emptyChunkName) {
                $templateName = $this->getTemplateName('catalog/', $emptyChunkName);
                return $this->twig->render($templateName, $properties);
            } else {
                return '';
            }
        }

        $templateName = $this->getTemplateName('catalog/', $chunkName);

        foreach ($shopCartData as $cName => $products) {
            if (!isset($properties['items'][$cName])) {
                $properties['items'][$cName] = [];
            }
            foreach ($products as $product) {
                $properties['items'][$cName][] = $product;
                if (isset($product['count'])) {
                    $properties['countTotal'] += $product['count'];
                }
                if (isset($product['price'])) {
                    $properties['priceTotal'] += $product['price'];
                }
            }
        }

        return $this->twig->render($templateName, $properties);
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
