<?php

namespace AppBundle\Form\Type;

use AppBundle\Form\DataTransformer\SettingToStringTransformer;
use AppBundle\Document\Order;
use AppBundle\Document\Setting;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;

class OrderType extends AbstractType
{
    private $deliveryTransformer;
    private $paymentTransformer;

    public function __construct(
        SettingToStringTransformer $deliveryTransformer,
        SettingToStringTransformer $paymentTransformer
    )
    {
        $this->deliveryTransformer = $deliveryTransformer->setGroupName(Setting::GROUP_DELIVERY);
        $this->paymentTransformer = $paymentTransformer->setGroupName(Setting::GROUP_PAYMENT);
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'constraints' => new Email()
            ])
            ->add('fullName', TextType::class, [
                'constraints' => new NotBlank()
            ])
            ->add('phone', TextType::class, [
                'required' => false
            ])
            ->add('address', TextType::class)
            ->add('deliveryName', ChoiceType::class, [
                'label' => 'Delivery method',
                'choices'  => $options['choiceDelivery'],
                'choice_label' => function($setting, $key, $index) {
                    /** @var Setting $setting */
                    return $setting->getName();
                },
                'invalid_message' => 'That is not a valid delivery method.',
                'constraints' => new NotBlank()
            ])
            ->add('paymentName', ChoiceType::class, [
                'label' => 'Payment method',
                'choices'  => $options['choicePayment'],
                'choice_label' => function($setting, $key, $index) {
                    /** @var Setting $setting */
                    return $setting->getName();
                },
                'invalid_message' => 'That is not a valid payment method.',
                'constraints' => new NotBlank()
            ])
            ->add('comment', TextareaType::class, [
                'attr' => ['rows' => '4'],
                'required' => false
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Submit order',
                'attr' => ['class' => 'btn btn-info btn-lg']
            ]);

        $builder->get('deliveryName')->addModelTransformer($this->deliveryTransformer);
        $builder->get('paymentName')->addModelTransformer($this->paymentTransformer);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Order::class,
            'allow_extra_fields' => true,
            'choiceDelivery' => null,
            'choicePayment' => null
        ));
    }
}
