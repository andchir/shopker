<?php

namespace AppBundle\Controller;

use AppBundle\Document\Collection;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class CollectionController
 * @package AppBundle\Controller
 * @Route("/admin/collections")
 */
class CollectionController extends BaseController
{

    /**
     * @Route("")
     * @Method({"GET"})
     * @return JsonResponse
     */
    public function getList(Request $request)
    {
        $repository = $this->getRepository();

        $results = $repository->findBy([], ['name' => 'asc']);

        $data = [];
        /** @var Collection $item */
        foreach ($results as $item) {
            $data[] = $item->getName();
        }

        return new JsonResponse($data);
    }

    /**
     * @Route("/{itemName}", name="collection_delete")
     * @Method({"DELETE"})
     * @param Request $request
     * @param string $itemName
     * @return JsonResponse
     */
    public function deleteItemByName(Request $request, $itemName)
    {
        $repository = $this->getRepository();

        /** @var Collection $category */
        $collection = $repository->findOneBy([
            'name' => $itemName
        ]);
        if(!$collection){
            return $this->setError('Item not found.');
        }

        $contentTypeRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:ContentType');

        $count = $contentTypeRepository->createQueryBuilder()
            ->field('collection')->equals($itemName)
            ->getQuery()
            ->execute()
            ->count();

        if($count > 0){
            return $this->setError('This collection is not empty.');
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($collection);
        $dm->flush();

        return new JsonResponse([]);
    }

    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     */
    public function createUpdate($data, $itemId = null)
    {
        if( !$itemId ){
            $collection = new Collection();
        } else {
            $repository = $this->getRepository();
            $collection = $repository->find( $itemId );
            if(!$collection){
                $collection = new Collection();
            }
        }
        $collection->setName($data['name']);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($collection);
        $dm->flush();

        return new JsonResponse($collection->toArray());
    }

    /**
     * @return \AppBundle\Repository\CollectionRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Collection::class);
    }
}