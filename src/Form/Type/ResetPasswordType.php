<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ResetPasswordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('email', EmailType::class);
        $builder->add('password', RepeatedType::class, [
            'first_name' => 'password',
            'second_name' => 'confirm',
            'type' => PasswordType::class,
            'first_options' => [
                'label' => 'New password'
            ],
            'second_options' => [
                'label' => 'Confirm password'
            ]
        ]);
    }
}
