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
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class OrderController
 * @package App\Controller
 * @Route("/admin/users")
 */
class UserController extends StorageControllerAbstract
{

    /**
     * @param $data
     * @param int $itemId
     * @return array
     */
    public function validateData($data, $itemId = null)
    {
        if (empty($data)) {
            return ['success' => false, 'msg' => 'Data is empty.'];
        }
        if (empty($data['role'])) {
            return ['success' => false, 'msg' => 'Role should not be blank.'];
        }
        return ['success' => true];
    }

    /**
     * Create or update item
     * @param $data
     * @param string $itemId
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function createUpdate($data, $itemId = null)
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        /** @var ValidatorInterface $validator */
        $validator = $this->get('validator');
        /** @var TranslatorInterface $translator */
        $translator = $this->get('translator');
        /** @var UserPasswordEncoderInterface $encoder */
        $encoder = $this->get('security.password_encoder');
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        $repository = $this->getRepository();

        /** @var User $item */
        if($itemId){
            /** @var User $item */
            $item = $this->getRepository()->find($itemId);
            if(!$item){
                return $this->setError($translator->trans('Item not found.', [], 'validators'));
            }
            if ($data['email'] !== $item->getEmail()) {
                $usersCount = $repository->getUsersCountBy('email', $data['email']);
                if ($usersCount > 0) {
                    return $this->setError($translator->trans('register.email.already exists', [], 'validators'));
                } else {
                    $item->setUsername($data['email']);
                }
            }
        } else {
            $item = new User();
        }

        if ($currentUser->getId() == $item->getId()
            && $currentUser->getIsActive() && empty($data['isActive'])) {
                return $this->setError($translator->trans('You can not block yourself.', [], 'validators'));
        }

        $item
            ->setEmail($data['email'])
            ->setFullName($data['fullName'])
            ->setPhone($data['phone'])
            ->setIsActive(!empty($data['isActive']));

        if (isset($data['role']) && $currentUser->getId() !== $item->getId()) {
            $item->setRoles([$data['role']]);
        }

        // Set / update password
        if (!empty($data['password'])) {
            if (empty($data['confirmPassword']) || $data['password'] != $data['confirmPassword']) {
                return $this->setError($translator->trans('The password fields must match.', [], 'validators'));
            }
            $item
                ->setPlainPassword($data['password'])
                ->setPassword($encoder->encodePassword($item, $data['password']));
            $errors = $validator->validate($item);
            if (count($errors)) {
                return $this->setError($translator->trans($errors[0]->getMessage(), [], 'validators'));
            }
        }

        $errors = $validator->validate($item);
        if (count($errors)) {
            return $this->setError($translator->trans($errors[0]->getMessage(), [], 'validators'));
        }

        if (isset($data['options']) && is_array($data['options'])) {
            $item->setOptions($data['options']);
        }

        if (!$item->getId()) {
            $dm->persist($item);
        }
        $dm->flush();

        return $this->json($item, 200, [], ['groups' => ['details']]);
    }

    /**
     * @Route("", methods={"GET"})
     * @param Request $request
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function getList(Request $request, SerializerInterface $serializer)
    {
        /** @var User $user */
        $user = $this->getUser();
        $queryString = $request->getQueryString();
        $options = $this->getQueryOptions($queryString);

        $repository = $this->getRepository();

        $filterIds = [];
        if (!$user->getIsSuperAdmin()) {
            $filterIds = $repository->getAdminIds();
        }
        // $filterIds[] = $user->getId();
        $filterIds = array_unique($filterIds);

        $results = $repository->findAllByOptions($options, $user->getId(), $filterIds);

        return $this->json([
            'items' => array_values($results['items']->toArray()),
            'total' => $results['total']
        ],
            200, [], ['groups' => ['list']]
        );
    }

    /**
     * @param $itemId
     * @return array
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function deleteItem($itemId)
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        $repository = $this->getRepository();

        /** @var User $item */
        $item = $repository->find($itemId);
        if(!$item || $item->getId() === $currentUser->getId()){
            return [
                'success' => false,
                'msg' => 'You can not delete yourself.'
            ];
        }

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->remove($item);
        $dm->flush();

        return ['success' => true];
    }

    /**
     * @param $itemId
     * @param bool $isActive
     * @return array
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     */
    public function blockItem($itemId, $isActive = false)
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        $repository = $this->getRepository();

        /** @var User $item */
        $item = $repository->find($itemId);
        if(!$item || $item->getId() === $currentUser->getId()){
            return [
                'success' => false,
                'msg' => 'You can not block yourself.'
            ];
        }

        $item->setIsActive($isActive);

        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->flush();

        return ['success' => true];
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
     * @return \App\Repository\UserRepository
     */
    public function getRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(User::class);
    }
}