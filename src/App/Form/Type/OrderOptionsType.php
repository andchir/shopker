<?php

namespace App\Form\Type;

use App\Form\DataTransformer\UserOptionsTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class OrderOptionsType extends AbstractType
{

    private $transformer;

    public function __construct(UserOptionsTransformer $transformer)
    {
        $this->transformer = $transformer;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('state', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'user_options.state'
            ])
            ->add('zip', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'user_options.zip'
            ])
            ->add('city', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'user_options.city'
            ])
            ->add('street', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'user_options.street'
            ])
            ->add('house', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'user_options.house'
            ])
            ->add('apartment', TextType::class, [
                'constraints' => new NotBlank(),
                'label' => 'user_options.apartment'
            ]);

        $builder->addModelTransformer($this->transformer);
    }

}