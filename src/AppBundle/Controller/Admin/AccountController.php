<?php

namespace AppBundle\Controller\Admin;

use AppBundle\Document\User;
use MongoDB\Driver\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class AccountController extends Controller
{
    /**
     * @Route("/login", name="login")
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

}
