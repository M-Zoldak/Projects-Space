<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Entity\AppRole;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use App\Helpers\ValidatorHelper;
use App\Repository\AppRepository;
use App\Repository\UserRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\SectionPermissionsRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class AppsController extends AbstractController {

    private User $user;

    public function __construct(
        private AppRepository $appRepository,
        private UserRepository $userRepository,
        private AppRoleRepository $appRoleRepository,
        private SectionPermissionsRepository $sectionPermissionsRepository
    ) {
    }

    #[Route('/apps', name: 'app_api_apps', methods: ["GET"])]
    public function index(): JsonResponse {
        $this->user = $this->getUser();
        $apps = $this->user->getApps();

        $appsData = EntityCollectionUtil::createCollectionData($apps);

        return new JsonResponse($appsData);
    }

    #[Route('/apps/create', name: 'app_api_app_create', methods: ["GET", "POST"])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse {
        $method = $request->getMethod();

        if ($method == "GET") {
            $formBuilder = $this->addAndEditForm();
            return new JsonResponse($formBuilder->getFormData());
        } else if ($method == "POST") {
            $data = json_decode($request->getContent());
            $user = $this->getUser();

            $app = new App();
            $app->setName($data->name);
            $app->addUser($user);
            $app->setAppHeadAdminName("Owner");

            $ownerRole = new AppRole("Owner", $app, $this->sectionPermissionsRepository);
            $ownerRole->setIsDestroyable(false);

            $this->appRoleRepository->save($ownerRole);

            if ($user instanceof User) {
                $user->addAppRole($ownerRole);
            }

            $app->addRole($ownerRole);
            $app->setDefaultRole($ownerRole);

            $errors = ValidatorHelper::validateObject($app, $validator);

            if (count((array) $errors)) {
                return new JsonResponse($errors);
            }

            $this->appRepository->save($app);

            return new JsonResponse((object) $app->getData());
        }
    }

    #[Route('/apps/{id}/options', name: 'app_api_app_options', methods: ["GET", "POST"])]
    public function options(string $id, Request $request): JsonResponse {
        $method = $request->getMethod();

        if ($method == "GET") {
            $app = $this->appRepository->findOneById($id);
            $appUsers = EntityCollectionUtil::createCollectionData($app->getUsers(), [$app]);
            $appRoles = EntityCollectionUtil::createCollectionData($app->getRoles());
            $formBuilder = $this->addAndEditForm($app);
            return new JsonResponse([
                "app" => $app->getData(),
                "roles" => $appRoles,
                "users" => $appUsers,
                "form" => $formBuilder->getFormData()
            ]);
        }

        return new JsonResponse([""]);
    }

    #[Route('/apps/{id}', name: 'app_api_app_delete', methods: ["DELETE"])]
    public function delete(string $id, Request $request): JsonResponse {
        $app = $this->appRepository->findOneById($id);
        if (!$app) return new JsonResponse([], 404);

        $users = $app->getUsers()->toArray();
        array_walk($users, fn (User $user) => $user->getUserOptions()->setSelectedApp());
        $deletedAppData = $app->getData();
        $this->appRepository->delete($app);

        return new JsonResponse($deletedAppData);
    }

    private function addAndEditForm(?App $app = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "App name", FormField::TEXT, ["value" => $app?->getName() ?? ""]);
        return $formBuilder;
    }

    #[Route('/apps/{id}/update', name: 'app_api_app_update', methods: ["PUT"])]
    public function updateApp(string $id, Request $request, ValidatorInterface $validator): JsonResponse {

        $data = (object) json_decode($request->getContent());
        $app = $this->appRepository->findOneById($id);

        $app->setName($data->name);

        $errors = ValidatorHelper::validateObject($app, $validator);

        if (count((array) $errors)) {
            return new JsonResponse($errors, 422);
        }

        $this->appRepository->save($app);

        return new JsonResponse($app->getData());
    }

    #[Route('/apps/{id}/updateDefaultRole', name: 'app_api_app_update_default_role', methods: ["PUT"])]
    public function updateAppDefaultRole(string $id, Request $request): JsonResponse {
        $data = (object) json_decode($request->getContent());
        $app = $this->appRepository->findOneById($id);
        $role = $this->appRoleRepository->findOneById($data->defaultRoleId);
        $app->setDefaultRole($role);
        $this->appRepository->save($app);
        return new JsonResponse($app->getData());
    }
}
