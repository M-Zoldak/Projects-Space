<?php

namespace App\Controller;

use App\Entity\User;
use OpenApi\Attributes as OA;
use App\Utils\EntityCollectionUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Login')]
#[Route("")]
class ApiLoginController extends AbstractController {
    #[Route('/api/initial_data', name: 'api_initial_data', methods: ["GET"])]
    public function initial_data(#[CurrentUser] ?User $user, Request $request): Response {
        $appsData = EntityCollectionUtil::createCollectionData($user->getApps());
        $selectedApp = $user->getUserOptions()->getSelectedApp();
        $userData = $user->getCurrentUserData($selectedApp);

        return new JsonResponse([
            'apps'  => $appsData,
            "user" => $userData
        ]);
    }
}
