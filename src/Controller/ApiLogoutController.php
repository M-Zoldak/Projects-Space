<?php

namespace App\Controller;

use App\Entity\User;
use OpenApi\Attributes as OA;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Logout')]
#[Route("")]
class ApiLogoutController extends AbstractController {
    #[Route('/api/logout', name: 'api_logout', methods: ["POST"])]
    public function index(#[CurrentUser] ?User $user, Security $security): Response {

        // $user

        // if (null === $user) {
        //     return $this->json([
        //         'message' => 'missing credentials',
        //     ], Response::HTTP_UNAUTHORIZED);
        // }

        $response = $security->logout(false);

        return new JsonResponse(["logged_out" => true]);

        // $tokenCreator->setUser()
        // return $this->json([
        //     'user'  => $user->getUserIdentifier(),
        //     // 'token' => $token,
        //     'username' => $user->getFullName()
        // ]);
    }
}
