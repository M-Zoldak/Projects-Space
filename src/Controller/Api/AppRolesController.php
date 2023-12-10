<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Entity\AppRole;
use App\Utils\ArrayUtil;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Entity\SectionPermissions;
use App\Repository\AppRoleRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\SectionPermissionsRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'App Roles')]
#[Route("")]
class AppRolesController extends AbstractController {

    public function __construct(
        private AppRoleRepository $appRoleRepository,
        private AppRepository $appRepository,
        private SectionPermissionsRepository $sectionPermissionsRepository
    ) {
    }

    #[Route('/app-roles', name: 'app_roles_create', methods: ["POST"])]
    public function create(Request $request): Response {
        // TODO Make check
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($data->appId);

        if ($this->roleNameExistsInApp($app, $data->name)) {
            return new JsonResponse([
                "name" => "Role name already exists in this projects space"
            ], 422);
        }

        $appRole = new AppRole($data->name, $app, $this->sectionPermissionsRepository);

        $this->appRoleRepository->save($appRole);

        return new JsonResponse($appRole?->getData());
    }

    #[Route('/app-roles/{id}/options', name: 'app_roles_options', methods: ["GET"])]
    public function index(string $id, #[CurrentUser] ?User $user): JsonResponse {
        // TODO Make check
        $appRole = $this->appRoleRepository->findOneById($id);

        if (empty($appRole)) return new JsonResponse(null, 404);

        return new JsonResponse($appRole->getData());
    }

    #[Route('/app-roles/{id}', name: 'role_delete', methods: ["DELETE"])]
    public function delete(string $id, #[CurrentUser] ?User $user): JsonResponse {
        // TODO Make check
        $appRole = $this->appRoleRepository->findOneById($id);
        $app = $appRole->getApp();
        if ($app->getDefaultRole() == $appRole) {
            $app->setDefaultRole($app->getRoles()->toArray()[0]);
        }

        $deletedAppRoleData = $appRole->getData();
        if ($appRole) {
            $this->appRoleRepository->delete($appRole);
        }

        return new JsonResponse($deletedAppRoleData);
    }


    #[Route('/app-roles/{id}', name: 'role_update', methods: ["PUT"])]
    public function update(string $id, #[CurrentUser] ?User $user, Request $request): JsonResponse {
        // TODO Make check
        $data = json_decode($request->getContent());
        $appRole = $this->appRoleRepository->findOneById($id);

        $permissions = $appRole->getSectionPermissions()->toArray();
        array_walk($permissions, function (SectionPermissions $permissions) use ($data) {
            $permissions->setDestroy($data->permissions->{lcfirst($permissions->getSectionName())}->deleteable);
            $permissions->setReview($data->permissions->{lcfirst($permissions->getSectionName())}->hasView);
            $permissions->setEdit($data->permissions->{lcfirst($permissions->getSectionName())}->hasOptions);
            $this->sectionPermissionsRepository->save($permissions);
        });

        return new JsonResponse($appRole->getData());
    }


    #[Route('/app-roles/{id}/updateName', name: 'role_update_name', methods: ["PUT"])]
    public function updateName(string $id, #[CurrentUser] ?User $user, Request $request): JsonResponse {
        // TODO Make check
        // $user->hasAccess()
        $data = json_decode($request->getContent());
        $appRole = $this->appRoleRepository->findOneById($id);

        if ($this->roleNameExistsInApp($appRole->getApp(), $data->name)) {
            return new JsonResponse(["error" => "Role name already exists in this projects space"], 422);
        }

        $appRole->setName($data->name);
        $this->appRoleRepository->save($appRole);
        return new JsonResponse($appRole->getData());
    }

    private function roleNameExistsInApp(App $app, $roleName) {
        return ArrayUtil::array_any($app->getRoles()->toArray(), function (AppRole $role) use ($roleName) {
            return strtolower($role->getName()) == strtolower($roleName);
        });
    }
}
