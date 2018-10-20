<?php

namespace App\Routing;

use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class CatalogLoader extends Loader
{
    private $loaded = false;
    private $routeName = 'catalog';

    public function load($resource, $type = null)
    {
        if (true === $this->loaded) {
            throw new \RuntimeException('Do not add the "' . $this->routeName . '" loader twice');
        }

        $routes = new RouteCollection();

        // prepare a new route
        $path = '/' . $this->routeName . '/{parameter}';
        $defaults = array(
            '_controller' => 'App\Controller\CatalogController::indexAction',
        );
        $requirements = array(
            'parameter' => '[a-z1-9\/-_\.]+',
        );
        $route = new Route($path, $defaults, $requirements);

        // add the new route to the route collection
        $routeName = 'catalogRoute';
        $routes->add($routeName, $route);

        $this->loaded = true;

        return $routes;
    }

    public function supports($resource, $type = null)
    {
        return $this->routeName === $type;
    }
}
