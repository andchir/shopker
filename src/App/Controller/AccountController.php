<?php

namespace App\Controller;

use App\Events;
use App\MainBundle\Document\Order;
use App\MainBundle\Document\Setting;
use App\MainBundle\Document\User;

use App\Event\UserRegisteredEvent;
use App\Form\Type\UserProfileType;
use App\Repository\OrderRepository;
use App\Repository\UserRepository;
use App\Service\SettingsService;
use App\Service\ShopCartService;
use App\Service\UtilsService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Translation\TranslatorInterface;

use App\Form\Model\ChangePassword;
use App\Form\Type\ChangePasswordType;
use App\Form\Type\RegistrationType;
use App\Form\Model\Registration;
use App\Form\Model\ResetPassword;
use App\Form\Type\ResetPasswordType;
use App\Form\Type\UserType;

class AccountController extends Controller
{

    /**
     * @Route(
     *     "/{_locale}/login",
     *     name="login_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/login", name="login")
     * @param Request $request
     * @param AuthenticationUtils $authenticationUtils
     * @return RedirectResponse|Response
     */
    public function loginAction(Request $request, AuthenticationUtils $authenticationUtils)
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error ? $error->getMessage() : null
        ]);
    }

    /**
     * @Route(
     *     "/{_locale}/register",
     *     name="register_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/register", name="register")
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @param TranslatorInterface $translator
     * @return RedirectResponse|Response
     */
    public function registerAction(
        Request $request,
        UserPasswordEncoderInterface $encoder,
        TranslatorInterface $translator
    )
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $form = $this->createForm(RegistrationType::class, new Registration());

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $registration = $form->getData();
            /** @var User $user */
            $user = $registration->getUser();

            // User existence check
            $email = $user->getEmail();
            $usersCount = $this->getUserRepository()->getUsersCountBy('email', $email);
            if ($usersCount > 0) {
                $form->addError(new FormError($translator->trans('register.email.already exists', [], 'validators')));
            }

            if ($form->isValid()) {
                $plainPassword = $user->getPassword();
                $encodedPassword = $encoder->encodePassword($user, $plainPassword);

                $user
                    ->setRoles(['ROLE_USER'])
                    ->setPassword($encodedPassword);

                $dm->persist($user);
                $dm->flush();

                $request->getSession()
                    ->getFlashBag()
                    ->add('messages', 'You are successfully registered. Now you can enter.');

                /** @var EventDispatcher $evenDispatcher */
                $evenDispatcher = $this->get('event_dispatcher');
                $event = new UserRegisteredEvent($user, $request);
                $evenDispatcher->dispatch(UserRegisteredEvent::NAME, $event);

                return $this->redirectToRoute('login_localized', [
                    '_locale' => $request->getLocale()
                ]);
            }
        }

        return $this->render('security/register.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route(
     *     "/{_locale}/password_reset",
     *     name="password_reset_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/password_reset", name="password_reset")
     * @param Request $request
     * @param TranslatorInterface $translator
     * @param UtilsService $utilsService
     * @return Response
     */
    public function passwordResetAction(
        Request $request,
        TranslatorInterface $translator,
        UtilsService $utilsService
    )
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $form = $this->createForm(ResetPasswordType::class, new ResetPassword());
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $email = $form->get('email')->getData();
            $newPassword = $form->get('password')->getData();

            /** @var User $user */
            $user = $this->getUserRepository()->findOneBy([
                'email' => $email
            ]);
            if (!$user) {
                $form->addError(new FormError($translator->trans('password_reset.user.not_found', [], 'validators')));
            }
            else {

                $confirmCode = UtilsService::generatePassword();
                $user
                    ->setNewPassword($newPassword)
                    ->setSecretCode($confirmCode);

                $dm->flush();

                $siteURL = ($request->server->get('HTTPS') ? 'https' : 'http')
                    . "://{$request->server->get('HTTP_HOST')}/";

                $emailBody = $this->renderView('email/email_password_reset.html.twig', array(
                    'newPassword' => $newPassword,
                    'email' => $email,
                    'siteUrl' => $siteURL,
                    'confirmCode' => $confirmCode
                ));

                $utilsService->sendMail(
                    $this->getParameter('app.name') . ' - ' . $translator->trans('password_reset.mail_subject'),
                    $emailBody,
                    $email
                );

                $request->getSession()
                    ->getFlashBag()
                    ->add('messages', 'An email with further instructions has been sent to your email address.');
            }
        }

        return $this->render('security/password_reset.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/password_confirm/{email}/{code}", name="password_confirm")
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @param $email
     * @param $code
     * @return Response
     */
    public function passwordConfirmAction(
        Request $request,
        UserPasswordEncoderInterface $encoder,
        $email,
        $code
    )
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $userRepository = $this->getUserRepository();
        /** @var User $user */
        $user = $userRepository->findOneBy([
            'email' => $email,
            'secretCode' => $code
        ]);
        if ($user) {

            $newPassword = $user->getNewPassword();
            if ($newPassword) {
                $encodedPassword = $encoder->encodePassword($user, $newPassword);
                $user
                    ->setPassword($encodedPassword)
                    ->setNewPassword(null)
                    ->setSecretCode(null);
                $dm->flush();
            }

            $request->getSession()
                ->getFlashBag()
                ->add('messages', 'Your password has been changed successfully. Now you can enter.');

            return $this->redirectToRoute('login_localized', [
                '_locale' => $request->getLocale()
            ]);
        }

        return new Response('');
    }

    /**
     * @Route("/email_confirm/{email}/{code}", name="email_confirm")
     * @param Request $request
     * @param EventDispatcherInterface $eventDispatcher
     * @param $email
     * @param $code
     * @return Response
     */
    public function emailConfirmAction(
        Request $request,
        EventDispatcherInterface $eventDispatcher,
        $email,
        $code
    )
    {
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();
        $userRepository = $this->getUserRepository();
        /** @var User $user */
        $user = $userRepository->findOneBy([
            'email' => $email,
            'secretCode' => $code
        ]);
        if ($user) {

            $user
                ->setSecretCode(null)
                ->setIsActive(true);
            $dm->flush();

            // Dispatch event
            $event = new GenericEvent($user);
            $eventDispatcher->dispatch(Events::USER_EMAIL_CONFIRMED, $event);

            $request->getSession()
                ->getFlashBag()
                ->add('messages', 'Your email has been successfully verified. Now you can enter.');

            return $this->redirectToRoute('login_localized', [
                '_locale' => $request->getLocale()
            ]);
        }

        return new Response('');
    }

    /**
     * @Route(
     *     "/{_locale}/profile/",
     *     name="profile_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/profile/", name="profile")
     * @param Request $request
     * @return RedirectResponse
     */
    public function profileAction(Request $request)
    {
        return $this->redirectToRoute('profile_history_orders_localized', [
            '_locale' => $request->getLocale()
        ]);
    }

    /**
     * @Route(
     *     "/{_locale}/profile/change_password",
     *     name="profile_change_password_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/profile/change_password", name="profile_change_password")
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @return RedirectResponse|Response
     */
    public function profileChangePasswordAction(Request $request, UserPasswordEncoderInterface $encoder)
    {
        /** @var User $user */
        $user = $this->getUser();
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        $form = $this->createForm(ChangePasswordType::class, new ChangePassword());
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $model = $form->getData();
            $encodedPassword = $encoder->encodePassword($user, $model->getPassword());

            $user
                ->setPassword($encodedPassword)
                ->setNewPassword(null)
                ->setSecretCode(null);
            $dm->flush();

            $request->getSession()
                ->getFlashBag()
                ->add('messages', 'Your password has been changed successfully.');

            return $this->redirectToRoute('profile_change_password_localized', ['_locale' => $request->getLocale()]);
        }

        return $this->render('profile/change_password.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route(
     *     "/{_locale}/profile/history_orders/{page}/{orderId}",
     *     name="profile_history_orders_localized",
     *     requirements={"_locale": "^[a-z]{2}$", "page", "orderId"},
     *     defaults={"page": 1, "orderId": 0}
     * )
     * @Route(
     *     "/profile/history_orders/{page}/{orderId}",
     *     name="profile_history_orders",
     *     requirements={"page", "orderId"},
     *     defaults={"page": 1, "orderId": 0}
     * )
     * @param Request $request
     * @param $page
     * @param $orderId
     * @return RedirectResponse|Response
     */
    public function historyOrdersAction(Request $request, $page, $orderId)
    {
        $pageLimit = 10;

        /** @var User $user */
        $user = $this->getUser();
        /** @var SettingsService $settingsService */
        $settingsService = $this->container->get('app.settings');
        /** @var ShopCartService $shopCartService */
        $shopCartService = $this->get('app.shop_cart');
        $orderStatusSettings = $settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
        $orderId = intval($orderId);

        $orderRepository = $this->getOrderRepository();
        $total = $orderRepository->getCountByUserId($user->getId());
        $paymentStatusNumber = (int) $this->getParameter('app.payment_status_number');

        $pagesOptions = UtilsService::getPagesOptions([
            'page' => $page,
            'limit' => $pageLimit
        ], $total);

        $orders = $orderRepository->getAllByUserId(
            $user->getId(),
            $pagesOptions['skip'],
            $pagesOptions['limit']
        );

        $currentOrderStatusNumber = 0;
        $isPaymentAllowed = false;
        $receipt = [];
        if (!empty($orderId)) {
            $currentOrder = array_filter($orders->toArray(), function($order) use ($orderId) {
                return $order->getId() === $orderId;
            });
            if (!empty($currentOrder)) {
                /** @var Order $currentOrder */
                $currentOrder = current($currentOrder);
                $currentOrderStatusNumber = $settingsService->getOrderStatusNumber(
                    $currentOrder->getStatus()
                );
                if ($currentOrder->getPaymentValue()
                    && $paymentStatusNumber === $currentOrderStatusNumber
                    && !$currentOrder->getIsPaid()) {
                        $receipt = $shopCartService->createReceipt($currentOrder);
                        $isPaymentAllowed = true;
                }
            }
        }

        return $this->render('profile/history_orders.html.twig', [
            'orders' => $orders,
            'pagesOptions' => $pagesOptions,
            'currentOrderId' => $orderId,
            'receipt' => $receipt,
            'receiptJSON' => json_encode($receipt, JSON_UNESCAPED_UNICODE),
            'receiptOptionName' => $this->container->hasParameter('app.receipt_option_name')
                ? $this->getParameter('app.receipt_option_name')
                : 'receipt',
            'orderStatusSettings' => $orderStatusSettings,
            'paymentStatusNumber' => $paymentStatusNumber,
            'currentOrderStatusNumber' => $currentOrderStatusNumber,
            'isPaymentAllowed' => $isPaymentAllowed
        ]);
    }

    /**
     * @Route(
     *     "/{_locale}/profile/profile_contacts",
     *     name="profile_contacts_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/profile/profile_contacts", name="profile_contacts")
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function contactsAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        /** @var \Doctrine\ODM\MongoDB\DocumentManager $dm */
        $dm = $this->get('doctrine_mongodb')->getManager();

        $form = $this->createForm(UserProfileType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $dm->flush();

            $request->getSession()
                ->getFlashBag()
                ->add('messages', 'profile.contacts_data_saved_successfully');
        }

        return $this->render('profile/contacts.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @return UserRepository
     */
    public function getUserRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(User::class);
    }

    /**
     * @return OrderRepository
     */
    public function getOrderRepository()
    {
        return $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository(Order::class);
    }
}
