<?php

namespace AppBundle\Form\Type;

use AppBundle\Document\Order;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;

class OrderType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'constraints' => new Email()
            ])
            ->add('fullName', TextType::class)
            ->add('address', TextType::class)
            ->add('comment', TextareaType::class, [
                'attr' => ['rows' => '4'],
                'required' => false
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Submit order',
                'attr' => ['class' => 'btn btn-info btn-lg']
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Order::class,
            'allow_extra_fields' => true
        ));
    }
}
