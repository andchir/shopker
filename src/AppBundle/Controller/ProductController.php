<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Document\ContentType;
use AppBundle\Document\Product;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
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

        $document['parent_id'] = !empty($data['parent_id'])
            ? $data['parent_id']
            : 0;
        $document['is_active'] = isset($data['is_active'])
            ? $data['is_active']
            : true;

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
     * @Route("/{categoryId}", name="category_product_list")
     * @Method({"GET"})
     * @ParamConverter("category", class="AppBundle:Category", options={"id" = "categoryId"})
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function getListByCategory(Request $request, Category $category = null)
    {
        if(!$category){
            return new JsonResponse([
                'success' => true,
                'data' => []
            ]);
        }

        $contentTypeName = $category->getContentType();

        /** @var ContentType $contentType */
        $contentType = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(ContentType::class)
            ->findOneBy([
                'name' => $contentTypeName
            ]);

        if(!$contentType){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Content type not found.'
            ]);
        }

        $contentTypeFields = $contentType->getFields();

        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        $db = $m->selectDatabase($this->getParameter('mongodb_database'));
        $collection = $db->createCollection($contentType->getCollection());

        $data = [];
        $results = $collection->find([
            'parent_id' => $category->getId()
        ]);

        foreach ($results as $entry) {
            $row = [
                'parent_id' => $entry['parent_id'],
                'is_active' => $entry['is_active']
            ];
            foreach ($contentTypeFields as $field){
                $row[$field['name']] = !empty($entry[$field['name']])
                    ? $entry[$field['name']]
                    : '';
            }
            $data[] = $row;
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