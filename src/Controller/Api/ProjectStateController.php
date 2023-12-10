<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\Task;
use App\Entity\User;
use App\Entity\Project;
use App\Entity\Website;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use App\Entity\ProjectState;
use OpenApi\Attributes as OA;
use App\Entity\WebsiteHosting;
use App\Repository\AppRepository;
use App\Repository\TaskRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\ClientRepository;
use App\Repository\AppRoleRepository;
use App\Repository\WebsiteRepository;
use App\Repository\ProjectStateRepository;
use App\Repository\WebsiteHostingRepository;
use App\Repository\WebsiteOptionsRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'ProjectState')]
#[Route("")]
class ProjectStateController extends AbstractController {
    public function __construct(
        private WebsiteOptionsRepository $websiteOptionsRepository,
        private WebsiteHostingRepository $websiteHostingRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private ClientRepository $clientRepository,
        private ProjectStateRepository $projectStateRepository,
        private TaskRepository $taskRepository
    ) {
    }

    #[Route('/apps/{id}/projectStates/{projectStateId}', name: 'websites_delete_projectState', methods: ["DELETE"])]
    public function delete(string $id, string $projectStateId, Request $request): JsonResponse {
        $app = $this->appRepository->findOneById($id);
        $projectState = $this->projectStateRepository->findOneById($projectStateId);
        $projects = $app->getProjects()->filter(fn (Project $project) => $project->getProjectState()?->getId() == $projectState->getId());
        $projects->forAll(function ($i, Project $project) use ($app) {
            $project->setProjectState(null);
            $project->getTasks()->forAll(function ($i, Task $task) {
                // TODO set task state
                // $task->setTask($app->getProjectStates()?->first() ?? null);
            });
            $this->projectStateRepository->save($project);
        });
        $deletedProjectStateData = $projectState->getData();
        $app->removeProjectState($projectState);

        $this->appRepository->save($app);

        return new JsonResponse($deletedProjectStateData);
    }


    #[Route('/apps/{id}/projectState', name: 'app_add_project-state', methods: ["POST"])]
    public function addHosting(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($id);
        $projectState = new ProjectState($data->name, $app);

        $app->addProjectState($projectState);

        $this->appRepository->save($app);
        return new JsonResponse($projectState->getData());
    }

    #[Route('/apps/{id}/updateProjectStatesPosition', name: 'app_update_project-state_positions', methods: ["PUT"])]
    public function updateProjectStatesPosition(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($id);
        $projectStates = $app->getProjectStates();
        // dd($data);
        foreach ($data as $projectStateObj) {
            $projectState = $projectStates->findFirst(fn ($i, ProjectState &$ps) => $ps->getId() == $projectStateObj->id);
            // dd($projectState);

            $projectState->setPosition($projectStateObj->position);
            $this->projectStateRepository->save($projectState);
        };

        // $app->addProjectState($projectState);

        // $this->appRepository->save($app);
        return new JsonResponse("success");
    }
}
