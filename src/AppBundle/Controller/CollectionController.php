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
class CollectionController extends StorageControllerAbstract
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
            return new JsonResponse([
                'success' => false,
                'msg' => 'Item not found.'
            ]);
        }

        var_dump($collection->getName());

//        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
//        $dm = $this->get('doctrine_mongodb')->getManager();
//        $dm->remove( $category );
//        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return array
     */
    public function createUpdate($data, $itemId = '')
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

        return [
            'success' => true,
            'data' => $collection->toArray()
        ];
    }

    /**
     * @return \AppBundle\Repository\CollectionRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Collection');
    }
}