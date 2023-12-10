<?php

namespace App\Controller\Api;

use DateHelper;
use App\Entity\User;
use DateTimeImmutable;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Helpers\ValidatorHelper;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[OA\Tag(name: 'Profile')]
#[Route("")]
class ProfileController extends AbstractController {

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository
    ) {
    }


    #[Route('/profile/create', name: 'app_profile_form', methods: ["GET"])]
    public function index(#[CurrentUser] ?User $user): Response {

        $formBuilder = new FormBuilder();
        $formBuilder->add("firstName", "First name", FormField::TEXT, ["required" => true, "value" => $user->getFirstName()]);
        $formBuilder->add("lastName", "Last name", FormField::TEXT, ["required" => true, "value" => $user->getLastName()]);
        $formBuilder->add("birthDate", "Date of birth", FormField::DATE, ["required" => true, "value" => $user->getBirthDate()->format("d-M-y")]);
        // $formBuilder->add("email", "E-mail", FormField::TEXT, ["required" => true, $user->getEmail(), "readonly" => true]);

        return new JsonResponse($formBuilder->getFormData());

        return new JsonResponse();
    }


    #[Route('/profile', name: 'app_profile_update', methods: ["POST"])]
    public function update(Request $request, #[CurrentUser] ?User $user, ValidatorInterface $validator): Response {
        $data = json_decode($request->getContent());

        $user->setFirstName($data->firstName);
        $user->setLastName($data->lastName);

        $user->setBirthDate(DateHelper::convertToDate($data->birthDate));

        $errors = ValidatorHelper::validateObject($user, $validator);

        if (count((array) $errors)) {
            return new JsonResponse($errors, 422);
        }

        $this->userRepository->save($user);

        return new JsonResponse(["message" => "Your personal data was updated."]);
    }
}
