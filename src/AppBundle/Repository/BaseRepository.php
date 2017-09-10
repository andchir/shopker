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
            'sortBy' => 'name',
            'sortDir' => 'asc',
            'full' => 1
        ];
        $opts = array_merge($defaults, $options);

        /** @var \Doctrine\ODM\MongoDB\Mapping\ClassMetadataFactory $factory */
        $factory = $this->getDocumentManager()->getMetadataFactory();

        /** @var \Doctrine\ODM\MongoDB\Mapping\ClassMetadata $metadata */
        $metadata = $factory->getMetadataFor($this->getDocumentName());
        $fieldNames = $metadata->getFieldNames();

        if(!in_array($opts['sortBy'], $fieldNames)){
            $opts['sortBy'] = $defaults['sortBy'];
        }
        if(!in_array($opts['sortDir'], ['asc', 'desc'])){
            $opts['sortDir'] = $defaults['sortDir'];
        }
        if(!is_numeric($opts['page'])){
            $opts['page'] = $defaults['page'];
        }
        if(!is_numeric($opts['limit'])){
            $opts['limit'] = $defaults['limit'];
        }

        $skip = ($opts['page'] - 1) * $opts['limit'];

        $results = $this->createQueryBuilder()
            ->sort($opts['sortBy'], $opts['sortDir'])
            ->limit($opts['limit'])
            ->skip($skip)
            ->getQuery()
            ->execute();

        $total = $this->createQueryBuilder()
            ->getQuery()->execute()->count();

        return [
            'data' => $results,
            'total' => $total
        ];
    }

}
