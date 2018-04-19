<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Document\User;
use Doctrine\ORM\Query\Expr\Base;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class OrderController
 * @package AppBundle\Controller
 * @Route("/admin/users")
 */
class UserController extends StorageControllerAbstract
{
    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     */
    public function createUpdate($data, $itemId = null)
    {


        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function validateData($data, $itemId = null)
    {
        return ['success' => true];
    }

    /**
     * @return \AppBundle\Repository\UserRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(User::class);
    }
}