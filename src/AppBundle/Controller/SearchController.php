<?php

namespace AppBundle\Controller;

use AppBundle\Document\ContentType;
use AppBundle\Service\UtilsService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class SearchController extends CatalogController
{

    /**
     * @Route("/search", name="search_results")
     * @Method({"GET"})
     * @param Request $request
     * @return Response
     */
    public function searchResultsAction(Request $request)
    {
        $searchWord = trim($request->get('query', ''));
        $searchCollections = $this->container->hasParameter('search_collections')
            ? $this->container->hasParameter('search_collections')
            : 'products';
        $searchCollections = UtilsService::stringToArray($searchCollections);

        if (empty($searchWord)) {
            return $this->render('page_search_results.html.twig', [
                'totalItems' => 0,
                'searchWord' => $searchWord
            ]);
        }

        $pageSizeArr = $this->getParameter('catalog_page_size');
        $queryString = $request->getQueryString();
        $queryOptions = UtilsService::getQueryOptions('', $queryString, [], $pageSizeArr);
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
        list($filters, $fieldsAll) = $this->getFieldsData($contentTypeFields, $options,'page', [], $queryOptions);

        $collection = $this->getCollection($searchCollections[0]);

        $criteria = [
            'isActive' => true,
            '$text' => [ '$search' => $searchWord ]
        ];

        $total = $collection->find($criteria)->count();

        /* pages */
        $pagesOptions = UtilsService::getPagesOptions($queryOptions, $total, $pageSizeArr);

        $items = $collection
            ->find($criteria, ['score' => [ '$meta' => 'textScore' ]])
            ->sort(['score' => [ '$meta' => 'textScore' ]])
            ->skip($pagesOptions['skip'])
            ->limit($queryOptions['limit']);

        return $this->render('page_search_results.html.twig', [
            'fieldsAll' => $fieldsAll,
            'totalItems' => $total,
            'items' => $items,
            'searchWord' => $searchWord,
            'queryOptions' => $queryOptions,
            'pagesOptions' => $pagesOptions
        ]);
    }

}
