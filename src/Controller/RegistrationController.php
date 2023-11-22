<?php

namespace App\Controller;

use Error;
use App\Entity\User;
use DateTimeImmutable;
use App\Enums\FormField;
use PasswordRequirements;
use App\Classes\FormBuilder;
use App\Helpers\ValidatorHelper;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController {
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository
    ) {
    }

    #[Route('/api/register', name: 'app_api_create_user', methods: ["POST", "GET"])]
    public function createUser(Request $request, ValidatorInterface $validator) {

        $request->getMethod();

        switch ($request->getMethod()) {
            case "GET": {
                    $formBuilder = new FormBuilder();
                    $formBuilder->add("firstName", "First name", FormField::TEXT);
                    $formBuilder->add("lastName", "Last name", FormField::TEXT);
                    $formBuilder->add("birthDate", "Date of birth", FormField::DATE);
                    $formBuilder->add("email", "E-mail", FormField::TEXT);
                    $formBuilder->add("password", "Password", FormField::TEXT, ["type" => "password"]);
                    $formBuilder->add("verifyPassword", "Verify Password", FormField::TEXT, ["type" => "password"]);
                    return new JsonResponse($formBuilder->getFormData());
                }
            case "POST": {
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

                    return new JsonResponse($user->getData());
                }
        }
    }
}
