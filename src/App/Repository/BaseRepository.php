<?php

namespace App\Repository;

use Doctrine\ODM\MongoDB\Query\Builder;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

/**
 * BaseRepository
 */
abstract class BaseRepository extends DocumentRepository
{
    /**
     * @param array $options
     * @param int $userId
     * @param array $filterIds
     * @return array
     */
    public function findAllByOptions($options = [], $userId = 0, $filterIds = [])
    {
        $defaults = [
            'page' => 1,
            'limit' => 10,
            'sort_by' => 'name',
            'sort_dir' => 'asc',
            'full' => 1,
            'only_active' => 1,
            'search_word' => ''
        ];
        $opts = array_merge($defaults, $options);

        /** @var \Doctrine\ODM\MongoDB\Mapping\ClassMetadataFactory $factory */
        $factory = $this->getDocumentManager()->getMetadataFactory();

        /** @var \Doctrine\ODM\MongoDB\Mapping\ClassMetadata $metadata */
        $metadata = $factory->getMetadataFor($this->getDocumentName());
        $fieldNames = $metadata->getFieldNames();

        $opts['sort_by'] = self::stringToArray($opts['sort_by']);
        $opts['sort_by'] = self::arrayFilter($opts['sort_by'], $fieldNames);
        $opts['sort_dir'] = self::stringToArray($opts['sort_dir']);
        $opts['sort_dir'] = self::arrayFilter($opts['sort_dir'], ['asc', 'desc']);

        if(empty($opts['sort_by'])){
            $opts['sort_by'] = [$defaults['sort_by']];
        }
        if(empty($opts['sort_dir'])){
            $opts['sort_dir'] = [$defaults['sort_dir']];
        }
        if(!is_numeric($opts['page'])){
            $opts['page'] = $defaults['page'];
        }
        if(!is_numeric($opts['limit'])){
            $opts['limit'] = $defaults['limit'];
        }

        $query = $this->createQueryBuilder();
        if ($opts['search_word']) {
            $this->addSearchQuery($query, $opts['search_word']);
        }

        foreach ($opts['sort_by'] as $ind => $sortBy) {
            $query->sort(
                $sortBy,
                isset($opts['sort_dir'][$ind])
                    ? $opts['sort_dir'][$ind]
                    : $opts['sort_dir'][0]
            );
        }

        if ($opts['limit']) {
            $skip = ($opts['page'] - 1) * $opts['limit'];
            $query
                ->limit($opts['limit'])
                ->skip($skip);
        }

        if($opts['only_active']){
            $query->field('isActive')->equals(true);
        }
        if (!empty($filterIds)) {
            $query->field('id')->notIn($filterIds);
        }

        $results = $query
            ->getQuery()
            ->execute();

        $query = $this->createQueryBuilder();
        if ($opts['search_word']) {
            $this->addSearchQuery($query, $opts['search_word']);
        }
        $total = $query->count()->getQuery()->execute();

        return [
            'items' => $results,
            'total' => $total
        ];
    }

    /**
     * @param Builder $query
     * @param $searchWord
     */
    public function addSearchQuery(&$query, $searchWord)
    {

    }

    /**
     * @param $string
     * @return array
     */
    public static function stringToArray($string)
    {
        $output = explode(',', $string);
        return array_map('trim', $output);
    }

    /**
     * @param array $inputArr
     * @param array $targetArr
     * @return array
     */
    public static function arrayFilter($inputArr, $targetArr)
    {
        return array_filter($inputArr, function($val) use($targetArr) {
            return in_array($val, $targetArr);
        });
    }

    /**
     * @param $query
     * @param array $where
     */
    public function applyQueryWhere(&$query, $where)
    {
        foreach ($where as $key => $value) {
            if (!is_array($value)) {
                $query->field($key)->equals($value);
            } else {
                foreach ($value as $k => $v) {
                    switch ($k) {
                        case '$exists':
                            $query->field($key)->exists($v);
                            break;
                        case '$gte':
                            $query->field($key)->gte($v);
                            break;
                        case '$lt':
                            $query->field($key)->lt($v);
                            break;
                        case '$lte':
                            $query->field($key)->lte($v);
                            break;
                        case '$regex':
                            $query->field($key)->equals(new \MongoDB\BSON\Regex("{$v}", "i"));
                            break;
                    }
                }
            }
        }
    }
}
