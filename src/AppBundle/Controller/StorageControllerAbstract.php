<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class StorageControllerAbstract
 * @package AppBundle\Controller
 * @Route("/parent_name")
 */
abstract class StorageControllerAbstract extends BaseController
{
    abstract protected function getRepository();
    abstract protected function createUpdate($data);
    abstract protected function validateData($data, $itemId = 0);

    /**
     * @Route("")
     * @Method({"GET"})
     * @return JsonResponse
     */
    public function getList()
    {
        $repository = $this->getRepository();
        $results = $repository->findAllOrderedBy('name', 'asc');

        $data = [];
        foreach ($results as $item) {
            $data[] = $item->toArray();
        }

        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @Route("/{itemId}")
     * @Method({"GET"})
     * @param $itemId
     * @return JsonResponse
     */
    public function getItem($itemId)
    {
        $repository = $this->getRepository();

        $fieldType = $repository->find($itemId);
        if (!$fieldType) {
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        return new JsonResponse([
            'success' => true,
            'data' => $fieldType->toArray()
        ]);
    }

    /**
     * @Route("/{itemId}")
     * @Method({"DELETE"})
     * @param int $itemId
     * @return JsonResponse
     */
    public function deleteItem($itemId)
    {
        $repository = $this->getRepository();

        $item = $repository->find($itemId);
        if(!$item){
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @Route("")
     * @Method({"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createItem(Request $request)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data);
        if(!$output['success']){
            return new JsonResponse($output);
        }

        return new JsonResponse($this->createUpdate($data));
    }

    /**
     * @Route("/{itemId}")
     * @Method({"PUT"})
     * @param Request $request
     * @param int $itemId
     * @return JsonResponse
     */
    public function updateItem(Request $request, $itemId)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data, $itemId);
        if(!$output['success']){
            return new JsonResponse($output);
        }

        return new JsonResponse($this->createUpdate($data, $itemId));
    }

    /**
     * @param $name
     * @param int $itemId
     * @return mixed
     */
    public function checkNameExists($name, $itemId = 0){

        $repository = $this->getRepository();
        $query = $repository->createQueryBuilder()
            ->field('name')->equals($name);

        if($itemId){
            $query = $query->field('id')->notEqual($itemId);
        }

        return $query->getQuery()
            ->execute()
            ->count();
    }

}