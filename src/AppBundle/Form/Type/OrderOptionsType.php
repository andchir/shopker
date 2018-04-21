<?php

namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\NotBlank;

class OrderOptionsType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
//            ->add('country', TextType::class, [
//                'constraints' => new NotBlank(),
//                'label' => 'address.country'
//            ])
            ->add('state', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'address.state'
            ])
            ->add('zip', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'address.zip'
            ])
            ->add('city', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'address.city'
            ])
            ->add('street', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'address.street'
            ])
            ->add('house', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'address.house'
            ])
            ->add('apartment', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'address.apartment'
            ]);
    }

}