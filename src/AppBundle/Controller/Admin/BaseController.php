<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Document\Category;
use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class BaseController extends Controller
{

    public function getCategoriesTree()
    {
        $translator = $this->get('translator');
        $categoriesRepository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Category::class);
        $categories = $categoriesRepository->findBy([], [
            'menuIndex' => 'asc',
            'title' => 'asc'
        ]);

        $data = [];
        $root = [
            'id' => 0,
            'label' => $translator->trans('Root category'),
            'parentId' => 0,
            'expanded' => true
        ];
        /** @var Category $category */
        foreach ($categories as $category) {
            if (!$category->getId()) {
                continue;
            }
            $row = [
                'id' => $category->getId(),
                'label' => $category->getTitle(),
                'parentId' => $category->getParentId(),
                'expanded' => true
            ];
            $data[$row['parentId']][] = $row;
        }

        return self::createTree($data, [$root]);
    }

    /**
     * @param $message
     * @param int $status
     * @return JsonResponse
     */
    public function setError($message, $status = Response::HTTP_UNPROCESSABLE_ENTITY)
    {
        $response = new JsonResponse(["error" => $message]);
        $response = $response->setStatusCode($status);
        return $response;
    }

    /**
     * @param array $list
     * @param array $parent
     * @return array
     */
    public static function createTree(&$list, $parent){
        $tree = array();
        foreach ($parent as $k=>$l){
            if(isset($list[$l['id']])){
                $l['children'] = self::createTree($list, $list[$l['id']]);
            }
            $tree[] = $l;
        }
        return $tree;
    }

}