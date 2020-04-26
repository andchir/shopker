<?php

namespace App\Tests\Service;

use App\Service\CatalogService;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CatalogServiceTest extends WebTestCase {
    
    public function testCreateAggregatePipeline()
    {
        self::bootKernel();
        // Gets the special container that allows fetching private services
        $container = self::$container;
        
        /** @var CatalogService $catalogService */
        $catalogService = $container->get('app.catalog');

        $criteria = ['isActive' => true];
        $catalogService->applyLocaleFilter('ru', 'title', $criteria);
        
        $this->assertEquals(true, isset($criteria['$and'][1]));
        $this->assertEquals(true, in_array('translations.title.ru', array_keys($criteria['$and'][1])));

        $pipeline = $catalogService->createAggregatePipeline($criteria, [], 10, ['title' => 1], 0);

        $this->assertEquals(true, isset($pipeline[0]['$match']));
        $this->assertEquals(true, isset($pipeline[1]['$sort']));
        $this->assertEquals(true, isset($pipeline[2]['$limit']));
    }
    
}
