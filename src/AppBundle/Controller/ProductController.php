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
            'full' => 1,
            'only_active' => 1
        ];
        parse_str($queryString, $queryOptions);

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
        if(!in_array($queryOptions['sort_by'], $fieldNames)){
            $opts['sort_by'] = $queryOptionsDefault['sort_by'];
        }
        if(!is_numeric($queryOptions['sort_dir'])){
            $queryOptions['sort_dir'] = $queryOptions['sort_dir'] == 'asc' ? 1 : -1;
        }
        if(!is_numeric($queryOptions['limit'])){
            $queryOptions['limit'] = $queryOptionsDefault['limit'];
        }
        if(!is_numeric($queryOptions['page'])){
            $queryOptions['page'] = $queryOptionsDefault['page'];
        }
        $queryOptions['limit'] = min(abs(intval($queryOptions['limit'])), $queryOptions['limit_max']);
        $queryOptions['page'] = abs(intval($queryOptions['page']));

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

}