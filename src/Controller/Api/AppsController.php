<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use App\Helpers\ValidatorHelper;
use App\Repository\AppRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AppsController extends AbstractController {

    private User $user;

    public function __construct(
        private AppRepository $appRepository,
        private UserRepository $userRepository,
    ) {
    }

    #[Route('/api/apps', name: 'app_api_apps', methods: ["GET"])]
    public function index(): JsonResponse {
        $this->user = $this->getUser();
        $apps = $this->user->getApps()->toArray();

        $appsData = array_map(function ($app) {
            return $app->getData();
        }, $apps);

        return new JsonResponse([
            "success" => true,
            "apps" => $appsData
        ]);
    }

    #[Route('/api/app/create', name: 'app_api_app_create', methods: ["GET", "POST"])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse {
        $method = $request->getMethod();


        if ($method == "GET") {
            $formBuilder = $this->_createForm();
            return new JsonResponse($formBuilder->getFormData());
        } else if ($method == "POST") {
            $data = json_decode($request->getContent());
            $user = $this->getUser();
            $app = new App();
            $app->setName($data->name);
            $app->addUser($user);

            $errors = ValidatorHelper::validateObject($app, $validator);

            if (count((array) $errors)) {
                return new JsonResponse($errors);
            }

            $this->appRepository->save($app);

            return new JsonResponse((object) $app);
        }
    }

    #[Route('/api/app/edit/{id}', name: 'app_api_app_edit', methods: ["GET", "POST"])]
    public function edit(string $id, Request $request, ValidatorInterface $validator): JsonResponse {
        $method = $request->getMethod();
        if ($method == "GET") {
            $app = $this->appRepository->findOneById($id);
            $formBuilder = $this->_createForm($app);
            return new JsonResponse($formBuilder->getFormData());
        } else if ($method == "POST") {
            $data = json_decode($request->getContent());
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

    private function _createForm(?App $app = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "App name", FormField::TEXT, ["value" => $app?->getName() ?? ""]);
        return $formBuilder;
    }
}
