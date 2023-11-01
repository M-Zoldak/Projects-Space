<?php

namespace App\Controller;

use Error;
use App\Entity\User;
use DateTimeImmutable;
use PasswordRequirements;
use Doctrine\ORM\EntityManager;
use App\Helpers\ValidatorHelper;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Constraints\EmailValidator;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
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
    public function createUser(Request $request, ValidatorInterface $validator) {
        $data = json_decode($request->getContent());

        $user = new User();

        $user->setFirstName($data->firstName);
        $user->setLastName($data->lastName);

        $birthDate = new DateTimeImmutable($data->birthDate);
        $birthDate->setTime(00, 00, 00);
        $user->setBirthDate($birthDate);

        $user->setEmail($data->email);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data->password));

        $errors = ValidatorHelper::validateObject($user, $validator);

        $passwordValidation = $validator->validate(
            $data->password,
            new PasswordRequirements()
        );

        if (count($passwordValidation)) {
            $errors->password = $passwordValidation[0]->getMessage();
        }

        if ($data->password !== $data->verifyPassword) {
            $errors->verifyPassword = "Passwords are not the same";
        }
        if (count((array) $errors)) return new JsonResponse($errors, 422);

        $this->userRepository->save($user);

        return new JsonResponse((object) [
            "user_data" => (object)["username" => $user->getUserName()],
            "newToken" => "token"
        ]);
    }
}
