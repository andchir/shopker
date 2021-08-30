<?php

namespace App\Controller;

use App\Events;
use App\Form\Type\FormTimezoneType;
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
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Contracts\Translation\TranslatorInterface;

use App\Form\Model\ChangePassword;
use App\Form\Type\ChangePasswordType;
use App\Form\Type\RegistrationType;
use App\Form\Model\Registration;
use App\Form\Model\ResetPassword;
use App\Form\Type\ResetPasswordType;

class AccountController extends BaseController
{
    /**
     * @Route(
     *     "/{_locale}/login",
     *     name="login_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/login", name="login")
     * @Route(
     *     "/{_locale}/login",
     *     name="app_login_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/login", name="app_login")
     * @param Request $request
     * @param AuthenticationUtils $authenticationUtils
     * @return RedirectResponse|Response
     */
    public function loginAction(Request $request, AuthenticationUtils $authenticationUtils)
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            'target_path' => $request->get('go_to', ''),
            'failure_path' => $request->get('back_to', ''),
            'last_username' => $lastUsername,
            'error' => $error
        ]);
    }

    /**
     * @Route("/logout", name="app_logout")
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
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
     * @param EventDispatcherInterface $evenDispatcher
     * @return RedirectResponse|Response
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function registerAction(
        Request $request,
        UserPasswordEncoderInterface $encoder,
        TranslatorInterface $translator,
        EventDispatcherInterface $evenDispatcher
    )
    {
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

                $this->dm->persist($user);
                $this->dm->flush();

                $this->addFlash('messages', 'You are successfully registered. Now you can enter.');

                $event = new UserRegisteredEvent($user, $request);
                $evenDispatcher->dispatch($event, UserRegisteredEvent::NAME);

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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function passwordResetAction(
        Request $request,
        TranslatorInterface $translator,
        UtilsService $utilsService
    )
    {
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

                $this->dm->flush();

                $siteURL = ($request->server->get('HTTPS') ? 'https' : 'http')
                    . "://{$request->server->get('HTTP_HOST')}/";

                $emailBody = $this->renderView('email/email_password_reset.html.twig', array(
                    'newPassword' => $newPassword,
                    'email' => $email,
                    'siteUrl' => $siteURL,
                    'confirmCode' => $confirmCode
                ));

                $utilsService->sendMail(
                    $this->params->get('app.name') . ' - ' . $translator->trans('password_reset.mail_subject'),
                    $emailBody,
                    $email
                );

                $this->addFlash('messages', 'An email with further instructions has been sent to your email address.');
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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function passwordConfirmAction(
        Request $request,
        UserPasswordEncoderInterface $encoder,
        $email,
        $code
    )
    {
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
                $this->dm->flush();
            }

            $this->addFlash('messages', 'Your password has been changed successfully. Now you can enter.');

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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function emailConfirmAction(Request $request, EventDispatcherInterface $eventDispatcher, $email, $code)
    {
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
            $this->dm->flush();

            // Dispatch event
            $event = new GenericEvent($user);
            $eventDispatcher->dispatch($event, Events::USER_EMAIL_CONFIRMED);

            $this->addFlash('messages', 'Your email has been successfully verified. Now you can enter.');

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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function profileChangePasswordAction(Request $request, UserPasswordEncoderInterface $encoder)
    {
        /** @var User $user */
        $user = $this->getUser();

        $form = $this->createForm(ChangePasswordType::class, new ChangePassword());
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $model = $form->getData();
            $encodedPassword = $encoder->encodePassword($user, $model->getPassword());

            $user
                ->setPassword($encodedPassword)
                ->setNewPassword(null)
                ->setSecretCode(null);
            $this->dm->flush();

            $this->addFlash('messages', 'Your password has been changed successfully.');

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
     *     requirements={"_locale"="^[a-z]{2}$", "page"="\d+", "orderId"="\d+"},
     *     defaults={"page": "1", "orderId": "0"}
     * )
     * @Route(
     *     "/profile/history_orders/{page}/{orderId}",
     *     name="profile_history_orders",
     *     requirements={"page"="\d+", "orderId"="\d+"},
     *     defaults={"page": "1", "orderId": "0"}
     * )
     * @Route(
     *     "/api/{_locale}/profile/history_orders/{page}/{orderId}",
     *     condition="request.headers.get('Content-Type') === 'application/json'",
     *     name="profile_history_orders_api",
     *     requirements={"_locale"="^[a-z]{2}$", "page"="\d+", "orderId"="\d+"},
     *     defaults={"page": "1", "orderId": "0"}
     * )
     * @param Request $request
     * @param SettingsService $settingsService
     * @param ShopCartService $shopCartService
     * @param int|string $page
     * @param int|string $orderId
     * @return RedirectResponse|Response
     */
    public function historyOrdersAction(Request $request, SettingsService $settingsService, ShopCartService $shopCartService, $page, $orderId)
    {
        $pageLimit = 10;

        /** @var User $user */
        $user = $this->getUser();
        $orderStatusSettings = $settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
        $orderId = intval($orderId);

        $orderRepository = $this->getOrderRepository();
        $total = $orderRepository->getCountByUserId($user->getId());
        $paymentStatusNumber = (int) $this->params->get('app.payment_status_number');

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

        if ($this->getIsJsonApi($request)) {
            return $this->json([
                'orders' => $orders,
                'pagesOptions' => $pagesOptions
            ], 200, [], ['groups' => ['details']]);
        }

        return $this->render('profile/history_orders.html.twig', [
            'orders' => $orders,
            'pagesOptions' => $pagesOptions,
            'currentOrderId' => $orderId,
            'receipt' => $receipt,
            'receiptJSON' => json_encode($receipt, JSON_UNESCAPED_UNICODE),
            'receiptOptionName' => $this->params->has('app.receipt_option_name')
                ? $this->params->get('app.receipt_option_name')
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
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function contactsAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();

        $form = $this->createForm(UserProfileType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->dm->flush();
            $this->addFlash('messages', 'profile.contacts_data_saved_successfully');
        }

        return $this->render('profile/contacts.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route(
     *     "/{_locale}/profile/timezone",
     *     name="profile_timezone_localized",
     *     requirements={"_locale": "^[a-z]{2}$"}
     * )
     * @Route("/profile/timezone", name="profile_timezone")
     * @param Request $request
     * @return RedirectResponse|Response
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function userTimeZoneAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();

        $form = $this->createForm(FormTimezoneType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->dm->flush();
            $this->addFlash('messages', 'profile.contacts_data_saved_successfully');
        }

        return $this->render('profile/timezone.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route(
     *     "/{_locale}/token",
     *     name="get_token_localized",
     *     requirements={"_locale": "^[a-z]{2}$"},
     *     condition="request.headers.get('Content-Type') === 'application/json'",
     *     methods={"POST"}
     * )
     * @Route(
     *     "/token",
     *     name="get_token",
     *     requirements={"_locale": "^[a-z]{2}$"},
     *     condition="request.headers.get('Content-Type') === 'application/json'",
     *     methods={"POST"}
     * )
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @return JsonResponse
     * @throws \Doctrine\ODM\MongoDB\MongoDBException
     */
    public function getApiTokenAction(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        if (!$username || !$password) {
            return $this->setError($this->translator->trans('Bad credentials.', [], 'validators'));
        }
        $allowCreateToken = $this->params->has('app.allow_create_token')
            ? $this->params->get('app.allow_create_token')
            : true;

        /** @var User $user */
        $user = $this->getUserRepository()->loadUserByUsername($username);
        if (!$user || !$encoder->isPasswordValid($user, $password)) {
            return $this->setError($this->translator->trans('Bad credentials.', [], 'validators'));
        }
        if (!$user->getApiToken()) {
            if ($allowCreateToken) {
                $user->setApiToken(User::createApiToken());
                $this->dm->flush();
            } else {
                return $this->setError($this->translator->trans('Bad credentials.', [], 'validators'));
            }
        }

        return $this->json([
            'token' => $user->getApiToken()
        ]);
    }

    /**
     * @return UserRepository
     */
    public function getUserRepository()
    {
        return $this->dm->getRepository(User::class);
    }

    /**
     * @return OrderRepository
     */
    public function getOrderRepository()
    {
        return $this->dm->getRepository(Order::class);
    }
}
