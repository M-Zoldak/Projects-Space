<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Project;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Projects')]
#[Route("")]
class ProjectsController extends AbstractController {
    public function __construct(
        private ProjectRepository $projectRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository
    ) {
    }

    #[Route('/projects/create', name: 'projects_create', methods: ["GET"])]
    public function addForm(Request $request): JsonResponse {
        $formBuilder = $this->addAndEditForm();
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/projects', name: 'projects_create', methods: ["POST"])]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($data->appId);
        $project = new Project($app, $data->name);
        $this->projectRepository->save($project);
        $app->addProject($project);
        $this->appRepository->save($app);

        return new JsonResponse($project->getData());
    }

    #[Route('/projects', name: 'projects_overview', methods: ["GET"])]
    public function list(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $projects = $app->getProjects();
        $projectsData = EntityCollectionUtil::createCollectionData($projects);

        return new JsonResponse($projectsData);
    }

    #[Route('/projects/{id}', name: 'projects', methods: ["GET"])]
    public function getData($id): JsonResponse {
        $project = $this->projectRepository->findOneById($id);
        return new JsonResponse($project->getData());
    }

    #[Route('/projects/{id}', name: 'projects_delete', methods: ["DELETE"])]
    public function delete(string $id, Request $request): JsonResponse {
        $project = $this->projectRepository->findOneById($id);
        $projectData = $project->getData();

        $this->projectRepository->delete($project);
        return new JsonResponse($projectData);
    }

    private function addAndEditForm(?Project $project = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "Project name", FormField::TEXT, ["value" => $project?->getName() ?? ""]);
        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
