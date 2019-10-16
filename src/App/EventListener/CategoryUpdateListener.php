<?php

namespace App\EventListener;

use App\MainBundle\Document\Category;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use App\Event\CategoryUpdatedEvent;
use App\Repository\CategoryRepository;

class CategoryUpdateListener
{

    /** @var DocumentManager */
    protected $dm;

    public function setDocumentManager(DocumentManager $dm)
    {
        $this->dm = $dm;
    }

    /**
     * @param CategoryUpdatedEvent $event
     * @return Category|null
     */
    public function onUpdated(CategoryUpdatedEvent $event)
    {
        $this->setDocumentManager($event->getDocumentManager());

        $category = $event->getCategory();
        $previousParentId = $event->getPreviousParentId();

        if($category && $category->getName() === 'root'){
            return $category;
        }

        $ids = [];
        if ($previousParentId) {
            $ids[] = $previousParentId;
        }
        if ($category && $category->getId()) {
            $ids[] = $category->getId();
        }
        if ($category && $category->getParentId()) {
            $ids[] = $category->getParentId();
        }

        $ids = array_unique($ids);
        foreach ($ids as $id) {
            $this->updateIsFolder($id);
        }

        if ($category && $category->getId()) {
            $this->updateUri($category);
        }

        return $category;
    }

    /**
     * Update is_folder flag
     * @param $itemId
     * @return Category|null
     */
    public function updateIsFolder($itemId)
    {
        /** @var CategoryRepository $repository */
        $repository = $this->dm->getRepository(Category::class);
            
        /** @var Category $item */
        $item = $repository->find($itemId);
        if(!$item || !$item->getId()){
            return null;
        }

        $childCount = $repository->getChildCountByParentId($itemId);
        $isFolder = $childCount > 0;

        $item->setIsFolder($isFolder);

        $this->dm->persist($item);
        $this->dm->flush();

        return $item;
    }

    /**
     * @param Category $category
     * @return bool
     */
    public function updateUri(Category &$category)
    {
        if (!$category->getId()) {
            return false;
        }
        /** @var CategoryRepository $repository */
        $repository = $this->dm ->getRepository(Category::class);

        $parents = $repository->getParents($category);
        $names = [];
        /** @var Category $parent */
        foreach ($parents as $parent) {
            if ($parent->getName() === 'root') {
                continue;
            }
            $names[] = $parent->getName();
        }
        $names = array_reverse($names);
        $uri = !empty($names) ? implode('/', $names) . '/' : '';
        $uri .= $category->getName() . '/';

        $category->setUri($uri);

        $this->dm->persist($category);
        $this->dm->flush();

        return true;
    }

}
