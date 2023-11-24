<?php

namespace App\Controller;

use App\Entity\User;
use App\Utils\EntityCollectionUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiLoginController extends AbstractController {
    #[Route('/api/login', name: 'api_login')]
    public function index(#[CurrentUser] ?User $user): Response {

        if (null === $user) {
            return $this->json([
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        // $tokenCreator->setUser()
        return new JsonResponse([
            'user'  => $user->getUserIdentifier(),
            'username' => $user->getUserName(),
            "token" => $token
        ]);
    }

    #[Route('/api/initial_data', name: 'api_initial_data')]
    public function initial_data(#[CurrentUser] ?User $user, Request $request): Response {
        $appsData = EntityCollectionUtil::createCollectionData($user->getApps());
        $selectedApp = $user->getUserOptions()->getSelectedApp();
        $userData = $user->getData($selectedApp);

        return new JsonResponse([
            'apps'  => $appsData,
            "user" => $userData
        ]);
    }
}
