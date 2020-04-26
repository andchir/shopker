<?php

namespace App\Controller\Admin;

use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ODM\MongoDB\Query\Builder as QueryBuilder;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Class StorageControllerAbstract
 * @package App\Controller
 * @Route("/parent_name")
 */
abstract class StorageControllerAbstract extends BaseController
{
    abstract protected function getRepository();
    abstract protected function createUpdate($data, $itemId = null);
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
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function deleteBatchAction(Request $request)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        if(empty($data['ids'])){
            return $this->setError($this->translator->trans('Bad data.', [], 'validators'));
        }

        $errors = [];
        foreach ($data['ids'] as $itemId) {
            $results = $this->deleteItem($itemId);
            if (!$results['success']) {
                $errors[] = $this->translator->trans($results['msg'], [], 'validators');
                break;
            }
        }

        return new JsonResponse([
            'success' => empty($errors),
            'msg' => implode(' ', $errors)
        ]);
    }

    /**
     * @Route("/{itemId}", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param int $itemId
     * @param EventDispatcher $evenDispatcher
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function deleteItemAction($itemId, EventDispatcher $evenDispatcher)
    {
        $results = $this->deleteItem($itemId);
        if(!$results['success']){
            return $this->setError($this->translator->trans($results['msg'], [], 'validators'));
        }
        return new JsonResponse([]);
    }

    /**
     * @param $itemId
     * @return array
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function deleteItem($itemId)
    {
        $repository = $this->getRepository();

        $item = $repository->find($itemId);
        if(!$item){
            return [
                'success' => false,
                'msg' => 'Item not found.'
            ];
        }
        
        $this->dm->remove($item);
        $this->dm->flush();

        return ['success' => true];
    }

    /**
     * @param $itemId
     * @param bool $isActive
     * @return array
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function blockItem($itemId, $isActive = false)
    {
        $repository = $this->getRepository();

        $item = $repository->find($itemId);
        if(!$item){
            return [
                'success' => false,
                'msg' => 'Item not found.'
            ];
        }

        $item->setIsActive($isActive);
        
        $this->dm->flush();

        return ['success' => true];
    }

    /**
     * @Route("", methods={"POST"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
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
            return $this->setError($this->translator->trans($output['msg'], [], 'validators'));
        }

        return $this->createUpdate($data);
    }

    /**
     * @Route("/{itemId}", methods={"PUT"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param int $itemId
     * @return JsonResponse
     */
    public function updateItem(Request $request, $itemId)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        $output = $this->validateData($data, (int) $itemId);
        if(!$output['success']){
            return $this->setError($this->translator->trans($output['msg'], [], 'validators'));
        }

        return $this->createUpdate($data, (int) $itemId);
    }

    /**
     * @Route(
     *     "/{action}/batch",
     *     requirements={"action"=".+"},
     *     defaults={"action": "delete"},
     *     methods={"POST"}
     * )
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param string $action
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function batchAction(Request $request, $action)
    {
        $data = $request->getContent()
            ? json_decode($request->getContent(), true)
            : [];

        if(empty($data['ids'])){
            return $this->setError($this->translator->trans('Bad data.', [], 'validators'));
        }

        $repository = $this->getRepository();
        
        $qb = $this->dm->createQueryBuilder($repository->getClassName())
            ->field('_id')->in($data['ids']);

        $items = $qb->getQuery()->execute();

        $errors = [];
        $firstItemIsActive = null;
        $index = 0;
        foreach ($items as $item) {
            if ($index === 0) {
                $firstItemIsActive = method_exists($item, 'getIsActive')
                    ? $item->getIsActive()
                    : true;
            }
            if ($action == 'delete') {
                $results = $this->deleteItem($item->getId());
                if (!$results['success']) {
                    $errors[] = $this->translator->trans($results['msg'], [], 'validators');
                    break;
                }
            }
            else if ($action == 'block') {
                $results = $this->blockItem($item->getId(), !$firstItemIsActive);
                if (!$results['success']) {
                    $errors[] = $this->translator->trans($results['msg'], [], 'validators');
                    break;
                }
            }
            $index++;
        }

        if (!empty($errors)) {
            return $this->setError(implode(' ', $errors));
        } else {
            return new JsonResponse([
                'success' => true
            ]);
        }
    }

    /**
     * @param $name
     * @param null $itemId
     * @param null $parentId
     * @return mixed
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function checkNameExists($name, $itemId = null, $parentId = null){
        $repository = $this->getRepository();

        /** @var QueryBuilder $query */
        $query = $repository->createQueryBuilder();
        $query->field('name')->equals($name);

        if ($parentId !== null && is_numeric($parentId)) {
            $query = $query->field('parentId')->equals($parentId);
        }
        if($itemId !== null && is_numeric($itemId)){
            $query = $query->field('id')->notEqual($itemId);
        }
        
        return $query
            ->count()
            ->getQuery()
            ->execute();
    }
}
