<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class RegistrationController extends AbstractController
{
public function __construct(private EmailVerifier $emailVerifier)
{
}

#[Route('/register', name: 'app_register', methods: ['POST'])]
public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): JsonResponse
{
$data = json_decode($request->getContent(), true);

$user = new User();
$form = $this->createForm(RegistrationFormType::class, $user);
$form->submit($data); 

if ($form->isSubmitted() && $form->isValid()) {
    $user->setPassword($passwordHasher->hashPassword($user, $form->get('plainPassword')->getData()));
    $em->persist($user);
    $em->flush();

    return $this->json([
        'message' => 'Registration successful. Please check your email.',
        'status' => 'success'
    ]);
}


return $this->json([
    'message' => 'Registration failed.',
    'status' => 'error',
    
], Response::HTTP_BAD_REQUEST);
}
#[Route('/verify/email', name: 'app_verify_email')]
public function verifyUserEmail(Request $request): Response
{
    $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
    try {
        /** @var User $user */
        $user = $this->getUser();
        $this->emailVerifier->handleEmailConfirmation($request, $user);
    } catch (VerifyEmailExceptionInterface $exception) {
        $this->addFlash('verify_email_error', $exception->getReason());

        return $this->redirectToRoute('app_register');
    }

    // @TODO Change the redirect on success and handle or remove the flash message in your templates
    $this->addFlash('success', 'Your email address has been verified.');

    return $this->redirectToRoute('app_register');
}
}
