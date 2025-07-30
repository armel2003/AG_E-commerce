<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Psr\Log\LoggerInterface; 

#[Route('/user')]
class UserApiController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $passwordHasher,
        private LoggerInterface $logger
    ) {
    }
//all users
    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)->findAll();
        return $this->json($users, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }
// Specific user by ID
    #[Route('/{id}', methods: ['GET'])]
    public function show(User $user): JsonResponse
    {
        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'user:read']);
    }
// Create a new user
    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $data['password'])
        );
        $user->setfirstname($data['firstname']);
        $user->setlastname($data['lastname']);
        $user->setAdress($data['adress']);
        $user->setCity($data['city']);
        $user->setZipcode($data['zipcode']);
        $user->setCountry($data['country']);


        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json($user, Response::HTTP_CREATED, [], ['groups' => 'user:read']);
    }
// Update an existing user
    #[Route('/update/{id}', methods: ['PATCH'])]
    public function update(Request $request, User $user): JsonResponse
    {

        
/** @var User $currentUser */
        $currentUser = $this->getUser();
        if (!$currentUser) {
            $this->logger->error('User not authenticated'); // Log d'erreur si l'utilisateur n'est pas authentifié
            return $this->json(
                ['error' => 'Vous devez être connecté pour effectuer cette action.'],
                Response::HTTP_UNAUTHORIZED
            );
        }
        $this->logger->info('Test getUser: ', ['user' => $currentUser]);

if (!$currentUser) {
    $this->logger->error('User not authenticated - getUser returned null');

    return $this->json(
        ['error' => 'Vous devez être connecté pour effectuer cette action.'],
        Response::HTTP_UNAUTHORIZED
    );
}
        $this->logger->info('Current user ID: ' . $currentUser->getId());

        // Vérifie si l'utilisateur est soit admin soit le propriétaire du compte
        if (!$this->isGranted('ROLE_ADMIN') && $currentUser->getId() !== $user->getId()) {
            throw $this->createAccessDeniedException('Vous n\'avez pas les droits pour modifier ce compte.');
        }

        $data = json_decode($request->getContent(), true);


        // Seul l'admin peut modifier certains champs sensibles
        if ($this->isGranted('ROLE_ADMIN')) {
            if (isset($data['roles'])) {
                $user->setRoles($data['roles']);
            }
            if (isset($data['isVerified'])) {
                $user->setIsVerified($data['isVerified']);
            }
            if (isset($data['fidelity_balance'])) {
                $user->setFidelityBalance($data['fidelity_balance']);
            }
            if (isset($data['balance'])) {
                $user->setBalance($data['balance']);
            }
        }

        // Champs modifiables par l'utilisateur ou l'admin
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $data['password'])
            );
        }
        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }
        if (isset($data['adress'])) {
            $user->setAdress($data['adress']);
        }
        if (isset($data['zipcode'])) {
            $user->setZipcode($data['zipcode']);
        }
        if (isset($data['city'])) {
            $user->setCity($data['city']);
        }
        if (isset($data['country'])) {
            $user->setCountry($data['country']);
        }

        try {
            $this->entityManager->flush();
            return $this->json($user, Response::HTTP_OK, [], ['groups' => 'user:read']);
        } catch (\Exception $e) {
            return $this->json(
                ['error' => 'Une erreur est survenue lors de la modification du compte.'],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
// Delete a user
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(User $user): JsonResponse
    {
        
         /** @var User $currentUser */
        $currentUser = $this->getUser();

        // Vérifie si l'utilisateur est soit admin soit le propriétaire du compte
        if (!$this->isGranted('ROLE_ADMIN') && $currentUser->getId() !== $user->getId()) {
            throw $this->createAccessDeniedException('Vous n\'avez pas les droits pour supprimer ce compte.');
        }

        // Empêche un utilisateur non-admin de supprimer un compte admin
        if (!$this->isGranted('ROLE_ADMIN') && in_array('ROLE_ADMIN', $user->getRoles())) {
            throw $this->createAccessDeniedException('Vous ne pouvez pas supprimer un compte administrateur.');
        }

        try {
            $this->entityManager->remove($user);
            $this->entityManager->flush();

            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return $this->json(
                ['error' => 'Une erreur est survenue lors de la suppression du compte.'],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
