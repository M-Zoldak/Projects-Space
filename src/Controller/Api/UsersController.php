<?php

namespace App\Controller\Api;

use App\Entity\User;
use OpenApi\Attributes as OA;
use App\Repository\UserRepository;
use App\Utils\EntityCollectionUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Users')]
#[Route("")]
class UsersController extends AbstractController {
    public function __construct(private UserRepository $userRepository) {
    }

    // #[Route('/users', name: 'app_users', methods: ["GET"])]
    // public function index(): JsonResponse {
    //     return $this->render('users/index.html.twig', [
    //         'controller_name' => 'UsersController',
    //     ]);
    // }

    #[Route('/user/updateSelectedApp', name: 'app_update_user_selected_app', methods: ["POST"])]
    public function updateApp(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $user->getApps()->findFirst(function ($key, $app) use ($data) {
            return $app->getId() == $data->appId;
        });
        $user->getUserOptions()->setSelectedApp($app);
        /** @var User $user */
        $user = $this->userRepository->save($user);

        return new JsonResponse($user->getCurrentUserData($app));
    }


    #[Route('/userData', name: 'get_user_data', methods: ["POST"])]
    public function getUserData(Request $request, #[CurrentUser] ?User $user): JsonResponse {

        $appsData = EntityCollectionUtil::createCollectionData($user->getApps());
        $selectedApp = $user->getUserOptions()->getSelectedApp();
        $userData = $user->getCurrentUserData($selectedApp);

        $data["appData"] = ["apps" => $appsData, "user" => $userData];

        return new JsonResponse($data);
    }
}
