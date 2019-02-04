<?php

namespace App\Twig;

use App\Controller\CatalogController;
use App\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Cache\Simple\FilesystemCache;

class AppContentList
{
    /** @var ContainerInterface */
    protected $container;
    /** @var  RequestStack */
    protected $requestStack;

    public function __construct(ContainerInterface $container, RequestStack $requestStack)
    {
        $this->container = $container;
        $this->requestStack = $requestStack;
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $chunkName
     * @param $collectionName
     * @param array $criteria
     * @param array $orderBy
     * @param int $limit
     * @param int $groupSize
     * @param string $cacheKey
     * @param string $pageVar
     * @param string $limitVar
     * @param array $parameters
     * @return string
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public function contentListFunction(
        \Twig_Environment $environment,
        $chunkName,
        $collectionName,
        $criteria,
        $orderBy = ['_id' => 'asc'],
        $limit = 20,
        $groupSize = 1,
        $cacheKey = '',
        $pageVar = 'page',
        $limitVar = 'limit',
        $parameters = []
    )
    {
        if (!$collectionName) {
            return '';
        }
        $request = $this->requestStack->getCurrentRequest();
        $localeDefault = $this->container->getParameter('locale');
        $locale = $request->getLocale();

        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');
        if (!empty($cacheKey)) {
            $cacheKey .= ".{$locale}";
            if ($cache->has("content.{$cacheKey}")) {
                return $cache->get("content.{$cacheKey}");
            }
        }

        $templateName = sprintf('catalog/%s.html.twig', $chunkName);

        $catalogController = new CatalogController();
        $catalogController->setContainer($this->container);
        $collection = $catalogController->getCollection($collectionName);

        $total = $collection->find($criteria)->count();

        $currentUri = $this->getCurrentURI();
        $queryString = $request->getQueryString();
        $options = [
            'pageVar' => $pageVar,
            'limitVar' => $limitVar
        ];
        $queryOptions = UtilsService::getQueryOptions($currentUri, $queryString, [], ['pageSizeArr' => [$limit]], $options);
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, [], $options);

        $aggregateFields = [];
        if ($locale !== $localeDefault) {
            $contentType = $catalogController->getContentTypeRepository()->findOneBy([
                'collection' => $collectionName
            ]);
            if ($contentType) {
                $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
            }
            if (!empty($parameters['headerFieldName']) || $contentType) {
                if (empty($parameters['headerFieldName'])) {
                    $parameters['headerFieldName'] = $contentType->getFieldByChunkName('header');
                }
                $catalogController->applyLocaleFilter($locale, $parameters['headerFieldName'], $criteria);
            }
        }

        $orderBy = array_map(function($orderByDir) {
            return $orderByDir === 'asc' ? 1 : -1;
        }, $orderBy);

        $pipeline = $catalogController->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            $queryOptions['limit'],
            $orderBy,
            $pagesOptions['skip']
        );
        $items = $collection->aggregate($pipeline, [
            'cursor' => []
        ]);

        $output = $environment->render($templateName, array_merge($parameters, [
            'items' => $items,
            'total' => $total,
            'groupSize' => $groupSize,
            'groupCount' => $groupSize ? ceil($items->count(true) / $groupSize) : 1,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]));
        if (!empty($cacheKey)) {
            $cache->set("content.{$cacheKey}", $output, 60*60*24);
        }
        return $output;
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $chunkName
     * @param string $collectionName
     * @param int $contentId
     * @param string $cacheKey
     * @param array $parameters
     * @return string
     * @throws \Psr\SimpleCache\InvalidArgumentException
     * @throws \Twig_Error_Loader
     * @throws \Twig_Error_Runtime
     * @throws \Twig_Error_Syntax
     */
    public function includeContentFunction(
        \Twig_Environment $environment,
        $chunkName,
        $collectionName,
        $contentId,
        $cacheKey = '',
        $parameters = []
    )
    {
        if (!$collectionName) {
            return '';
        }
        $request = $this->requestStack->getCurrentRequest();
        $localeDefault = $this->container->getParameter('locale');
        $locale = $request->getLocale();

        /** @var FilesystemCache $cache */
        $cache = $this->container->get('app.filecache');
        if (!empty($cacheKey)) {
            $cacheKey .= ".{$locale}";
            if ($cache->has("content_inc.{$cacheKey}")) {
                return $cache->get("content_inc.{$cacheKey}");
            }
        }

        $templateName = $chunkName . '.html.twig';

        $catalogController = new CatalogController();
        $catalogController->setContainer($this->container);
        $collection = $catalogController->getCollection($collectionName);
        $criteria = ['_id' => $contentId];

        $aggregateFields = [];
        if ($locale !== $localeDefault) {
            $contentType = $catalogController->getContentTypeRepository()->findOneBy([
                'collection' => $collectionName
            ]);
            if ($contentType) {
                $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
            }
            if (!empty($parameters['headerFieldName']) || $contentType) {
                if (empty($parameters['headerFieldName'])) {
                    $parameters['headerFieldName'] = $contentType->getFieldByChunkName('header');
                }
                $catalogController->applyLocaleFilter($locale, $parameters['headerFieldName'], $criteria);
            }
        }

        $pipeline = $catalogController->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            1
        );
        $document = $collection->aggregate($pipeline, [
            'cursor' => []
        ])->toArray();

        if (empty($document)) {
            return '';
        }
        $document = current($document);
        $document['id'] = $document['_id'];

        $output = $environment->render($templateName, array_merge($parameters, $document));

        if (!empty($cacheKey)) {
            $cache->set("content_inc.{$cacheKey}", $output, 60*60*24);
        }

        return $output;
    }

    /**
     * @return string
     */
    public function getCurrentURI()
    {
        $request = $this->requestStack->getCurrentRequest();
        $currentUri = $request->getRequestUri();
        if (strpos($currentUri, '?') !== false) {
            $currentUri = substr($currentUri, 0, strpos($currentUri, '?'));
        }
        return $currentUri;
    }
}
