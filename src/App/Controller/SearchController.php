<?php

namespace App\Controller;

use App\MainBundle\Document\ContentType;
use App\Service\UtilsService;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class SearchController extends CatalogController
{

    /**
     * @Route(
     *     "/{_locale}/search",
     *     name="search_results_localized",
     *     methods={"GET"},
     *     requirements={"_locale"="^[a-z]{2}$"}
     * )
     * @Route("/search", name="search_results", methods={"GET"})
     * @param Request $request
     * @return Response
     */
    public function searchResultsAction(Request $request)
    {
        $locale = $request->getLocale();

        $searchWord = trim($request->get('query', ''));
        $searchCollections = $this->params->has('app.search_collections')
            ? $this->params->get('app.search_collections')
            : '';
        if (empty($searchCollections)) {
            $searchCollections = 'products';
        }
        $searchCollections = UtilsService::stringToArray($searchCollections);

        if (empty($searchWord)) {
            return $this->render('page_search_results.html.twig', [
                'totalItems' => 0,
                'searchWord' => $searchWord
            ]);
        }

        $catalogNavSettingsDefaults = $this->getCatalogNavSettingsDefaults();
        $queryString = $request->getQueryString();
        $queryOptions = UtilsService::getQueryOptions('', $queryString, [], $catalogNavSettingsDefaults);
        $queryOptions['sortOptions'] = ['parentId' => 'asc', 'title' => 'asc'];
        
        $itemsArr = [];
        $totalArr = [];
        $contentTypeArr = [];
        foreach ($searchCollections as $collectionName) {
            try {
                list($items, $total, $contentType) = $this->searchByCollectionName($collectionName, $searchWord, $locale, $queryOptions);
            } catch (\Exception $e) {
                continue;
            }
            if (!$total) {
                continue;
            }
            $totalArr[] = $total;
            $contentTypeArr[] = $contentType;
            $itemsArr[] = $items;
        }
    
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, max($totalArr), $catalogNavSettingsDefaults);

        return $this->render('page_search_results.html.twig', [
            'currency' =>  $this->settingsService->getCurrency(),
            'totalItems' => max($totalArr),
            'totalItemsArr' => $totalArr,
            'contentTypeArr' => $contentTypeArr,
            'itemsArr' => $itemsArr,
            'searchWord' => $searchWord,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]);
    }
    
    /**
     * @param $collectionName
     * @param $searchWord
     * @param $locale
     * @param array $queryOptions
     * @return array
     * @throws \Exception
     */
    public function searchByCollectionName($collectionName, $searchWord, $locale, $queryOptions = [])
    {
        $localeDefault = $this->params->get('locale');
        
        /** @var ContentType $contentType */
        $contentType = $this->getContentTypeRepository()->findOneBy([
            'collection' => $collectionName
        ]);
        if (!$contentType) {
            throw new \Exception('Content type not found.');
        }
    
        $collection = $this->catalogService->getCollection($collectionName);
    
        $criteria = [
            'isActive' => true,
            '$text' => [ '$search' => $searchWord ]
        ];
    
        $total = $collection->countDocuments($criteria);
        $skip = !empty($queryOptions)
            ? ($queryOptions['page'] - 1) * $queryOptions['limit']
            : 0;
    
        $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
        $aggregateFields['score'] = ['$meta' => 'textScore'];
    
        $pipeline = $this->catalogService->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            !empty($queryOptions) ? $queryOptions['limit'] : 0,
            ['score' => [ '$meta' => 'textScore' ]],
            $skip
        );
    
        $items = $collection->aggregate($pipeline, [
            'cursor' => []
        ])->toArray();
        
        return [$items, $total, $contentType];
    }
}
