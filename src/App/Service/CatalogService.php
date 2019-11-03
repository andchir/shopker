<?php

namespace App\Service;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Filter;
use App\Repository\CategoryRepository;
use App\Repository\ContentTypeRepository;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CatalogService {

    /** @var ContainerInterface */
    protected $container;
    /** @var DocumentManager */
    private $dm;

    /**
     * @param ContainerInterface $container
     * @param DocumentManager $dm
     */
    public function __construct(ContainerInterface $container, DocumentManager $dm)
    {
        $this->container = $container;
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
     * @param Category $parentCategory
     * @param string $databaseName
     * @param bool $updateParents
     * @param bool $mixFromChild
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateFiltersData(Category $parentCategory, $databaseName = '', $updateParents = false, $mixFromChild = false)
    {
        $categoriesRepository = $this->getCategoriesRepository();

        if ($updateParents) {
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
            $collection = $this->getCollection($contentType->getCollection(), $databaseName);

            $filterArr = [];
            $filterData = [];

            // Mix from child categories
            if ($mixFromChild) {
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
                    foreach ($contentTypeFields as $contentTypeField) {
                        if (!$contentTypeField['isFilter']) {
                            continue;
                        }
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
                }
                unset($childCategories, $childCategory, $values);
            }

            foreach ($contentTypeFields as $contentTypeField) {
                if (!$contentTypeField['isFilter']) {
                    continue;
                }
                $fieldName = $contentTypeField['name'];

                $criteria = [
                    'isActive' => true
                ];

                // Get products fields unique data
                if ($contentTypeField['inputType'] === 'parameters') {

                    $this->applyCategoryFilter($cat, $contentTypeFields, $criteria);
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
                            $index = array_search($name, array_column($filterData, 'name'));
                            if ($index === false) {
                                $filterData[] = [
                                    'fieldName' => $fieldName,
                                    'name' => $name,
                                    'values' => []
                                ];
                                $index = count($filterData) - 1;
                            }
                            foreach ($data['values'] as $vk => $values) {
                                if (empty($values[$nk])) {
                                    continue;
                                }
                                if (!in_array($values[$nk], $filterData[$index]['values'])) {
                                    $filterData[$index]['values'][] = $values[$nk];
                                }
                            }
                        }
                    }

                } else {
                    $this->applyCategoryFilter($cat, $contentTypeFields, $criteria);
                    $uniqueValues = $collection->distinct($fieldName, $criteria);

                    $uniqueValues = array_filter($uniqueValues, function($val) {
                        return $val !== '' && !is_null($val);
                    });

                    if (!empty($uniqueValues)) {
                        if (!isset($filterArr[$fieldName])) {
                            $filterArr[$fieldName] = [];
                        }
                        $filterArr[$fieldName] = array_unique(array_merge($filterArr[$fieldName], $uniqueValues));
                        sort($filterArr[$fieldName]);
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
            } else {
                if (empty($filterArr) && empty($filterData)) {
                    $this->dm->remove($filter);
                    $cat->setFilterData(null);
                    $this->dm->flush();
                    continue;
                }
            }
            $filter
                ->setValues($filterArr)
                ->setValueData($filterData);

            $this->dm->flush();
        }

        return true;
    }

    /**
     * @param $collectionName
     * @param string $databaseName
     * @return \MongoDB\Collection
     */
    public function getCollection($collectionName, $databaseName = '')
    {
        if (!$databaseName) {
            $databaseName = $this->container->getParameter('mongodb_database');
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
    {;
        $translationFieldName = "translations.{$headerFieldName}.{$locale}";
        $andCriteria = [$translationFieldName => ['$exists' => true]];
        if (!isset($criteria['$and'])) {
            $criteria = ['$and' => [$criteria]];
        }
        $criteria['$and'][] = $andCriteria;
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
}
