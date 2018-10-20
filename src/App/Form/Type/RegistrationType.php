<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RegistrationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('user', UserType::class, [
            'label' => false
        ]);
        $builder->add('terms', CheckboxType::class, [
            'label' => 'I agree to the processing of personal data',
            'property_path' => 'termsAccepted'
        ]);
    }
}
