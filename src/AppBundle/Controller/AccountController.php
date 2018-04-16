<?php

namespace AppBundle\Controller;

use AppBundle\Document\User;
use AppBundle\Repository\UserRepository;
use MongoDB\Driver\Exception\AuthenticationException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Form\Type\RegistrationType;
use AppBundle\Form\Model\Registration;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Translation\TranslatorInterface;

class AccountController extends Controller
{

    /**
     * @Route("/login", name="login")
     * @param Request $request
     * @return Response
     */
    public function loginAction(Request $request)
    {
        $user = $this->getUser();
        if ($user instanceof AdvancedUserInterface) {
            return $this->redirectToRoute('homepage');
        }

        /** @var AuthenticationException $exception */
        $exception = $this->get('security.authentication_utils')
            ->getLastAuthenticationError();

        return $this->render('security/login.html.twig', [
            'last_username' => '',
            'error' => $exception ? $exception->getMessage() : null
        ]);
    }

    /**
     * @Route("/register", name="register")
     * @return Response
     */
    public function registerAction(Request $request, UserPasswordEncoderInterface $encoder, TranslatorInterface $translator)
    {
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

                return $this->redirectToRoute('homepage');
            }
        }

        return $this->render('security/register.html.twig', [
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

}
