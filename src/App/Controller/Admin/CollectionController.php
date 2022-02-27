<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\Collection;
use App\MainBundle\Document\ContentType;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * Class CollectionController
 * @package App\Controller
 * @Route("/admin/collections")
 */
class CollectionController extends BaseController
{

    /**
     * @Route("", methods={"GET"})
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
     * @Route("/{itemName}", name="collection_delete", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN_WRITE", statusCode="400", message="Your user has read-only permission.")
     * @param Request $request
     * @param string $itemName
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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

        $contentTypeRepository = $this->dm->getRepository(ContentType::class);

        $count = $contentTypeRepository->createQueryBuilder()
            ->field('collection')->equals($itemName)
            ->count()
            ->getQuery()
            ->execute();

        if($count > 0){
            return $this->setError('This collection is not empty.');
        }
        
        $this->dm->remove($collection);
        $this->dm->flush();

        return new JsonResponse([]);
    }

    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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
        
        $this->dm->persist($collection);
        $this->dm->flush();

        return new JsonResponse($collection->toArray());
    }

    /**
     * @return \App\Repository\CollectionRepository|ObjectRepository
     */
    public function getRepository()
    {
        return $this->dm->getRepository(Collection::class);
    }
}