<?php

namespace App\Controller\Admin;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class StorageControllerAbstract
 * @package App\Controller
 * @Route("/parent_name")
 */
abstract class StorageControllerAbstract extends BaseController
{
    abstract protected function getRepository();
    abstract protected function createUpdate($data);
    abstract protected function validateData($data, $itemId = null);

    /**
     * @Route("", methods={"GET"})
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
     * @Route("/{itemId}", methods={"GET"})
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
     * @Route("/batch", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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
     * @Route("/{itemId}", methods={"DELETE"})
     * @param int $itemId
     * @param TranslatorInterface $translator
     * @return JsonResponse
     */
    public function deleteItemAction($itemId, TranslatorInterface $translator)
    {
        if(!$this->deleteItem($itemId)){
            return $this->setError($translator->trans('Item not found.', [], 'validators'));
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
     * @Route("", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function createItem(Request $request)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');

        $output = $this->validateData($data);
        if(!$output['success']){
            return $this->setError($translator->trans($output['msg'], [], 'validators'));
        }

        return $this->createUpdate($data);
    }

    /**
     * @Route("/{itemId}", methods={"PUT"})
     * @param Request $request
     * @param int $itemId
     * @return JsonResponse
     */
    public function updateItem(Request $request, $itemId)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');

        $output = $this->validateData($data, $itemId);
        if(!$output['success']){
            return $this->setError($translator->trans($output['msg'], [], 'validators'));
        }

        return $this->createUpdate($data, $itemId);
    }

    /**
     * @Route(
     *     "/{action}/batch",
     *     requirements={"action"},
     *     defaults={"action": "delete"},
     *     methods={"POST"}
     * )
     * @param Request $request
     * @param string $action
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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
