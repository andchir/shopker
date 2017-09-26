<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class ContentTypeController
 * @package AppBundle\Controller
 * @Route("/admin/categories")
 */
class CategoryController extends StorageControllerAbstract
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
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return array
     */
    public function createUpdate($data, $itemId = '')
    {

        return [
            'success' => true,
            'data' => []
        ];
    }

//    /**
//     * @Route("/app/categories_list", name="categories_get_list")
//     * @Method({"GET"})
//     * @param Request $request
//     * @return JsonResponse
//     */
//    public function getList(Request $request)
//    {
//        $repository = $this->getRepository();
//        $results = $repository->findAllOrderedByTitle();
//
//        $data = [];
//        /** @var Category $item */
//        foreach ($results as $item) {
//            $data[] = $item->toArray();
//        }
//
//        return new JsonResponse([
//            'success' => true,
//            'data' => $data
//        ]);
//    }
//
//    /**
//     * @Route("/app/category", name="category_create")
//     * @Method({"POST"})
//     * @param Request $request
//     * @return JsonResponse
//     */
//    public function createItem( Request $request )
//    {
//        $data = $request->getContent()
//            ? json_decode($request->getContent(), true)
//            : [];
//
//        $output = $this->validateData( $data );
//        if( !$output['success'] ){
//            return new JsonResponse( $output );
//        }
//
//        $output = $this->createUpdate( $data );
//
//        return new JsonResponse( $output );
//    }
//
//    /**
//     * @param $data
//     * @param string $itemId
//     * @return array
//     */
//    public function validateData( $data, $itemId = '' )
//    {
//        if( empty($data) ){
//            return ['success' => false, 'msg' => 'Data is empty.'];
//        }
//        if( empty($data['title']) ){
//            return ['success' => false, 'msg' => 'Title is required.'];
//        }
//        if( empty($data['name']) ){
//            return ['success' => false, 'msg' => 'System name is required.'];
//        }
//        if( empty($data['content_type']) ){
//            return ['success' => false, 'msg' => 'Content type is required.'];
//        }
//
//        //Check unique name
//        $repository = $this->getRepository();
//        $query = $repository->createQueryBuilder()
//            ->field('name')->equals($data['name']);
//
//        if( $itemId ){
//            $query = $query->field('id')->notEqual( $itemId );
//        }
//
//        $count = $query->getQuery()
//            ->execute()
//            ->count();
//
//        if( $count > 0 ){
//            return ['success' => false, 'msg' => 'System name already exists.'];
//        }
//
//        return ['success' => true];
//    }
//
//    /**
//     * @Route("/app/category/{itemId}", name="category_get")
//     * @Method({"GET"})
//     * @param Request $request
//     * @param $itemId
//     * @return JsonResponse
//     */
//    public function getItem( Request $request, $itemId )
//    {
//        $repository = $this->getRepository();
//
//        /** @var Category $category */
//        $category = $repository->find( $itemId );
//        if( !$category ){
//            return new JsonResponse([
//                'success' => false,
//                'msg' => 'Item not found.'
//            ]);
//        }
//
//        return new JsonResponse([
//            'success' => true,
//            'data' => $category->toArray()
//        ]);
//    }
//
//    /**
//     * Create or update item
//     * @param $data
//     * @param string $itemId
//     * @return array
//     */
//    public function createUpdate( $data, $itemId = '' )
//    {
//        if( empty($data) || empty($data['title']) || empty($data['name']) ){
//            return [
//                'success' => false,
//                'msg' => 'Data is empty.'
//            ];
//        }
//
//        if( !$itemId ){
//            $category = new Category();
//        } else {
//            $repository = $this->getRepository();
//            $category = $repository->find( $itemId );
//            if( !$category ){
//                $category = new Category();
//            }
//        }
//
//        $category
//            ->setParentId( isset($data['parent_id']) ? intval( $data['parent_id'] ) : 0 )
//            ->setTitle( $data['title'] )
//            ->setName( $data['name'] )
//            ->setContentType( $data['content_type'] )
//            ->setDescription( isset($data['description']) ? $data['description'] : '' );
//
//        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
//        $dm = $this->get('doctrine_mongodb')->getManager();
//        $dm->persist( $category );
//        $dm->flush();
//
//        return [
//            'success' => true,
//            'data' => $category->toArray()
//        ];
//    }
//
//    /**
//     * @Route("/app/category/{itemId}", name="category_put")
//     * @Method({"PUT"})
//     * @param Request $request
//     * @param string $itemId
//     * @return JsonResponse
//     */
//    public function editItem( Request $request, $itemId )
//    {
//        $data = $request->getContent()
//            ? json_decode($request->getContent(), true)
//            : [];
//
//        $output = $this->validateData( $data, $itemId );
//        if( !$output['success'] ){
//            return new JsonResponse( $output );
//        }
//
//        $output = $this->createUpdate( $data, $itemId );
//
//        return new JsonResponse( $output );
//    }
//
//    /**
//     * @Route("/app/category/{itemId}", name="category_delete")
//     * @Method({"DELETE"})
//     * @param Request $request
//     * @param $itemId
//     * @return JsonResponse
//     */
//    public function deleteItem( Request $request, $itemId )
//    {
//        $repository = $this->getRepository();
//
//        /** @var Category $category */
//        $category = $repository->find( $itemId );
//        if( !$category ){
//            return new JsonResponse([
//                'success' => false,
//                'msg' => 'Item not found.'
//            ]);
//        }
//
//        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
//        $dm = $this->get('doctrine_mongodb')->getManager();
//        $dm->remove( $category );
//        $dm->flush();
//
//        return new JsonResponse([
//            'success' => true
//        ]);
//    }
//
//    /**
//     * @return \AppBundle\Repository\CategoryRepository
//     */
//    public function getRepository()
//    {
//        return $this->get('doctrine_mongodb')
//            ->getManager()
//            ->getRepository('AppBundle:Category');
//    }

    /**
     * @return \AppBundle\Repository\ContentTypeRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Category');
    }

}
