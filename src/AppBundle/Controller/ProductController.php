<?php

namespace AppBundle\Controller;

use AppBundle\Document\ContentType;
use AppBundle\Document\Product;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class ProductController
 * @package AppBundle\Controller
 * @Route("/admin/products")
 */
class ProductController extends StorageControllerAbstract
{

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function validateData($data, $itemId = 0)
    {

        return ['success' => true];
    }

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function createUpdate($data, $itemId = 0){

        if(empty($data['content_type'])){
            return [
                'success' => false,
                'msg' => 'Content type not found.'
            ];
        }

        /** @var ContentType $contentType */
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $data['content_type']
            ]);

        if(!$contentType){
            return [
                'success' => false,
                'msg' => 'Content type not found.'
            ];
        }

        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($this->getParameter('mongodb_database'));
        $collection = $db->createCollection($contentType->getCollection());

        if($itemId){
            //TODO: get from DB
            $document = [];
        } else {
            $document = [];
        }

        foreach ($contentType->getFields() as $field){
            $document[$field['name']] = !empty($data[$field['name']])
                ? $data[$field['name']]
                : '';
        }

        $result = $collection->insert($document);

        //$result = $collection->update(['_id' => $document['id']], ['$set' => $document]);

        return [
            'success' => !empty($result['ok']),
            'data' => $document
        ];
    }

    /**
     * @Route("", name="product_list")
     * @Method({"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getList(Request $request)
    {
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($this->getParameter('mongodb_database'));
        $collection = $db->createCollection('products');

        $data = [];
        $results = $collection->find();

        //TODO: get fields from Content type
        foreach ($results as $entry) {
            $data[] = array_merge($entry, [
                'id' => $entry['_id']
            ]);
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Product');
    }

}