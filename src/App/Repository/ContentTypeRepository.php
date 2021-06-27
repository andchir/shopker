<?php

namespace App\Repository;

use Doctrine\ODM\MongoDB\Repository\DocumentRepository;

/**
 * ContentTypeRepository
 */
class ContentTypeRepository extends DocumentRepository
{
    use BaseRepositoryTrait;

}