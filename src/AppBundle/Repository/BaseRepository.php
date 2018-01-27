<?php

namespace AppBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * BaseRepository
 */
abstract class BaseRepository extends DocumentRepository
{
    /**
     * @param array $options
     * @return array
     */
    public function findAllByOptions($options = [])
    {
        $defaults = [
            'page' => 1,
            'limit' => 10,
            'sort_by' => 'name',
            'sort_dir' => 'asc',
            'full' => 1,
            'only_active' => 1
        ];
        $opts = array_merge($defaults, $options);

        /** @var \Doctrine\ODM\MongoDB\Mapping\ClassMetadataFactory $factory */
        $factory = $this->getDocumentManager()->getMetadataFactory();

        /** @var \Doctrine\ODM\MongoDB\Mapping\ClassMetadata $metadata */
        $metadata = $factory->getMetadataFor($this->getDocumentName());
        $fieldNames = $metadata->getFieldNames();

        if(!in_array($opts['sort_by'], $fieldNames)){
            $opts['sort_by'] = $defaults['sort_by'];
        }
        if(!in_array($opts['sort_dir'], ['asc', 'desc'])){
            $opts['sort_dir'] = $defaults['sort_dir'];
        }
        if(!is_numeric($opts['page'])){
            $opts['page'] = $defaults['page'];
        }
        if(!is_numeric($opts['limit'])){
            $opts['limit'] = $defaults['limit'];
        }

        $query = $this->createQueryBuilder()
            ->sort($opts['sort_by'], $opts['sort_dir']);

        if ($opts['limit']) {
            $skip = ($opts['page'] - 1) * $opts['limit'];
            $query = $query
                ->limit($opts['limit'])
                ->skip($skip);
        }

//        if($opts['only_active']){
//            $query = $query
//                ->field('isActive')->equals(true);
//        }

        $results = $query
            ->getQuery()
            ->execute();

        $total = $this->createQueryBuilder()
            ->getQuery()->execute()->count();

        return [
            'items' => $results,
            'total' => $total
        ];
    }

}
