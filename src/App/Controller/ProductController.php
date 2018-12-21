<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use Doctrine\ODM\MongoDB\Cursor;
use Doctrine\ODM\MongoDB\DocumentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;

class ProductController extends BaseController
{

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
     * @param Category $currentCategory
     * @param array $contentTypeFields
     * @param array $criteria
     */
    public function applyCategoryFilter(Category $currentCategory, $contentTypeFields, &$criteria)
    {
        $categoriesField = array_filter($contentTypeFields, function($field){
            return $field['inputType'] == 'categories';
        });
        $categoriesField = current($categoriesField);

        if (!empty($categoriesField)) {

            $orCriteria = [
                '$or' => [
                    ['parentId' => $currentCategory->getId()]
                ]
            ];
            $orCriteria['$or'][] = ["{$categoriesField['name']}" => [
                '$elemMatch' => ['$in' => [$currentCategory->getId()]]
            ]];
            $criteria = ['$and' => [$criteria, $orCriteria]];

        } else {
            $criteria['parentId'] = $currentCategory->getId();
        }
    }

    /**
     * @param string $locale
     * @param string $headerFieldName
     * @param array $criteria
     */
    public function applyLocaleFilter($locale, $headerFieldName, &$criteria)
    {;
        $translationFieldName = "translations.{$headerFieldName}.{$locale}";
        $andCriteria = [$translationFieldName => ['$exists' => true]];
        if (!isset($criteria['$and'])) {
            $criteria = ['$and' => [$criteria]];
        }
        $criteria['$and'][] = $andCriteria;
    }

    /**
     * @param $collectionName
     * @param string $databaseName
     * @return \Doctrine\MongoDB\Collection
     */
    public function getCollection($collectionName, $databaseName = '')
    {
        if (!$databaseName) {
            $databaseName = $this->getParameter('mongodb_database');
        }
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($databaseName);
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
     * @param $mainTemplateName
     * @param $prefix
     * @return string
     */
    public function getTemplateName($mainTemplateName, $prefix)
    {
        /** @var \Twig_Environment */
        $twig = $this->get('twig');
        $templateName = sprintf('%s_%s.html.twig', $prefix, $mainTemplateName);
        if ($twig->getLoader()->exists($templateName)) {
            return $templateName;
        }
        return sprintf('%s.html.twig', $mainTemplateName);
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