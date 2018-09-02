<?php

namespace AppBundle\Controller\Admin;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

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
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function getList(Request $request, SerializerInterface $serializer)
    {
        $queryString = $request->getQueryString();
        $options = $this->getQueryOptions($queryString);

        $repository = $this->getRepository();
        $results = $repository->findAllByOptions($options);

        return $this->json([
                'items' => array_values($results['items']->toArray()),
                'total' => $results['total']
            ],
            200, [], ['groups' => ['list']]
        );
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
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function getItem($itemId, SerializerInterface $serializer)
    {
        $repository = $this->getRepository();

        $item = $repository->find($itemId);
        if (!$item) {
            return $this->setError('Item not found.');
        }

        return $this->json($item, 200, [], ['groups' => ['details']]);
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
    public function deleteItemAction($itemId)
    {
        if(!$this->deleteItem($itemId)){
            return $this->setError('Item not found.');
        }
        return new JsonResponse([]);
    }

    /**
     * @param $itemId
     * @return bool
     */
    public function deleteItem($itemId)
    {
        $repository = $this->getRepository();

        $item = $repository->find($itemId);
        if(!$item){
            return false;
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        return true;
    }

    /**
     * @param $itemId
     * @param bool $isActive
     * @return bool
     */
    public function blockItem($itemId, $isActive = false)
    {
        $repository = $this->getRepository();

        $item = $repository->find($itemId);
        if(!$item){
            return false;
        }

        $item->setIsActive($isActive);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->flush();

        return true;
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
     * @Route(
     *     "/{action}/batch",
     *     requirements={"action"},
     *     defaults={"action": "delete"}
     * )
     * @Method({"POST"})
     * @param Request $request
     * @param string $action
     * @return JsonResponse
     */
    public function batchAction(Request $request, $action = 'delete')
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

            switch ($action) {
                case 'delete':
                    $this->deleteItem($item->getId());
                    break;
                case 'block':
                    $this->blockItem($item->getId(), !$item->getIsActive());
                    break;
            }
        }

        return new JsonResponse([]);
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