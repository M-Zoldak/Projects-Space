<?php

namespace App\Controller;

use DateTime;
use App\Entity\User;
use App\Form\UserType;
use Doctrine\ORM\EntityManager;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class RegistrationController extends AbstractController {
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository
    ) {
    }

    #[Route('/api/user/create', name: 'app_api_create_user', methods: ["POST"])]
    public function createUser(Request $request) {
        $data = json_decode($request->getContent());

        if ($data->password !== $data->verifyPassword) {
            return new JsonResponse(["verifyPassword" => "Passwords are not the same."]);
        }

        $birthDate = new DateTime($data->birthDate);
        $birthDate->setTime(00, 00, 00);

        $user = new User();

        $user->setFirstName($data->firstName);
        $user->setLastName($data->firstName);
        $user->setBirthDate($birthDate);

        $user->setEmail($data->email);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data->password));

        dd($user);
        $this->userRepository->save($user);

        return new JsonResponse(["success" => true, $user]);
    }
}
