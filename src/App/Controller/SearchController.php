<?php

namespace App\Controller;

use App\MainBundle\Document\ContentType;
use App\Service\SettingsService;
use App\Service\UtilsService;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SearchController extends CatalogController
{

    /**
     * @Route("/search", name="search_results", methods={"GET"})
     * @param Request $request
     * @return Response
     */
    public function searchResultsAction(Request $request)
    {
        $localeDefault = $this->getParameter('locale');
        $locale = $request->getLocale();

        $searchWord = trim($request->get('query', ''));
        $searchCollections = $this->container->hasParameter('app.search_collections')
            ? $this->container->getParameter('app.search_collections')
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

        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');
        $currency = $settingsService->getCurrency();

        $catalogNavSettingsDefaults = $this->getCatalogNavSettingsDefaults();
        $queryString = $request->getQueryString();
        $queryOptions = UtilsService::getQueryOptions('', $queryString, [], $catalogNavSettingsDefaults);
        $queryOptions['sortOptions'] = ['parentId' => 'asc', 'title' => 'asc'];

        /** @var ContentType $contentType */
        $contentType = $this->getContentTypeRepository()->findOneBy([
            'collection' => $searchCollections[0]
        ]);
        if (!$contentType) {
            return $this->render('page_search_results.html.twig', [
                'totalItems' => 0,
                'searchWord' => $searchWord
            ]);
        }

        $contentTypeFields = $contentType->getFields();
        $options = [
            'currentCategoryUri' => '',
            'systemNameField' => $contentType->getSystemNameField()
        ];
        list($filters, $fieldsAll) = $this->getFieldsData($contentTypeFields, $options,'page', [], [], $queryOptions);

        $collection = $this->getCollection($searchCollections[0]);

        $criteria = [
            'isActive' => true,
            '$text' => [ '$search' => $searchWord ]
        ];

        $total = $collection->find($criteria)->count();

        /* pages */
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, $catalogNavSettingsDefaults);

        $aggregateFields = $contentType->getAggregationFields($locale, $localeDefault, true);
        $aggregateFields['score'] = ['$meta' => 'textScore'];

        $pipeline = $this->createAggregatePipeline(
            $criteria,
            $aggregateFields,
            $queryOptions['limit'],
            ['score' => [ '$meta' => 'textScore' ]],
            $pagesOptions['skip']
        );

        $items = $collection->aggregate($pipeline, [
            'cursor' => []
        ]);

        return $this->render('page_search_results.html.twig', [
            'currency' => $currency,
            'fieldsAll' => $fieldsAll,
            'totalItems' => $total,
            'items' => $items,
            'searchWord' => $searchWord,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]);
    }

}
