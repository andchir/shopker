<?php

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

        $plainPassword = 'admin';

        $user = new User();
        $user->setEmail('admin');

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
