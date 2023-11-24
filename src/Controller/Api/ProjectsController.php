<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Project;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ProjectsController extends AbstractController {
    public function __construct(
        private ProjectRepository $projectRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository
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

    #[Route('/projects', name: 'app_api_projects_overview', methods: ["GET"])]
    public function list(Request $request, #[CurrentUser] ?User $user): JsonResponse {

        $app = $user->getUserOptions()->getSelectedApp();
        $projects = $app->getProjects();
        $projectsData = EntityCollectionUtil::createCollectionData($projects);

        return new JsonResponse($projectsData);
    }

    #[Route('/projects/{id}', name: 'app_api_projects', methods: ["GET"])]
    public function getData($id): JsonResponse {
        $project = $this->projectRepository->findOneById($id);
        return new JsonResponse($project->getData());
    }

    #[Route('/projects', name: 'app_api_projects_delete', methods: ["DELETE"])]
    public function delete(Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        $project = $this->projectRepository->findOneById($data->id);
        $projectData = $project->getData();

        $this->projectRepository->delete($project);
        return new JsonResponse($projectData);
    }
}
