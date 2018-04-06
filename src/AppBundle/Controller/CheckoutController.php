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

        $settingsDelivery = $settingsService->getSettingsGroup(Setting::GROUP_DELIVERY);

        $order = new Order();
        $form = $this->createForm(OrderType::class, $order, [
            'choiceDelivery' => $settingsDelivery,
            // TODO: Get payment settings from database
            'choicePayment' => [
                'Оплата онлайн банковской картой',
                'Оплата при получении товара'
            ]
        ]);
        $form->handleRequest($request);

        if ($user) {
            $order->setUserId($user->getId());
        }

        if ($form->isSubmitted() && $form->isValid()) {
            // $form->addError(new FormError('Error.'));

            /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
            $dm = $this->get('doctrine_mongodb')->getManager();
            $dm->persist($order);
            $dm->flush();

            /** @var ShopCartService $shopCartService */
            $shopCartService = $this->get('app.shop_cart');
            $shopCartService->clearContent();

            $request->getSession()
                ->getFlashBag()
                ->add('messages', 'Thanks for your order!');

            return $this->redirectToRoute('page_checkout_success');
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