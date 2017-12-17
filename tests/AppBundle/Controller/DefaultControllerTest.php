<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/login');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        // $this->assertContains('Welcome to Symfony', $crawler->filter('#container h1')->text());
    }

    public function testMongoConnection()
    {

        $client = static::createClient();
        $client->enableProfiler();
        $container = $client->getContainer();

        $m = $container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($container->getParameter('mongodb_database'));
        $userCollection = $db->createCollection('user');

        $usersCount = 0;
        try {
            $usersCount = $userCollection->find()->count();

        } catch (\MongoConnectionException $e) {
            echo PHP_EOL . $e->getMessage();
        }

        $this->assertGreaterThanOrEqual(1, $usersCount);

    }

}
