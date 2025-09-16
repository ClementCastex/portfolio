<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class RegistrationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private JWTTokenManagerInterface $jwtManager
    ) {
    }

    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if ($data === null) {
                return new JsonResponse(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
            }

            // Vérifier que tous les champs requis sont présents
            $requiredFields = ['email', 'password', 'firstName', 'lastName'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return new JsonResponse(
                        ['error' => sprintf('Missing required field: %s', $field)],
                        Response::HTTP_BAD_REQUEST
                    );
                }
            }

            // Vérifier si l'email existe déjà
            $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($existingUser) {
                return new JsonResponse(
                    ['error' => 'This email is already used'],
                    Response::HTTP_CONFLICT
                );
            }

            $user = new User();
            $user->setEmail($data['email']);
            $user->setFirstName($data['firstName']);
            $user->setLastName($data['lastName']);
            $user->setRoles(['ROLE_USER']);

            // Hashage du mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $data['password']
            );
            $user->setPassword($hashedPassword);

            // Valider l'entité
            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Générer le token JWT
            $token = $this->jwtManager->create($user);

            return new JsonResponse(
                [
                    'token' => $token,
                    'user' => [
                        'id' => $user->getId(),
                        'email' => $user->getEmail(),
                        'firstName' => $user->getFirstName(),
                        'lastName' => $user->getLastName(),
                        'roles' => $user->getRoles()
                    ]
                ],
                Response::HTTP_CREATED
            );

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Registration failed: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
} 