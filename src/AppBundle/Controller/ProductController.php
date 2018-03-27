<?php

namespace AppBundle\Controller;

use AppBundle\Repository\CategoryRepository;
use Doctrine\ODM\MongoDB\Cursor;
use Doctrine\ODM\MongoDB\DocumentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Document\Category;
use AppBundle\Document\ContentType;

class ProductController extends BaseController
{

    /**
     * @param $queryString
     * @param ContentType $contentType
     * @param array $pageSizeArr
     * @return array
     */
    public function getQueryOptions($queryString, ContentType $contentType, $pageSizeArr = [10])
    {
        $queryOptionsDefault = [
            'page' => 1,
            'limit' => $pageSizeArr[0],
            'limit_max' => 100,
            'sort_by' => '_id',
            'sort_dir' => 1,
            'order_by' => 'id_desc',
            'full' => 1,
            'only_active' => 1,
            'filter' => [],
            'filterStr' => ''
        ];
        parse_str($queryString, $queryOptions);

        if (!empty($queryOptions['order_by']) && strpos($queryOptions['order_by'], '_') !== false) {
            $orderByArr = explode('_', $queryOptions['order_by']);
            if (empty($queryOptions['sort_by'])) {
                $queryOptions['sort_by'] = $orderByArr[0];
            }
            if (empty($queryOptions['sort_dir'])) {
                $queryOptions['sort_dir'] = $orderByArr[1];
            }
        }

        $queryOptions = array_merge($queryOptionsDefault, $queryOptions);

        //Field names array
        $fields = $contentType->getFields();
        $fieldNames = array_map(function($field){
            return $field['name'];
        }, $fields);
        $fieldNames[] = '_id';

        if($queryOptions['sort_by'] == 'id'){
            $queryOptions['sort_by'] = '_id';
        }

        $queryOptions['sort_by'] = self::stringToArray($queryOptions['sort_by']);
        $queryOptions['sort_by'] = self::arrayFilter($queryOptions['sort_by'], $fieldNames);
        $queryOptions['sort_dir'] = self::stringToArray($queryOptions['sort_dir']);
        $queryOptions['sort_dir'] = self::arrayFilter($queryOptions['sort_dir'], ['asc', 'desc']);

        if(empty($queryOptions['sort_by'])){
            $queryOptions['sort_by'] = [$queryOptionsDefault['sort_by']];
        }
        if(empty($queryOptions['sort_dir'])){
            $queryOptions['sort_dir'] = [$queryOptionsDefault['sort_dir']];
        }

        // Sorting options
        $queryOptions['sortOptions'] = [];
        foreach ($queryOptions['sort_by'] as $ind => $sortByName) {
            $queryOptions['sortOptions'][$sortByName] = isset($queryOptions['sort_dir'][$ind])
                ? $queryOptions['sort_dir'][$ind]
                : $queryOptions['sort_dir'][0];
        }

        if(!is_numeric($queryOptions['limit'])){
            $queryOptions['limit'] = $queryOptionsDefault['limit'];
        }
        if(!is_numeric($queryOptions['page'])){
            $queryOptions['page'] = $queryOptionsDefault['page'];
        }
        $queryOptions['limit'] = min(abs(intval($queryOptions['limit'])), $queryOptions['limit_max']);
        $queryOptions['page'] = abs(intval($queryOptions['page']));

        if (!empty($queryOptions['filter']) && is_array($queryOptions['filter'])) {
            $queryOptions['filterStr'] = '&' . http_build_query(['filter' => $queryOptions['filter']]);
        }

        return $queryOptions;
    }

    /**
     * @param array $queryOptions
     * @param int $itemsTotal
     * @param array $pageSizeArr
     * @return array
     */
    public function getPagesOptions($queryOptions, $itemsTotal, $pageSizeArr = [10])
    {
        $pagesOptions = [
            'pageSizeArr' => $pageSizeArr,
            'current' => $queryOptions['page'],
            'limit' => $queryOptions['limit'],
            'total' => ceil($itemsTotal / $queryOptions['limit']),
            'prev' => max(1, $queryOptions['page'] - 1)
        ];
        $pagesOptions['next'] = min($pagesOptions['total'], $queryOptions['page'] + 1);

        return $pagesOptions;
    }

    /**
     * @param $filters
     * @param $filtersData
     * @param $criteria
     */
    public function applyFilters($filters, $filtersData, &$criteria)
    {
        if (empty($filters)) {
            return;
        }
        foreach ($filters as $name => $filter) {
            if (empty($filter)) {
                continue;
            }
            if (!is_array($filter)) {
                $filter = [$filter];
            }
            $index = array_search($name, array_column($filtersData, 'name'));
            if ($index !== false) {
                $flt = $filtersData[$index];
                // Process coilor filter
                if ($flt['outputType'] === 'color') {
                    foreach ($filter as &$val) {
                        $val = '#' . $val;
                    }
                }
            }
            if (isset($filter['from']) && isset($filter['to'])) {
                $criteria[$name] = ['$gte' => floatval($filter['from']), '$lte' => floatval($filter['to'])];
            } else {
                $criteria[$name] = ['$in' => $filter];
            }
        }
    }

    /**
     * @param string $collectionName
     * @return \Doctrine\MongoDB\Collection
     */
    public function getCollection($collectionName)
    {
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($this->getParameter('mongodb_database'));
        return $db->createCollection($collectionName);
    }

    /**
     * Get file extension
     * @param $filePath
     * @return string
     */
    public static function getExtension($filePath)
    {
        $temp_arr = $filePath ? explode('.', $filePath) : [];
        $ext = !empty($temp_arr) ? end($temp_arr) : '';
        return strtolower($ext);
    }

    /**
     * @param $contentTypeFields
     * @return string
     */
    public function getSystemNameField($contentTypeFields)
    {
        $output = '';
        foreach ($contentTypeFields as $field) {
            if (!empty($field['inputType']) && $field['inputType'] == 'system_name') {
                $output = $field['name'];
                break;
            }
        }
        return $output;
    }

    /**
     * @return CategoryRepository
     */
    public function getCategoriesRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
    }
}