<?php

namespace App\Service;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Filter;
use App\Repository\CategoryRepository;
use App\Repository\ContentTypeRepository;
use Doctrine\Persistence\ObjectRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Persistence\ObjectManager;
use Mimey\MimeTypes;
use MongoDB\Collection;
use MongoDB\Model\IndexInfo;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class CatalogService {

    /** @var ParameterBagInterface */
    protected $params;
    /** @var DocumentManager */
    private $dm;

    /**
     * @param ParameterBagInterface $params
     * @param DocumentManager $dm
     */
    public function __construct(ParameterBagInterface $params, DocumentManager $dm)
    {
        $this->params = $params;
        $this->dm = $dm;
    }

    /**
     * @param DocumentManager|ObjectManager $dm
     */
    public function setDocumentManager(DocumentManager $dm)
    {
        $this->dm = $dm;
    }

    /**
     * @param int $parentId
     * @param string $locale
     * @return array
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function getCategoriesTree($parentId = 0, $locale = '')
    {
        $data = [];
        $categoriesRepository = $this->getCategoriesRepository();
        /** @var Category $parentCategory */
        $parentCategory = $categoriesRepository->find($parentId);
        if ($parentId && !$parentCategory) {
            return [];
        }

        $results = $categoriesRepository->findActiveAll();

        $parentIdsArr = [$parentId];
        /** @var Category $category */
        foreach ($results as $category) {
            $pId = $category->getParentId();
            if (!in_array($category->getId(), $parentIdsArr)) {
                $parentIdsArr[] = $category->getId();
            }
            if (!isset($data[$pId])) {
                $data[$pId] = [];
            }
            $data[$pId][] = $category->getMenuData([], $locale);
        }

        if ($parentId === 0) {
            $childContent = $parentCategory ? $this->getCategoryContent($parentCategory, [], $locale) : [];
            // Content pages (not categories)
            if (!empty($childContent)) {
                foreach ($childContent as $content) {
                    $content['id'] = 0 - max(1, $content['id']);// This is not categories
                    $data[0][] = $content;
                }
                array_multisort(
                    array_column($data[0], 'menuIndex'),  SORT_ASC,
                    array_column($data[0], 'title'), SORT_ASC,
                    $data[0]
                );
            }
        }
        if (empty($data)) {
            return [];
        }
        if (!$parentId) {
            return self::createTree($data, [[
                'id' => 0,
                'title' => 'Root'
            ]]);
        }
        else {
            return self::createTree($data, [$parentCategory->getMenuData([], $locale)]);
        }
    }

    /**
     * @param Category $parentCategory
     * @param array $breadcrumbsUriArr
     * @param string $locale
     * @return array
     */
    public function getCategoryContent(Category $parentCategory, $breadcrumbsUriArr = [], $locale = '')
    {
        $categories = [];
        /** @var ContentType $contentType */
        $contentType = $parentCategory->getContentType();
        $collection = $this->getCollection($contentType->getCollection());
        $parentUri = $parentCategory->getUri();
        $items = $collection->find([
            'parentId' => $parentCategory->getId(),
            'isActive' => true
        ]);
        $systemNameField = $contentType->getSystemNameField();
        foreach ($items as $item) {
            $category = [
                'id' => $item['_id'],
                'title' => ContentType::getValueByLocale($item, $locale),
                'name' => $item[$systemNameField] ?? '',
                'description' => '',
                'uri' => !empty($item[$systemNameField]) ? $parentUri . $item[$systemNameField] : '',
                'href' => !empty($item['href']) ? $item['href'] : '',
                'menuIndex' => $item['menuIndex'] ?? 0,
                'translations' => $item['translations'] ?? [],
                'children' => []
            ];
            $category['isActive'] = in_array($category['uri'], $breadcrumbsUriArr);
            $categories[] = $category;
        }
        return $categories;
    }

    /**
     * @param int|Category $parent
     * @param array $breadcrumbs
     * @param bool $getChildContent
     * @param string $currentUri
     * @param string $locale
     * @return array
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function getChildCategories(
        $parent = 0,
        $breadcrumbs = [],
        $getChildContent = false,
        $currentUri = '',
        $locale = ''
    )
    {
        $parentCategory = null;
        $categoriesRepository = $this->getCategoriesRepository();
        /** @var Category $parentCategory */
        if ($parent instanceof Category) {
            $parentCategory = $parent;
            $parentId = $parent->getId();
        } else {
            $parentId = $parent;
            $parentCategory = $parentId ? $categoriesRepository->find($parentId) : null;
        }
        unset($parent);

        $breadcrumbsUriArr = array_column($breadcrumbs, 'uri');
        if ($currentUri && !in_array($currentUri, $breadcrumbsUriArr)) {
            array_push($breadcrumbsUriArr, $currentUri);
        }

        $categories = [];
        $results = $categoriesRepository->findActiveAll('title', 'asc', $parentId);

        /** @var Category $category */
        foreach ($results as $category) {
            $categories[] = $category->getMenuData($breadcrumbsUriArr, $locale);
        }

        // Get category content
        if ($getChildContent && $parentCategory) {
            $childContent = $this->getCategoryContent($parentCategory, $breadcrumbsUriArr, $locale);
            $categories = array_merge($categories, $childContent);
        }
        array_multisort(
            array_column($categories, 'menuIndex'),  SORT_ASC,
            array_column($categories, 'title'), SORT_ASC,
            $categories
        );

        return $categories;
    }

    /**
     * @param $categoriesAdsArr
     * @param array $contentTypeFields
     * @param array $criteria
     */
    public function applyCategoryFilter($categoriesAdsArr, $contentTypeFields, &$criteria)
    {
        $categoriesField = array_filter($contentTypeFields, function($field){
            return $field['inputType'] == 'categories';
        });
        $categoriesField = current($categoriesField);

        if (!empty($categoriesField)) {

            $orCriteria = [
                '$or' => [
                    ['parentId' => ['$in' => $categoriesAdsArr]]
                ]
            ];
            $orCriteria['$or'][] = ["{$categoriesField['name']}" => [
                '$elemMatch' => ['$in' => $categoriesAdsArr]
            ]];
            $criteria = ['$and' => [$criteria, $orCriteria]];

        } else {
            $criteria['parentId'] = ['$in' => $categoriesAdsArr];
        }
    }

    /**
     * @param Category $parentCategory
     * @param string $databaseName
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateFiltersData(Category $parentCategory, $databaseName = '')
    {
        $showAllChildren = $this->params->has('app.catalog_show_all_children')
            ? $this->params->get('app.catalog_show_all_children')
            : false;
        $categoriesRepository = $this->getCategoriesRepository();

        if ($showAllChildren) {
            $categoriesData = $categoriesRepository->getBreadcrumbs($parentCategory->getUri(), false);
            $categoriesData = array_reverse($categoriesData);
        } else {
            $categoriesData = [$parentCategory->getMenuData()];
        }

        if (empty($categoriesData)) {
            return false;
        }

        foreach ($categoriesData as $category) {
            $categoryId = $category['id'];

            /** @var Category $cat */
            $cat = $categoriesRepository->find($categoryId);

            /** @var ContentType $contentType */
            $contentType = $cat->getContentType();
            $contentTypeFields = $contentType->getFields();
            $contentTypeFilterFields = array_filter($contentTypeFields, function($f) {
                return $f['isFilter'];
            });
            $contentTypeFilterFields = array_merge($contentTypeFilterFields);
            $collection = $this->getCollection($contentType->getCollection(), $databaseName);

            $filterArr = [];
            $filterData = [];

            // Mix from child categories
            if ($showAllChildren) {
                $childCategories = $categoriesRepository->findBy([
                    'parentId' => $cat->getId(),
                    'isActive' => true
                ]);

                /** @var Category $childCategory */
                foreach ($childCategories as $childCategory) {
                    /** @var Filter $flt */
                    $flt = $childCategory->getFilterData();
                    if (empty($flt)) {
                        continue;
                    }
                    $filterValues = $flt->getValues();
                    foreach ($contentTypeFilterFields as $contentTypeField) {
                        $fieldName = $contentTypeField['name'];
                        if (!empty($filterValues[$fieldName])) {
                            if (!isset($filterArr[$fieldName])) {
                                $filterArr[$fieldName] = [];
                            }
                            $values = array_merge($filterArr[$fieldName], $filterValues[$fieldName]);
                            $values = array_unique($values);
                            if ($contentTypeField['outputType'] == 'number') {
                                sort($values, SORT_NUMERIC);
                            } else {
                                sort($values);
                            }
                            $filterArr[$fieldName] = $values;
                        }
                    }
                    $fltData = $flt->getValuesData();
                    if (!empty($fltData)) {
                        foreach ($fltData as $i => $d) {
                            $this->addFiltersData($filterData, $d['fieldName'], $d['name'], $d['values']);
                        }
                    }
                }
                unset($childCategories, $childCategory, $values);
            }

            foreach ($contentTypeFilterFields as $contentTypeField) {
                $fieldName = $contentTypeField['name'];

                $criteria = [
                    'isActive' => true
                ];

                // Get products fields unique data
                if ($contentTypeField['inputType'] === 'parameters') {

                    $this->applyCategoryFilter([$cat->getId()], $contentTypeFields, $criteria);
                    $uniqueValues = $collection->aggregate([
                        ['$match' => $criteria],
                        ['$group' => [
                            '_id' => "\${$fieldName}.name",
                            'values' => [
                                '$addToSet' => "\${$fieldName}.value"
                            ]
                        ]]
                    ], [
                        'cursor' => []
                    ])->toArray();

                    foreach ($uniqueValues as $data) {
                        if (empty($data['_id']) || empty($data['values'])) {
                            continue;
                        }
                        foreach ($data['_id'] as $nk => $name) {
                            if (empty($name)) {
                                continue;
                            }
                            $values = array_map(function($val) use ($nk) {
                                return $val[$nk];
                            }, $data['values']);
                            $this->addFiltersData($filterData, $fieldName, $name, $values);
                        }
                    }

                } else {
                    $this->applyCategoryFilter([$cat->getId()], $contentTypeFields, $criteria);
                    $uniqueValues = $collection->distinct($fieldName, $criteria);

                    $uniqueValues = array_filter($uniqueValues, function($val) {
                        return $val !== '' && !is_null($val);
                    });

                    if (!empty($uniqueValues)) {
                        if (!isset($filterArr[$fieldName])) {
                            $filterArr[$fieldName] = [];
                        }
                        $filterArr[$fieldName] = array_unique(array_merge($filterArr[$fieldName], $uniqueValues));
                        if ($contentTypeField['outputType'] == 'number') {
                            sort($filterArr[$fieldName], SORT_NUMERIC);
                        } else {
                            sort($filterArr[$fieldName]);
                        }
                    }
                }
            }

            $filter = $cat->getFilterData();
            if (!$filter) {
                if (empty($filterArr) && empty($filterData)) {
                    continue;
                }
                $filter = new Filter();
                $filter->setCategory($cat);
                $cat->setFilterData($filter);
                $this->dm->persist($filter);
            } else if (empty($filterArr) && empty($filterData)) {
                $this->dm->remove($filter);
                $cat->setFilterData(null);
                continue;
            }
            $filter
                ->setValues($filterArr)
                ->setValueData($filterData);
        }

        $this->dm->flush();

        return true;
    }

    /**
     * @param array $filterData
     * @param string $fieldName
     * @param string $name
     * @param array $values
     */
    public function addFiltersData(&$filterData, $fieldName, $name, $values)
    {
        $index = array_search($name, array_column($filterData, 'name'));
        if ($index === false) {
            $filterData[] = [
                'fieldName' => $fieldName,
                'name' => $name,
                'values' => []
            ];
            $index = count($filterData) - 1;
        }
        foreach ($values as $val) {
            if (!in_array($val, $filterData[$index]['values'])) {
                $filterData[$index]['values'][] = $val;
            }
        }
    }

    /**
     * @param $value
     * @param $field
     * @param array $properties
     * @param string|null $collectionName
     * @param string|null $categoryId
     * @param int|null $itemId
     * @return string
     */
    public function validateField($value, $field, $properties = [], $collectionName = null, $categoryId = null, $itemId = null)
    {
        $inputProperties = isset($field['inputProperties'])
            ? $field['inputProperties']
            : [];
        if (!empty($field['required']) && empty($value)) {
            return "Field \"{$field['title']}\" is required.";
        }
        $error = '';

        // Validation by input properties
        switch ($field['inputType']){
            case 'system_name':

                if(
                    !empty($value)
                    && $this->checkNameExists($field['name'], $value, $collectionName, $categoryId, $itemId)
                ){
                    $error = 'System name already exists.';
                }

                break;
            case 'file':

                if (!empty($value) && !empty($inputProperties['allowed_extensions'])) {

                    if (!$this->fileUploadAllowed($value, $properties, $inputProperties['allowed_extensions'])) {
                        $error = 'File type is not allowed.';
                    }

                }

                break;
        }
        return $error;
    }

    /**
     * @param string $fieldName
     * @param string $name
     * @param string $collectionName
     * @param int $categoryId
     * @param int $itemId
     * @return mixed
     */
    public function checkNameExists($fieldName, $name, $collectionName, $categoryId, $itemId = null)
    {
        $collection = $this->getCollection($collectionName);
        $itemId = intval($itemId);
        $where = [
            $fieldName => $name,
            'parentId' => $categoryId
        ];
        if($itemId){
            $where['_id'] = ['$ne' => $itemId];
        }
        return $collection->countDocuments($where);
    }

    /**
     * @param string | array $value
     * @param array $properties
     * @param string $allowedExtensions
     * @return bool
     */
    public function fileUploadAllowed($value, $properties, $allowedExtensions = '')
    {
        $filesExtBlacklist = $this->params->get('app.files_ext_blacklist');
        if (is_array($value)) {
            $ext = !empty($value['extension']) ? strtolower($value['extension']) : null;
        } else {
            $ext = UtilsService::getExtension($value);
        }
        if (in_array($ext, $filesExtBlacklist)) {
            return false;
        }

        // Validate by file extension
        if (strpos($allowedExtensions, '/') !== false) {

            if (empty($properties['mimeType'])) {
                $mimes = new MimeTypes;
                $properties['mimeType'] = $mimes->getMimeType($ext);
            }
            if (!self::isMimeTypeAllowed(explode(',', $allowedExtensions), $properties['mimeType'])) {
                return false;
            }

        } else {
            $allowedExtensions = explode(',', $allowedExtensions);
            if ($ext !== null && !in_array('.' . $ext, $allowedExtensions)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Sorting additional fields
     * @param string $collectionName
     * @param array $document
     * @param array $fieldsSort
     * @return bool
     */
    public function sortAdditionalFields($collectionName, $document, $fieldsSort)
    {
        $collection = $this->getCollection($collectionName);
        $docKeys = array_keys($document);
        $itemId = isset($document['_id']) ? $document['_id'] : 0;
        if (!$itemId) {
            return false;
        }

        $additFields = [];
        foreach ($document as $key => $value) {
            if (in_array($key, ['id', '_id', 'parentId', 'isActive'])) {
                continue;
            }
            if (strpos($key, '__') !== false) {
                $tmp = explode('__', $key);
                if (!empty($tmp[1]) && is_numeric($tmp[1])) {
                    if (!empty($value)) {
                        $additFields[$key] = $value;
                    }
                    unset($document[$key]);
                    continue;
                }
            }
            $document[$key] = $value;
        }
        if (empty($additFields)) {
            return false;
        }

        // Sort additional fields
        uksort($additFields, function($a, $b) use ($fieldsSort) {
            return (array_search($a, $fieldsSort) < array_search($b, $fieldsSort)) ? -1 : 1;
        });

        // Merge fields
        $docKeysData = [];
        foreach ($additFields as $k => $v) {
            $fieldBaseName = ContentType::getCleanFieldName($k);
            if (!isset($docKeysData[$fieldBaseName])) {
                $docKeysData[$fieldBaseName] = 0;
            }
            $docKeysData[$fieldBaseName]++;
            $document[$fieldBaseName . '__' . $docKeysData[$fieldBaseName]] = $v;
        }

        // Collect unused additional fields
        $unset = [];
        $unusedKeys = array_diff($docKeys, array_keys($document));
        foreach ($unusedKeys as $k) {
            $unset[$k] = 1;
        }

        $unsetQuery = !empty($unset) ? ['$unset' => $unset] : [];
        try {
            $result = $collection->updateOne(
                ['_id' => $itemId],
                array_merge(['$set' => $document], $unsetQuery)
            );
        } catch (\Exception $e) {
            $result = false;
        }
        return $result;
    }
    
    /**
     * @param ContentType $contentType
     * @param array $queryOptions
     * @param array $filter
     * @param int $skip
     * @return array
     */
    public function getContentList(ContentType $contentType, $queryOptions, $filter, $skip = 0)
    {
        $collection = $this->getCollection($contentType->getCollection());
        $contentTypeFields = $contentType->getFields();
    
        $results = $collection->find($filter, [
            'sort' => $queryOptions['sortOptionsAggregation'],
            'skip' => $skip,
            'limit' => $queryOptions['limit']
        ]);
    
        $data = [];
        foreach ($results as $entry) {
            $row = [
                'id' => $entry['_id'],
                'parentId' => $entry['parentId'],
                'isActive' => $entry['isActive']
            ];
            foreach ($contentTypeFields as $field){
                $row[$field['name']] = isset($entry[$field['name']])
                    ? $entry[$field['name']]
                    : '';
            }
            $data[] = $row;
        }
    
        return $data;
    }
    
    /**
     * @param Category $category
     * @param array $filter
     * @return array|object|null
     * @throws \Exception
     */
    public function getContentItem(Category $category, $filter)
    {
        if(!$category){
            throw new \Exception('Category not found.');
        }
        $contentType = $category->getContentType();
        if(!$contentType){
            throw new \Exception('Content type not found.');
        }
        
        $collection = $this->getCollection($contentType->getCollection());
    
        try {
            $document = $collection->findOne($filter);
        } catch (\Exception $e) {
            throw new \Exception('Item not found.');
        }
        if (!$document) {
            throw new \Exception('Item not found.');
        }
        
        return $document;
    }

    /**
     * @param Category $category
     * @param array $data
     * @param int $userId
     * @param int $itemId
     * @return array
     * @throws \Exception
     */
    public function createContentItemData(Category $category, $data, $userId = 0, $itemId = 0)
    {
        $contentType = $category->getContentType();
        $contentTypeFields = $contentType->getFields();
        $collectionName = $contentType->getCollection();
        $localeDefault = $this->params->get('locale');
        $localeList = UtilsService::stringToArray($this->params->get('app.locale_list'));

        $document = [
            'parentId' => $category->getId(),
            'translations' =>  $data['translations'] ?? null,
            'isActive' => isset($data['isActive']) ? $data['isActive'] : true
        ];

        if (!$itemId) {
            $document['_id'] = $this->getNextId($contentType->getCollection());
        }
        if ($userId) {
            $document['userId'] = $userId;
        }

        foreach ($contentTypeFields as $field) {
            $translations = self::getTranslationsArray($field, $data, $document, $localeList);
            foreach ($translations as $val) {
                if($error = $this->validateField(
                    $val,
                    $field, [],
                    $collectionName,
                    $category->getId(),
                    $itemId)){
                        throw new \Exception($error);
                }
            }
            $document[$field['name']] = self::getFieldValue($field, $data[$field['name']] ?? null);
            self::updateTranslations($field, $document);
        }
        return $document;
    }

    /**
     * @param array $contentTypeField
     * @param array $data
     * @param array $document
     * @param array $localeList
     * @return array
     */
    public static function getTranslationsArray($contentTypeField, $data, &$document, $localeList)
    {
        if (empty($contentTypeField['name'])) {
            return [];
        }
        $output = [];
        $fieldName = $contentTypeField['name'];
        $fieldValue = $data[$fieldName] ?? '';
        $output[] = $fieldValue;
        $localeDefault = array_shift($localeList);
        if (!isset($document['translations'])) {
            $document['translations'] = [];
        }
        if (!in_array($contentTypeField['inputType'], ['text', 'textarea',  'rich_text'])) {
            return $output;
        }
        foreach ($localeList as $loc) {
            if (!isset($document['translations'][$fieldName])) {
                $document['translations'][$fieldName] = [];
            }
            if (empty($document['translations'][$fieldName][$loc])) {
                $document['translations'][$fieldName][$loc] = $fieldValue;
            }
            $output[] = $document['translations'][$fieldName][$loc];
        }
        return $output;
    }

    /**
     * @param array $contentTypeField
     * @param array $document
     */
    public static function updateTranslations($contentTypeField, &$document)
    {
        if (!isset($document['translations'])
            || !is_array($document['translations'])
            || !isset($document['translations'][$contentTypeField['name']])) {
            return;
        }
        foreach ($document['translations'][$contentTypeField['name']] as &$value) {
            $value = self::getFieldValue($contentTypeField, $value);
        }
    }
    
    /**
     * @param $contentTypeField
     * @param $value
     * @return float
     */
    public static function getFieldValue($contentTypeField, $value)
    {
        if (is_array($value)) {
            $value = array_map(function($val) {
                return is_numeric($val)
                    ? $val
                    : UtilsService::cleanString($val, UtilsService::STRING_TYPE_HTML);
            }, $value);
        } else {
            switch ($contentTypeField['inputType']) {
                case 'number':
                    $value = floatval(str_replace([',', ' '], ['.', ''], $value));
                    break;
                case 'date':
                    if (empty($value) && !empty($contentTypeField['inputProperties']['default_current'])) {
                        $value = date('Y-m-d H:i:s');
                    }
                    break;
                case 'system_name':
                    $value = str_replace(' ', '-', $value);
                    $value = str_replace(['"', "'", ' ', '\\', '/', '%', ':', ',', '!', '?'], '', $value);
                    $value = UtilsService::cleanString($value, UtilsService::STRING_TYPE_HTML);
                    break;
                default:
                    $value = UtilsService::cleanString($value, UtilsService::STRING_TYPE_HTML);
            }
        }
        return $value;
    }

    /**
     * @param $collectionName
     * @param string $databaseName
     * @return \MongoDB\Collection
     */
    public function getCollection($collectionName, $databaseName = '')
    {
        if (!$databaseName) {
            $databaseName = $this->params->get('mongodb_database');
        }
        /** @var \MongoDB\Client $mongodbClient */
        $mongodbClient = $this->dm->getClient();

        return $mongodbClient->selectCollection($databaseName, $collectionName);
    }

    /**
     * @param $criteria
     * @param $aggregateFields
     * @param $limit
     * @param $sort
     * @param $skip
     * @return array
     */
    public function createAggregatePipeline($criteria, $aggregateFields, $limit = 1, $sort = [], $skip = 0)
    {
        $pipeline = [['$match' => $criteria]];
        if (!empty($aggregateFields)) {
            $pipeline[] = ['$addFields' => $aggregateFields];
        }
        if (!empty($sort)) {
            $pipeline[] = ['$sort' => $sort];
        }
        if (!empty($skip)) {
            $pipeline[] = ['$skip' => $skip];
        }
        if (!empty($limit)) {
            $pipeline[] = ['$limit' => $limit];
        }
        return $pipeline;
    }

    /**
     * @param $collectionName
     * @param string $databaseName
     * @param \MongoDB\Collection|null $autoincrementCollection
     * @return mixed
     */
    public function getNextId($collectionName, $databaseName = '', $autoincrementCollection = null)
    {
        if (!$autoincrementCollection) {
            $autoincrementCollection = $this->getCollection('doctrine_increment_ids', $databaseName);
        }
        $count = $autoincrementCollection->countDocuments(['_id' => $collectionName]);
        if(!$count){
            $record = [
                '_id' => $collectionName,
                'current_id' => 1
            ];
            $autoincrementCollection->insertOne($record);
        }
        $ret = $autoincrementCollection->findOneAndUpdate(
            ['_id' => $collectionName],
            ['$inc' => ['current_id' => 1]],
            ['new' => true]
        );
        return $ret['current_id'];
    }

    /**
     * @param string $locale
     * @param string $headerFieldName
     * @param array $criteria
     */
    public function applyLocaleFilter($locale, $headerFieldName, &$criteria)
    {
        $translationFieldName = "translations.{$headerFieldName}.{$locale}";
        $andCriteria = [$translationFieldName => ['$exists' => true]];
        if (!isset($criteria['$and'])) {
            $criteria = ['$and' => [$criteria]];
        }
        $criteria['$and'][] = $andCriteria;
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
     * @return CategoryRepository|ObjectRepository
     */
    public function getCategoriesRepository()
    {
        return $this->dm->getRepository(Category::class);
    }

    /**
     * @return ContentTypeRepository|ObjectRepository
     */
    public function getContentTypeRepository()
    {
        return $this->dm->getRepository(ContentType::class);
    }

    /**
     * @param array $allowedMimeTypes
     * @param string $mimeType
     * @return bool
     */
    public static function isMimeTypeAllowed($allowedMimeTypes, $mimeType)
    {
        $output = false;
        foreach ($allowedMimeTypes as $allowedMimeType) {
            if (strpos($allowedMimeType, '/*') !== false) {
                $allowedMimeType = str_replace('/*', '/', $allowedMimeType);
                if (strpos($mimeType, $allowedMimeType) === 0) {
                    $output = true;
                    break;
                }
            } else if ($allowedMimeType === $mimeType) {
                $output = true;
                break;
            }
        }
        return $output;
    }

    /**
     * @param array $list
     * @param array $parent
     * @return array
     */
    public static function createTree(&$list, $parent){
        $tree = array();
        foreach ($parent as $k => $l){
            if(isset($l['id']) && isset($list[$l['id']])){
                $l['children'] = self::createTree($list, $list[$l['id']]);
            }
            $tree[] = $l;
        }
        return $tree;
    }

    /**
     * @param string $dateTimeString
     * @param string $timeZone
     * @return string
     * @throws \Exception
     */
    public static function dateTimeAddOffsertByTimezone($dateTimeString, $timeZone = '')
    {
        if ($timeZone) {
            date_default_timezone_set($timeZone);
        }
        $timezoneOffset = date('Z');
        $d = new \DateTime($dateTimeString);
        $timestamp = $d->getTimestamp();
        $timestamp -= $timezoneOffset;
        $newDate = (new \DateTime('now'))->setTimestamp($timestamp);
        return $newDate->format('Y-m-d\TH:i:s');
    }

    /**
     * @param string $dateTimeString
     * @return bool
     */
    public static function isDateString($dateTimeString)
    {
        if (strpos($dateTimeString, 'T') !== false) {
            return (bool) preg_match("/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/", $dateTimeString);
        }
        return (bool) preg_match("/^\d{4}-\d{2}-\d{2}$/", $dateTimeString);
    }
}
