<?php

namespace AppBundle\DataFixtures\MongoDB\en;

use AppBundle\Document\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Document\FieldType;
use AppBundle\Document\ContentType;
use AppBundle\Document\Category;

class UserFixtures extends Fixture
{

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
            ->setFullName('Admin')
            ->setRoles(['ROLE_SUPER_ADMIN'])
            ->setPassword($password);

        $manager->persist($user);
        $manager->flush();
    }
}
