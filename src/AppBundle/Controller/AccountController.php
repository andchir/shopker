<?php

namespace AppBundle\Controller;

use AppBundle\Document\Order;
use AppBundle\Document\Setting;
use AppBundle\Document\User;

use AppBundle\Form\Type\OrderOptionsType;
use AppBundle\Repository\OrderRepository;
use AppBundle\Repository\UserRepository;
use AppBundle\Service\SettingsService;
use AppBundle\Service\UtilsService;
use MongoDB\Driver\Exception\AuthenticationException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Translation\TranslatorInterface;

use AppBundle\Form\Model\ChangePassword;
use AppBundle\Form\Type\ChangePasswordType;
use AppBundle\Form\Type\RegistrationType;
use AppBundle\Form\Model\Registration;
use AppBundle\Form\Model\ResetPassword;
use AppBundle\Form\Type\ResetPasswordType;
use AppBundle\Form\Type\UserType;

class AccountController extends Controller
{

    /**
     * @Route("/login", name="login")
     * @param Request $request
     * @param AuthenticationUtils $authenticationUtils
     * @return RedirectResponse|Response
     */
    public function loginAction(Request $request, AuthenticationUtils $authenticationUtils)
    {
        /** @var User $user */
        $user = $this->getUser();
        if ($user instanceof AdvancedUserInterface) {
            return $this->redirectToRoute('homepage');
        }

        /** @var AuthenticationException $exception */
        $exception = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $exception ? $exception->getMessage() : null
        ]);
    }

    /**
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

                return $this->redirectToRoute('login');
            }
        }

        return $this->render('security/register.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
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
                    $this->getParameter('app_name') . ' - ' . $translator->trans('password_reset.mail_subject'),
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

            return $this->redirectToRoute('login');
        }

        return new Response('');
    }

    /**
     * @Route("/profile/", name="profile")
     * @return RedirectResponse
     */
    public function profileAction()
    {
        return $this->redirectToRoute('profile_history_orders');
    }

    /**
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

            return $this->redirectToRoute('profile_change_password');
        }

        return $this->render('profile/change_password.html.twig', [
            'form' => $form->createView()
        ]);
    }

    /**
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
        $orderStatusSettings = $settingsService->getSettingsGroup(Setting::GROUP_ORDER_STATUSES);
        $orderId = intval($orderId);

        $orderRepository = $this->getOrderRepository();
        $total = $orderRepository->getCountByUserId($user->getId());
        $paymentStatusNumber = (int) $this->getParameter('payment_status_number');

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
        if (!empty($orderId)) {
            $currentOrder = array_filter($orders->toArray(), function($order) use ($orderId) {
                return $order->getId() === $orderId;
            });
            if (!empty($currentOrder)) {
                /** @var Order $currentOrder */
                $currentOrder = current($currentOrder);
                $currentOrderStatusNumber = $settingsService->getStatusNumber(
                    $currentOrder->getStatus(),
                    $orderStatusSettings
                );
            }
        }

        return $this->render('profile/history_orders.html.twig', [
            'orders' => $orders,
            'pagesOptions' => $pagesOptions,
            'currentOrderId' => $orderId,
            'orderStatusSettings' => $orderStatusSettings,
            'paymentStatusNumber' => $paymentStatusNumber,
            'currentOrderStatusNumber' => $currentOrderStatusNumber,
            'isPaymentAllowed' => $paymentStatusNumber === $currentOrderStatusNumber
        ]);
    }

    /**
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

        $form = $this->createForm(OrderOptionsType::class, $user->getOptions());
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $user->setOptions($form->getData());
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
