<?php

namespace App\DataFixtures\MongoDB\en;

use Doctrine\Bundle\MongoDBBundle\Fixture\Fixture;
use Doctrine\Bundle\MongoDBBundle\Fixture\FixtureGroupInterface;
use Doctrine\Common\Persistence\ObjectManager;
use App\MainBundle\Document\User;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture implements FixtureGroupInterface
{

    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
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
            ->setEmail('admin@yourdomain.com');

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
