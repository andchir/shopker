<?php

namespace App\DataFixtures\MongoDB\ru;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\MainBundle\Document\User;
use App\MainBundle\Document\FieldType;
use App\MainBundle\Document\ContentType;
use App\MainBundle\Document\Category;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class UserFixtures extends Fixture implements ContainerAwareInterface
{

    /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {
        $userRepository = $manager->getRepository(User::class);
        if ($userRepository->getUsersCountBy('roles', ['ROLE_SUPER_ADMIN']) > 0) {
            return;
        }

        $plainPassword = 'admin';

        $user = new User();
        $user
            ->setUsername('admin')
            ->setEmail('admin@yourdomain.com');

        $encoder = $this->container->get('security.password_encoder');
        $password = $encoder->encodePassword($user, $plainPassword);

        $user
            ->setIsActive(true)
            ->setFullName('Администратор')
            ->setRoles(['ROLE_SUPER_ADMIN'])
            ->setPassword($password);

        $manager->persist($user);
        $manager->flush();
    }
}
