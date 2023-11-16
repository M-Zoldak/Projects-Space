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

        return new JsonResponse([
            "success" => true,
            "apps" => $appsData
        ]);
    }

    #[Route('/app/create', name: 'app_api_app_create', methods: ["GET", "POST"])]
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
            $app->setAppHeadAdminName("Head Admin");

            $ownerRole = new AppRole("Head Admin", $app, $this->sectionPermissionsRepository);
            $ownerRole->setIsDestroyable(false);

            $this->appRoleRepository->save($ownerRole);

            if ($user instanceof User) {
                $user->addAppRole($ownerRole);
            }

            $app->addRole($ownerRole);

            $errors = ValidatorHelper::validateObject($app, $validator);

            if (count((array) $errors)) {
                return new JsonResponse($errors);
            }

            $this->appRepository->save($app);

            return new JsonResponse((object) $app->getData());
        }
    }

    #[Route('/app/edit/{id}', name: 'app_api_app_edit', methods: ["GET", "POST"])]
    public function edit(string $id, Request $request, ValidatorInterface $validator): JsonResponse {
        $method = $request->getMethod();
        if ($method == "GET") {
            $app = $this->appRepository->findOneById($id);
            $formBuilder = $this->addAndEditForm($app);
            return new JsonResponse($formBuilder->getFormData());
        } else if ($method == "POST") {
            $data = (object) json_decode($request->getContent());
            $app = $this->appRepository->findOneById($id);

            $app->setName($data->name);

            $errors = ValidatorHelper::validateObject($app, $validator);

            if (count((array) $errors)) {
                return new JsonResponse($errors);
            }

            $this->appRepository->save($app);

            return new JsonResponse((object) $app);
        }
    }

    #[Route('/app/options/{id}', name: 'app_api_app_options', methods: ["GET", "POST"])]
    public function options(string $id, Request $request, ValidatorInterface $validator): JsonResponse {
        $method = $request->getMethod();
        if ($method == "GET") {
            $app = $this->appRepository->findOneById($id);
            $appUsers = EntityCollectionUtil::createCollectionData($app->getUsers());
            $appRoles = EntityCollectionUtil::createCollectionData($app->getRoles());

            return new JsonResponse(["roles" => $appRoles, "users" => $appUsers]);
        }

        return new JsonResponse([""]);
    }

    #[Route('/app/delete', name: 'app_api_app_delete', methods: ["DELETE"])]
    public function delete(Request $request, ValidatorInterface $validator): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $this->appRepository->findOneById($data->id);
        if (!$app) return new JsonResponse([], 404);

        $roles = $app->getRoles()->toArray();

        array_walk($roles, function ($role) {
            $this->appRoleRepository->delete($role);
        });

        $this->appRepository->delete($app);

        return new JsonResponse();
    }

    private function addAndEditForm(?App $app = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "App name", FormField::TEXT, ["value" => $app?->getName() ?? ""]);
        return $formBuilder;
    }
}
