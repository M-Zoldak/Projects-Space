<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use Doctrine\ORM\EntityManager;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
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

    /**
     * @Route("/createUser", name="registration")
     */
    public function createUser(Request $request) {
        // $user = new User();

        // // Encode the new users password
        // $user->setPassword($this->passwordHasher->hashPassword($user, $user->getPassword()));

        // $this->userRepository->save($user);

        return new JsonResponse(["success" => true]);
        // return $this->render('registration/index.html.twig', [
        //     'form' => $form->createView(),
        // ]);
    }
}
