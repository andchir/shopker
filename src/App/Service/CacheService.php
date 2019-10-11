<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\ContainerInterface;

class CacheService {

    /** @var ContainerInterface */
    protected $container;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * Get cache data
     * @param string $cacheKey
     * @return array|null
     */
    public function getContent($cacheKey)
    {
        $mongoCache = $this->container->get('mongodb_cache');
        return $mongoCache->fetch($cacheKey);
    }

    /**
     * Clear cache data
     * @param $cacheKey
     */
    public function clearContent($cacheKey)
    {
        $mongoCache = $this->container->get('mongodb_cache');
        $mongoCache->delete($cacheKey);
    }
}
