<?php

namespace App\Form\Type;

use App\Form\DataTransformer\SettingToStringTransformer;
use App\MainBundle\Document\Order;
use App\MainBundle\Document\Setting;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\CallbackTransformer;

class OrderType extends AbstractType
{
    private $deliveryTransformer;
    private $paymentTransformer;
    protected $translator;

    public function __construct(
        SettingToStringTransformer $deliveryTransformer,
        SettingToStringTransformer $paymentTransformer,
        TranslatorInterface $translator
    )
    {
        $this->deliveryTransformer = $deliveryTransformer->setGroupName(Setting::GROUP_DELIVERY);
        $this->paymentTransformer = $paymentTransformer->setGroupName(Setting::GROUP_PAYMENT);
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if (empty($options['checkoutFields']) || in_array('options', $options['checkoutFields'])) {
            $builder
                ->add('options', OrderOptionsType::class, [
                'label' => false
            ]);
        }
        if (empty($options['checkoutFields']) || in_array('email', $options['checkoutFields'])) {
            $builder
                ->add('email', EmailType::class, [
                    'constraints' => [new NotBlank(), new Email()]
                ]);
        }
        if (empty($options['checkoutFields']) || in_array('fullName', $options['checkoutFields'])) {
            $builder
                ->add('fullName', TextType::class, [
                    'constraints' => new NotBlank()
                ]);
        }
        if (empty($options['checkoutFields']) || in_array('phone', $options['checkoutFields'])) {
            $builder
                ->add('phone', TextType::class, [
                    'constraints' => new NotBlank()
                ]);
        }
        if (empty($options['checkoutFields']) || in_array('deliveryName', $options['checkoutFields'])) {
            $builder
                ->add('deliveryName', ChoiceType::class, [
                    'label' => 'Delivery method',
                    'choices'  => $options['choiceDelivery'],
                    'choice_label' => function($setting, $key, $index) use ($options) {
                        /** @var Setting $setting */
                        return $setting->getName() . (
                            $setting->getOption('price')
                                ? " ({$setting->getOption('price')} {$options['currency']})"
                                : ''
                            );
                    },
                    'invalid_message' => 'That is not a valid delivery method.',
                    'constraints' => new NotBlank()
                ]);
            $builder->get('deliveryName')->addModelTransformer($this->deliveryTransformer);
        }
        if (empty($options['checkoutFields']) || in_array('paymentName', $options['checkoutFields'])) {
            $builder
                ->add('paymentName', ChoiceType::class, [
                    'label' => 'Payment method',
                    'choices'  => $options['choicePayment'],
                    'choice_label' => function($setting, $key, $index) {
                        /** @var Setting $setting */
                        return $setting->getName();
                    },
                    'invalid_message' => 'That is not a valid payment method.',
                    'constraints' => new NotBlank()
                ]);
            $builder->get('paymentName')->addModelTransformer($this->paymentTransformer);
        }

        if (empty($options['checkoutFields']) || in_array('comment', $options['checkoutFields'])) {
            $builder
                ->add('comment', TextareaType::class, [
                    'attr' => ['rows' => '4'],
                    'required' => false
                ]);
        }

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                /** @var FormInterface $form */
                $form = $event->getForm();
                $checkoutFields = $form->getConfig()->getOption('checkoutFields');

                // Set delivery address not required
                if ($form->getConfig()->getOption('noDeliveryFirst')
                    && (empty($checkoutFields) || in_array('options', $checkoutFields))) {
                        $deliveryIndex = isset($_POST['order']) && isset($_POST['order']['deliveryName'])
                            ? intval($_POST['order']['deliveryName'])
                            : -1;
                        if ($deliveryIndex === 0) {
                            foreach ($form->get('options')->all() as $fieldName => $field) {
                                $type = get_class($field->getConfig()->getType()->getInnerType());
                                $options = $field->getConfig()->getOptions();
                                $options['required'] = false;
                                $options['constraints'] = null;
                                $form->get('options')->add($fieldName, $type, $options);
                            }
                        }
                }
            }
        );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Order::class,
            'allow_extra_fields' => true,
            'choiceDelivery' => null,
            'choicePayment' => null,
            'noDeliveryFirst' => false,
            'checkoutFields' => [],
            'currency' => ''
        ]);
    }
}
