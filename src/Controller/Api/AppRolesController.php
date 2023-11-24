<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\AppRole;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\SectionPermissionsRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AppRolesController extends AbstractController {


    public function __construct(
        private AppRoleRepository $appRoleRepository,
        private AppRepository $appRepository,
        private SectionPermissionsRepository $sectionPermissionsRepository
    ) {
    }

    #[Route('/app-roles/create', name: 'app_api_role_create')]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $this->appRepository->findOneById($data->appId);

        $appRole = new AppRole($data->name, $app, $this->sectionPermissionsRepository);
        $this->appRoleRepository->save($appRole);

        return new JsonResponse($appRole?->getData());
    }

    #[Route('/app-roles/{id}/options', name: 'app_api_role_options', methods: ["GET"])]
    public function index(string $id, #[CurrentUser] ?User $user): JsonResponse {
        $appRole = $this->appRoleRepository->findOneById($id);

        if (empty($appRole)) return new JsonResponse(null, 404);

        return new JsonResponse($appRole->getData());
    }

    #[Route('/app-roles/{id}', name: 'app_api_role_delete', methods: ["DELETE"])]
    public function delete(string $id, #[CurrentUser] ?User $user): JsonResponse {
        $appRole = $this->appRoleRepository->findOneById($id);
        $deletedAppRoleData = $appRole->getData();
        if ($appRole) {
            $this->appRoleRepository->delete($appRole);
        }

        return new JsonResponse($deletedAppRoleData);
    }
}
