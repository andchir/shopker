<?php

namespace AppBundle\Controller\Admin;

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
    abstract protected function validateData($data, $itemId = null);

    /**
     * @Route("")
     * @Method({"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getList(Request $request)
    {
        $queryString = $request->getQueryString();
        $options = $this->getQueryOptions($queryString);

        $repository = $this->getRepository();
        $results = $repository->findAllByOptions($options);

        $data = [];
        $getFull = !empty($options['full']);
        foreach ($results['items'] as $item) {
            $data[] = $item->toArray($getFull);
        }

        return new JsonResponse([
            'items' => $data,
            'total' => $results['total']
        ]);
    }

    /**
     * @param $queryString
     * @return mixed
     */
    public function getQueryOptions($queryString)
    {
        parse_str($queryString, $options);
        return $options;
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

        $item = $repository->find($itemId);
        if (!$item) {
            return $this->setError('Item not found.');
        }

        return new JsonResponse($item->toArray(true));
    }

    /**
     * @Route("/batch")
     * @Method({"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteBatch(Request $request)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        if(empty($data['ids'])){
            return $this->setError('Bad data.');
        }

        $repository = $this->getRepository();

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $qb = $dm->createQueryBuilder($repository->getClassName())
            ->field('_id')->in($data['ids']);

        $items = $qb->getQuery()->execute();
        foreach ($items as $item) {
            $dm->remove($item);
        }
        $dm->flush();

        return new JsonResponse([]);
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
            return $this->setError('Item not found.');
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        return new JsonResponse([]);
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
            return $this->setError($output['msg']);
        }

        return $this->createUpdate($data);
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
            return $this->setError($output['msg']);
        }

        return $this->createUpdate($data, $itemId);
    }

    /**
     * @param $name
     * @param null $itemId
     * @param null $parentId
     * @return mixed
     */
    public function checkNameExists($name, $itemId = null, $parentId = null){
        $repository = $this->getRepository();

        $query = $repository
            ->createQueryBuilder()
            ->field('name')->equals($name);

        if ($parentId !== null && is_numeric($parentId)) {
            $query = $query->field('parentId')->equals($parentId);
        }
        if($itemId !== null && is_numeric($itemId)){
            $query = $query->field('id')->notEqual($itemId);
        }

        return $query->getQuery()
            ->execute()
            ->count();
    }

}