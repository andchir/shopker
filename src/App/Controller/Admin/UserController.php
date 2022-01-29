<?php

namespace App\Controller\Admin;

use App\MainBundle\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ORM\Query\Expr\Base;
use Doctrine\Persistence\ObjectRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
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

    /** @var ValidatorInterface */
    protected $validator;
    /** @var UserPasswordEncoderInterface */
    protected $encoder;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        TranslatorInterface $translator,
        ValidatorInterface $validator,
        UserPasswordEncoderInterface $encoder
    )
    {
        parent::__construct($params, $dm, $translator);
        $this->validator = $validator;
        $this->encoder = $encoder;
    }
    
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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function createUpdate($data, $itemId = null)
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();
        $repository = $this->getRepository();

        /** @var User $item */
        if($itemId){
            /** @var User $item */
            $item = $this->getRepository()->find($itemId);
            if(!$item){
                return $this->setError($this->translator->trans('Item not found.', [], 'validators'));
            }
            if ($data['email'] !== $item->getEmail()) {
                $usersCount = $repository->getUsersCountBy('email', $data['email']);
                if ($usersCount > 0) {
                    return $this->setError($this->translator->trans('register.email.already exists', [], 'validators'));
                } else {
                    $item->setUsername($data['email']);
                }
            }
        } else {
            $item = new User();
        }

        if ($currentUser->getId() == $item->getId()
            && $currentUser->getIsActive() && empty($data['isActive'])) {
                return $this->setError($this->translator->trans('You can not block yourself.', [], 'validators'));
        }

        $item
            ->setEmail($data['email'])
            ->setFullName($data['fullName'])
            ->setPhone($data['phone'])
            ->setIsActive(!empty($data['isActive']))
            ->setApiToken($data['apiToken'] ?? '')
            ->setGroups($data['groups'] ?? []);

        if (isset($data['role']) && $currentUser->getId() !== $item->getId()) {
            $item->setRoles([$data['role']]);
        }

        // Set / update password
        if (!empty($data['password'])) {
            if (empty($data['confirmPassword']) || $data['password'] != $data['confirmPassword']) {
                return $this->setError($this->translator->trans('The password fields must match.', [], 'validators'));
            }
            $item
                ->setPlainPassword($data['password'])
                ->setPassword($this->encoder->encodePassword($item, $data['password']));
            $errors = $this->validator->validate($item);
            if (count($errors)) {
                return $this->setError($this->translator->trans($errors[0]->getMessage(), [], 'validators'));
            }
        }

        $errors = $this->validator->validate($item);
        if (count($errors)) {
            return $this->setError($this->translator->trans($errors[0]->getMessage(), [], 'validators'));
        }

        if (isset($data['options']) && is_array($data['options'])) {
            $item->setOptions($data['options']);
        }

        if (!$item->getId()) {
            $this->dm->persist($item);
        }
        $this->dm->flush();

        return $this->json($item, 200, [], ['groups' => ['details']]);
    }

    /**
     * @Route("", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getList(Request $request)
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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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
        
        $this->dm->remove($item);
        $this->dm->flush();

        return ['success' => true];
    }

    /**
     * @param $itemId
     * @param bool $isActive
     * @return array
     * @throws \Doctrine\ODM\MongoDB\LockException
     * @throws \Doctrine\ODM\MongoDB\Mapping\MappingException
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
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
        
        $this->dm->flush();

        return ['success' => true];
    }

    /**
     * @Route("/roles", methods={"GET"})
     * @return JsonResponse
     */
    public function getRolesHierarchyAction()
    {
        return $this->json([
            'roles' => $this->getRolesHierarchy()
        ]);
    }
    
    /**
     * @Route("/create_api_token", methods={"POST"})
     * @return JsonResponse
     */
    public function createApiTokenAction()
    {
        try {
            $token = User::createApiToken();
        } catch (\Exception $e) {
            return $this->setError($e->getMessage());
        }
        return $this->json([
            'token' => $token
        ]);
    }

    /**
     * @return array
     */
    public function getRolesHierarchy()
    {
        $output = [];
        $rolesHierarchy = $this->params->get('security.role_hierarchy.roles');
        $roles = array_keys($rolesHierarchy);

        if (!in_array('ROLE_USER', $roles)) {
            array_unshift($roles, 'ROLE_USER');
        }

        foreach ($roles as $role) {
            array_push($output, [
                'name' => $role,
                'title' => $this->translator->trans($role)
            ]);
        }

        return $output;
    }

    /**
     * @return \App\Repository\UserRepository|ObjectRepository
     */
    public function getRepository()
    {
        return $this->dm->getRepository(User::class);
    }
}
