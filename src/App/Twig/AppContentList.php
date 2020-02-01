<?php

namespace App\Twig;

use App\MainBundle\Document\ContentType;
use App\Service\CatalogService;
use App\Service\UtilsService;
use Psr\Cache\CacheItemInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

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
     * @param \Twig\Environment $environment
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
     */
    public function contentListFunction(
        \Twig\Environment $environment,
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

        $cacheItemHtml = null;
        if (!empty($cacheKey)) {
            /** @var FilesystemAdapter $cache */
            $cache = $this->container->get('app.filecache');
            /** @var CacheItemInterface $cacheItemHtml */
            $cacheItemHtml = $cache->getItem("content.{$cacheKey}.{$locale}");
            if ($cacheItemHtml && $cacheItemHtml->isHit()) {
                return $cacheItemHtml->get();
            }
        }
        $templateName = sprintf('catalog/%s.html.twig', $chunkName);

        /** @var CatalogService $catalogService */
        $catalogService = $this->container->get('app.catalog');
        $collection = $catalogService->getCollection($collectionName);

        $total = $collection->countDocuments($criteria);

        $currentUri = $this->getCurrentURI();
        $queryString = $request->getQueryString();
        $options = [
            'pageVar' => $pageVar,
            'limitVar' => $limitVar
        ];
        $queryOptions = UtilsService::getQueryOptions($currentUri, $queryString, [], ['pageSizeArr' => [$limit]], $options);
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, [], $options);

        /** @var ContentType $contentType */
        $contentType = $catalogService->getContentTypeRepository()->findOneBy([
            'collection' => $collectionName
        ]);

        $aggregateFields = [];
        if ($locale !== $localeDefault) {
            if ($contentType) {
                $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
            }
            if (!empty($parameters['headerFieldName']) || $contentType) {
                if (empty($parameters['headerFieldName'])) {
                    $parameters['headerFieldName'] = $contentType->getFieldByChunkName('header');
                }
                $catalogService->applyLocaleFilter($locale, $parameters['headerFieldName'], $criteria);
            }
        }

        $orderBy = array_map(function($orderByDir) {
            return $orderByDir === 'asc' ? 1 : -1;
        }, $orderBy);

        $pipeline = $catalogService->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            $queryOptions['limit'],
            $orderBy,
            $pagesOptions['skip']
        );
        $items = $collection->aggregate($pipeline, [
            'cursor' => []
        ])->toArray();

        $output = $environment->render($templateName, array_merge($parameters, [
            'items' => $items,
            'total' => $total,
            'fields' => $contentType ? $contentType->getFields() : [],
            'systemNameField' => $contentType ? $contentType->getSystemNameField() : '',
            'groupSize' => $groupSize,
            'groupCount' => $groupSize ? ceil(count($items) / $groupSize) : 1,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]));
        if ($cacheItemHtml) {
            $cacheItemHtml->set($output);
            $cache->save($cacheItemHtml);
        }
        return $output;
    }

    /**
     * @param \Twig\Environment $environment
     * @param string $chunkName
     * @param string $collectionName
     * @param int $contentId
     * @param string $cacheKey
     * @param array $parameters
     * @return string
     */
    public function includeContentFunction(
        \Twig\Environment $environment,
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

        /** @var FilesystemAdapter $cache */
        $cache = $this->container->get('app.filecache');
        /** @var CacheItemInterface $cacheItemHtml */
        $cacheItemHtml = !empty($cacheKey) ? $cache->getItem("content_inc.{$cacheKey}.{$locale}") : null;
        if ($cacheItemHtml && $cacheItemHtml->isHit()) {
            return $cacheItemHtml->get();
        }

        $templateName = $chunkName . '.html.twig';

        /** @var CatalogService $catalogService */
        $catalogService = $this->container->get('app.catalog');
        $collection = $catalogService->getCollection($collectionName);
        $criteria = ['_id' => $contentId];

        $aggregateFields = [];
        if ($locale !== $localeDefault) {
            $contentType = $catalogService->getContentTypeRepository()->findOneBy([
                'collection' => $collectionName
            ]);
            if ($contentType) {
                $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
            }
            if (!empty($parameters['headerFieldName']) || $contentType) {
                if (empty($parameters['headerFieldName'])) {
                    $parameters['headerFieldName'] = $contentType->getFieldByChunkName('header');
                }
                $catalogService->applyLocaleFilter($locale, $parameters['headerFieldName'], $criteria);
            }
        }

        $pipeline = $catalogService->createAggregatePipeline(
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

        if ($cacheItemHtml) {
            $cacheItemHtml->set($output);
            $cache->save($cacheItemHtml);
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
