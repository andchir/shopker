<?php

namespace App\DataFixtures\MongoDB\en;

use Doctrine\Bundle\MongoDBBundle\Fixture\Fixture;
use Doctrine\Bundle\MongoDBBundle\Fixture\FixtureGroupInterface;
use Doctrine\Common\Persistence\ObjectManager;
use App\MainBundle\Document\User;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture implements ContainerAwareInterface, FixtureGroupInterface
{

    /** @var ContainerInterface */
    private $container;
    /** @var UserPasswordEncoderInterface */
    private $encoder;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
        $this->encoder = $this->container->get('security.password_encoder');
    }

    public function load(ObjectManager $manager)
    {
        $userRepository = $manager->getRepository(User::class);
        if ($userRepository->getUsersCountBy('roles', ['ROLE_SUPER_ADMIN', 'ROLE_USER']) > 0) {
            return;
        }

        $plainPassword = 'admin';

        $user = new User();
        $user
            ->setUsername('admin')
            ->setEmail('admin');

        $password = $this->encoder->encodePassword($user, $plainPassword);

        $user
            ->setIsActive(true)
            ->setFullName('Admin')
            ->setRoles(['ROLE_SUPER_ADMIN'])
            ->setPassword($password);

        $manager->persist($user);
        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['en'];
    }
}
