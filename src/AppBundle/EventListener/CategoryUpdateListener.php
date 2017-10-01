<?php

namespace AppBundle\EventListener;

use AppBundle\Document\Category;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AppBundle\Event\CategoryUpdatedEvent;
use AppBundle\Repository\CategoryRepository;

class CategoryUpdateListener
{

    protected $container;

    public function setContainer(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param CategoryUpdatedEvent $event
     * @return Category|null
     */
    public function onUpdated(CategoryUpdatedEvent $event)
    {
        $this->setContainer($event->getContainer());

        $category = $event->getCategory();
        $previousParentId = $event->getPreviousParentId();

        if(!empty($category)){
            $category = $this->isFolderUpdate($category->getId());
            if($category->getParentId()){
                $this->isFolderUpdate($category->getParentId());
            }
        }

        //Previous parent
        if($previousParentId
            && (!$category || $previousParentId != $category->getParentId())){
            $this->isFolderUpdate($previousParentId);
        }

        return $category;
    }

    /**
     * Update is_folder flag
     * @param $itemId
     * @return Category|null
     */
    public function isFolderUpdate($itemId){

        /** @var CategoryRepository $repository */
        $repository = $this->container->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('AppBundle:Category');
            
        /** @var Category $item */
        $item = $repository->find($itemId);
        if(!$item){
            return null;
        }

        $childCount = $repository->getChildCountByParentId($itemId);
        $isFolder = $childCount > 0;

        $item->setIsFolder($isFolder);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->container->get('doctrine_mongodb')->getManager();
        $dm->persist($item);
        $dm->flush();

        return $item;
    }

}
