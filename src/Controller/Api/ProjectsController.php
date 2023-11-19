<?php

namespace App\Controller\Api;

use App\Entity\Project;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProjectsController extends AbstractController {
    public function __construct(
        private ProjectRepository $projectRepository,
        private AppRepository $appRepository
    ) {
    }

    #[Route('/projects/create', name: 'app_api_projects_create', methods: ["GET", "POST"])]
    public function create(Request $request): JsonResponse {

        $method = $request->getMethod();

        switch ($method) {
            case "GET": {
                    $formBuilder = $this->addAndEditForm();
                    return new JsonResponse($formBuilder->getFormData());
                }
            case "POST": {
                    $data = json_decode($request->getContent());
                    $app = $this->appRepository->findOneById($data->appId);
                    $project = new Project($app, $data->name);
                    $this->projectRepository->save($project);
                    $app->addProject($project);
                    $this->appRepository->save($app);

                    return new JsonResponse($project->getData());
                }
        }
    }

    private function addAndEditForm(?Project $project = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "Project name", FormField::TEXT, ["value" => $project?->getName() ?? ""]);
        return $formBuilder;
    }


    // #[Route('/app/create', name: 'app_api_app_create', methods: ["GET", "POST"])]
    // public function create(Request $request, ValidatorInterface $validator): JsonResponse {
    //     $method = $request->getMethod();

    //     if ($method == "GET") {
    //         $formBuilder = $this->addAndEditForm();
    //         return new JsonResponse($formBuilder->getFormData());
    //     } else if ($method == "POST") {
    //         $data = json_decode($request->getContent());
    //         $user = $this->getUser();
    //         $app = new App();
    //         $app->setName($data->name);
    //         $app->addUser($user);
    //         $app->setAppHeadAdminName("Head Admin");

    //         $ownerRole = new AppRole("Head Admin", $app, $this->sectionPermissionsRepository);
    //         $ownerRole->setIsDestroyable(false);

    //         $this->appRoleRepository->save($ownerRole);

    //         if ($user instanceof User) {
    //             $user->addAppRole($ownerRole);
    //         }

    //         $app->addRole($ownerRole);

    //         $errors = ValidatorHelper::validateObject($app, $validator);

    //         if (count((array) $errors)) {
    //             return new JsonResponse($errors);
    //         }

    //         $this->appRepository->save($app);

    //         return new JsonResponse((object) $app->getData());
    //     }
    // }

    #[Route('/projects', name: 'app_api_projects_overview', methods: ["GET"])]
    public function list(Request $request): JsonResponse {
        $appId = $request->query->get("appId");
        $projects = $this->projectRepository->findBy(["app" => $appId]);
        $projectsData = EntityCollectionUtil::createCollectionData($projects);
        return new JsonResponse($projectsData ?? []);
    }

    #[Route('/projects/{id}', name: 'app_api_projects', methods: ["GET"])]
    public function getData($id): JsonResponse {
        $project = $this->projectRepository->findOneById($id);
        return new JsonResponse($project->getData());
    }

    #[Route('/project/delete/{id}', name: 'app_api_projects_delete', methods: ["GET"])]
    public function delete($id): Response {
        $project = $this->projectRepository->findOneById($id);
        $this->projectRepository->delete($project);
        return new Response($project->getDomain() . " deleted successfully.");
    }
}
