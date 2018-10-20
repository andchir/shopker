<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\User;
use Doctrine\ORM\Query\Expr\Base;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class OrderController
 * @package App\Controller
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
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        /** @var User $item */
        $item = $this->getRepository()->find($itemId);
        if (!$item) {
            return $this->setError('Item not found.');
        }
        if ($currentUser
            && $currentUser->getId() == $item->getId()
            && $currentUser->getIsActive() && empty($data['isActive'])) {
                return $this->setError('You can not block yourself.');
        }

        $item
            ->setEmail($data['email'])
            ->setFullName($data['fullName'])
            ->setPhone($data['phone'])
            ->setIsActive(!empty($data['isActive']));

        if (isset($data['options']) && is_array($data['options'])) {
            $item->setOptions($data['options']);
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->flush();

        return new JsonResponse([
            'success' => true
        ]);
    }

    /**
     * @param $itemId
     * @return bool
     */
    public function deleteItem($itemId)
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        $repository = $this->getRepository();

        /** @var User $item */
        $item = $repository->find($itemId);
        if(!$item || $item->getId() === $currentUser->getId()){
            return false;
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        return true;
    }

    /**
     * @param $itemId
     * @param bool $isActive
     * @return bool
     */
    public function blockItem($itemId, $isActive = false)
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        $repository = $this->getRepository();

        /** @var User $item */
        $item = $repository->find($itemId);
        if(!$item || $item->getId() === $currentUser->getId()){
            return false;
        }

        $item->setIsActive($isActive);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->flush();

        return true;
    }

    /**
     * @Route("/roles", methods={"GET"})
     * @return JsonResponse
     */
    public function getRolesHierarchyAction()
    {
        return new JsonResponse([
            'roles' => $this->getRolesHierarchy()
        ]);
    }

    /**
     * @return array
     */
    public function getRolesHierarchy()
    {
        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');
        $output = [];
        $rolesHierarchy = $this->getParameter('security.role_hierarchy.roles');
        $roles = array_keys($rolesHierarchy);

        if (!in_array('ROLE_USER', $roles)) {
            array_unshift($roles, 'ROLE_USER');
        }

        foreach ($roles as $role) {
            array_push($output, [
                'name' => $role,
                'title' => $translator->trans($role)
            ]);
        }

        return $output;
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
     * @return \App\Repository\UserRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(User::class);
    }
}