<?php

namespace AppBundle\Controller;

use AppBundle\Document\Category;
use AppBundle\Document\Order;
use AppBundle\Document\Setting;
use AppBundle\Document\User;
use AppBundle\Repository\CategoryRepository;
use AppBundle\Service\SettingsService;
use AppBundle\Service\ShopCartService;
use Doctrine\ODM\MongoDB\Cursor;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use AppBundle\Form\Type\OrderType;

/**
 * @Route("/checkout")
 */
class CheckoutController extends BaseController
{

    /**
     * @Route("", name="page_checkout")
     * @param Request $request
     * @return Response
     */
    public function checkoutAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        /** @var SettingsService $settingsService */
        $settingsService = $this->get('app.settings');

        $settings = $settingsService->getAll();

        $order = new Order();
        $form = $this->createForm(OrderType::class, $order, [
            'choiceDelivery' => isset($settings[Setting::GROUP_DELIVERY])
                ? $settings[Setting::GROUP_DELIVERY]
                : [],
            'choicePayment' => isset($settings[Setting::GROUP_PAYMENT])
                ? $settings[Setting::GROUP_PAYMENT]
                : []
        ]);
        $form->handleRequest($request);

        if ($user) {
            $order->setUserId($user->getId());
        }

        if ($form->isSubmitted() && $form->isValid()) {

            /** @var Setting $delivery */
            $delivery = $form->get('deliveryName')->getNormData();
            $deliveryPrice = $delivery ? $delivery->getOption('price') : 0;

            /** @var Setting $payment */
            $payment = $form->get('paymentName')->getNormData();
            $paymentName = $payment ? $payment->getOption('value') : '';

            /** @var ShopCartService $shopCartService */
            $shopCartService = $this->get('app.shop_cart');
            $shopCartData = $shopCartService->getContent();
            if (empty($shopCartData)) {
                $form->addError(new FormError('Your cart is empty.'));
            }
            if ($form->isValid()) {

                $statusName = !empty($settings[Setting::GROUP_ORDER_STATUSES])
                    ? $settings[Setting::GROUP_ORDER_STATUSES][0]->getName()
                    : '';

                $order
                    ->setDeliveryPrice($deliveryPrice)
                    ->setPaymentValue($paymentName)
                    ->setContentFromCart($shopCartData)
                    ->setStatus($statusName);

                /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
                $dm = $this->get('doctrine_mongodb')->getManager();
                $dm->persist($order);
                $dm->flush();

                $shopCartService->clearContent();

                $request->getSession()
                    ->getFlashBag()
                    ->add('messages', 'Thanks for your order!');

                return $this->redirectToRoute('page_checkout_success');
            }
        }

        return $this->render('page_checkout.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/success", name="page_checkout_success")
     * @param Request $request
     * @return Response
     */
    public function checkoutSuccessAction(Request $request)
    {


        return $this->render('page_checkout_success.html.twig', [

        ]);
    }
}