<?php

namespace App\Controller\Api;

use App\Entity\AppRole;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\SectionPermissionsRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AppRolesController extends AbstractController {


    public function __construct(
        private AppRoleRepository $appRoleRepository,
        private AppRepository $appRepository,
        private SectionPermissionsRepository $sectionPermissionsRepository
    ) {
    }

    #[Route('/app_role/add', name: 'app_api_role_add')]
    public function add(Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $this->appRepository->findOneById($data->appId);

        $appRole = new AppRole($data->name, $app, $this->sectionPermissionsRepository);
        $this->appRoleRepository->save($appRole);

        return new JsonResponse([
            "success" => true,
            "app_role" => $appRole?->getData()
        ]);
    }

    #[Route('/app_role/options/{id}', name: 'app_api_role_options')]
    public function index(string $id): JsonResponse {
        $appRole = $this->appRoleRepository->findOneById($id);

        if (empty($appRole)) return new JsonResponse(null, 404);

        return new JsonResponse([
            "success" => true,
            "id" => $appRole->getId(),
            "name" => $appRole->getName(),
            "app_role" => $appRole->getData(),
        ]);
    }
}
