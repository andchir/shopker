<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use \MongoDB\Collection;
use MongoDB\Model\IndexInfo;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\MainBundle\Document\Category;

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
            $outputType = '';
            if ($index !== false) {
                $flt = $filtersData[$index];
                $outputType = $flt['outputType'];
                // Process color filter
                if ($outputType === 'color') {
                    foreach ($filter as &$val) {
                        $val = '#' . $val;
                    }
                }
            }
            if (isset($filter['from']) && isset($filter['to'])) {
                $criteria[$name] = ['$gte' => floatval($filter['from']), '$lte' => floatval($filter['to'])];
            } else if ($outputType === 'parameters') {
                $fData = [];
                foreach ($filter as $fValue) {
                    $fValueArr = explode('__', $fValue);
                    if (count($fValueArr) < 2) {
                        continue;
                    }
                    $index = array_search($fValueArr[0], array_column($fData, 'name'));
                    if ($index === false) {
                        $fData[] = [
                            'name' => $fValueArr[0],
                            'values' => []
                        ];
                        $index = count($fData) - 1;
                    }
                    if (!in_array($fValueArr[1], $fData[$index]['values'])) {
                        $fData[$index]['values'][] = $fValueArr[1];
                    }
                }
                if (!empty($fData)) {
                    $criteria[$name] = ['$all' => []];
                    foreach ($fData as $k => $v) {
                        $criteria[$name]['$all'][] = [
                            '$elemMatch' => [
                                'name' => $v['name'],
                                'value' => ['$in' => $v['values']]
                            ]
                        ];
                    }
                }
            } else {
                $criteria[$name] = ['$in' => $filter];
            }
        }
    }

    /**
     * @param $collectionName
     * @param string $databaseName
     * @return \MongoDB\Collection
     */
    public function getCollection($collectionName, $databaseName = '')
    {
        if (!$databaseName) {
            $databaseName = $this->getParameter('mongodb_database');
        }
        /** @var \MongoDB\Client $mongodbClient */
        $mongodbClient = $this->container->get('doctrine_mongodb.odm.default_connection');

        return $mongodbClient->selectCollection($databaseName, $collectionName);
    }

    /**
     * @param array $document
     * @param Collection $collection
     * @return bool
     */
    public function updateTranslationsTextIndex($document, Collection $collection)
    {
        if (empty($document['translations'])) {
            return false;
        }
        $indexInfo = $collection->listIndexes();
        $textIndexFields = [];
        $textIndexFieldsNew = [];
        $textIndexName = '';
        $defaultLanguage = '';

        /** @var IndexInfo $indexData */
        foreach ($indexInfo as $indexData) {
            if (!$indexData->isText()) {
                continue;
            }
            $weights = $indexData->offsetGet('weights');
            if (!empty($weights)) {
                $fields = array_keys($weights);
                $defLanguage = $indexData->offsetGet('default_language');
                if (!empty($defLanguage)) {
                    $defaultLanguage = $defLanguage;
                    $textIndexName = $indexData->getName();
                }
                foreach ($fields as $fieldName) {
                    $textIndexFields[] = $fieldName;
                    if (strpos($fieldName, 'translations.') === false) {
                        if (!isset($document['translations'][$fieldName])) {
                            continue;
                        }
                        foreach ($document['translations'][$fieldName] as $lang => $val) {
                            $indName = "translations.{$fieldName}.{$lang}";
                            if (!in_array($indName, $fields)) {
                                $textIndexFieldsNew[] = $indName;
                            }
                        }
                    }
                }
            }
        }
        unset($fields);

        if (!empty($textIndexFieldsNew) && $textIndexName) {
            $textIndexName = explode('_', $textIndexName);
            $textIndexName = array_filter($textIndexName, function($key) {
                return ($key + 1) % 2 !== 0;
            }, ARRAY_FILTER_USE_KEY);
            $fields = array_unique(array_merge($textIndexFields, $textIndexFieldsNew));
            $collection->dropIndexes(array_fill_keys($textIndexName, 'text'));
            $collection->createIndex(array_fill_keys($fields, 'text'), [
                'default_language' => $defaultLanguage
            ]);
        }

        return true;
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
        /** @var \Twig\Environment */
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