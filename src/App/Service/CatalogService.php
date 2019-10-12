<?php

namespace App\Service;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\ContentType;
use App\Repository\CategoryRepository;
use App\Repository\ContentTypeRepository;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
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

        $childContent = $parentCategory ? $this->getCategoryContent($parentCategory, [], $locale) : [];

        // Content pages (not categories)
        if (!empty($childContent)) {
            foreach ($childContent as $content) {
                $content['id'] = 0 - $content['id'];// This is not categories
                $data[0][] = $content;
            }
            array_multisort(
                array_column($data[0], 'menuIndex'),  SORT_ASC,
                array_column($data[0], 'title'), SORT_ASC,
                $data[0]
            );
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
        $mongodbClient = $this->container->get('doctrine_mongodb.odm.default_connection');

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
