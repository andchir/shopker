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

        if($category && $category->getName() === 'root'){
            return $category;
        }

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

        $this->updateUri($category);

        return $category;
    }

    /**
     * Update is_folder flag
     * @param $itemId
     * @return Category|null
     */
    public function isFolderUpdate($itemId)
    {

        /** @var CategoryRepository $repository */
        $repository = $this->container->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
            
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

    /**
     * @param Category $category
     * @return bool
     */
    public function updateUri(Category &$category)
    {
        $parents = $this->getParents($category);
        $names = [];
        /** @var Category $parent */
        foreach ($parents as $parent) {
            $names[] = $parent->getName();
        }
        $names = array_reverse($names);
        $uri = !empty($names) ? '/' . implode('/', $names) : '';
        $uri .= '/' . $category->getName() . '/';

        $category->setUri($uri);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->container->get('doctrine_mongodb')->getManager();
        $dm->persist($category);
        $dm->flush();

        return true;
    }

    /**
     * @param Category $category
     * @param array $parents
     * @return array
     */
    public function getParents(Category $category, $parents = [])
    {
        /** @var CategoryRepository $repository */
        $repository = $this->container->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);

        /** @var Category $parent */
        $parent = $repository->findOneBy([
            'id' => $category->getParentId()
        ]);
        if ($parent) {
            $parents[] = $parent;
            if ($category->getParentId() > 0) {
                $parents = $this->getParents($parent, $parents);
            }
        }

        return $parents;
    }

}
