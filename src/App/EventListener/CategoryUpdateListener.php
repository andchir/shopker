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
        $previousName = $event->getPreviousName();

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
        if ($category->getName() !== $previousName) {
            $this->updateUriChildren($category);
        }
        return $category;
    }
    
    /**
     * Update is_folder flag
     * @param $itemId
     * @return Category|null
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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
     * @param string $parentUri
     * @return bool
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateUri(Category &$category, $parentUri = null)
    {
        if (!$category->getId()) {
            return false;
        }
        $uri = is_null($parentUri) ? $this->createParentUri($category) : $parentUri;
        $uri .= $category->getName() . '/';

        $category->setUri($uri);

        $this->dm->persist($category);
        $this->dm->flush();

        return true;
    }
    
    /**
     * @param Category $parentCategory
     * @param int $count
     * @return int
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function updateUriChildren(Category $parentCategory, $count = 0)
    {
        /** @var CategoryRepository $repository */
        $repository = $this->dm->getRepository(Category::class);
        $children = $repository->getChildren($parentCategory, [], false);
        
        /** @var Category $childCategory */
        foreach ($children as $childCategory) {
            if ($this->updateUri($childCategory, $parentCategory->getUri())) {
                $count++;
                $count = $this->updateUriChildren($childCategory, $count);
            }
        }
        
        return $count;
    }
    
    /**
     * @param Category $category
     * @return string
     */
    public function createParentUri(Category $category)
    {
        /** @var CategoryRepository $repository */
        $repository = $this->dm->getRepository(Category::class);
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
        return !empty($names) ? implode('/', $names) . '/' : '';
    }
}
