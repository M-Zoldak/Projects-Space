<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Entity\Project;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\ClientRepository;
use App\Repository\AppRoleRepository;
use App\Repository\ProjectRepository;
use App\Repository\WebsiteRepository;
use App\Repository\ProjectStateRepository;
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
        private AppRoleRepository $appRoleRepository,
        private ClientRepository $clientRepository,
        private WebsiteRepository $websiteRepository,
        private ProjectStateRepository $projectStateRepository
    ) {
    }

    #[Route('/projects/create', name: 'projects_create_form', methods: ["GET"])]
    public function addForm(Request $request): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        $app = $user->getUserOptions()->getSelectedApp();
        $formBuilder = $this->addAndEditForm($app);
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/projects', name: 'projects_create', methods: ["POST"])]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($data->appId);

        $project = new Project($app, $data->name);

        $client = $this->clientRepository->findOneById($data->client);
        if ($client) $project->setClient($client);

        $website = $this->websiteRepository->findOneById($data->website);
        if ($website) $project->setWebsite($website);

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
        /** @var User $user */
        $user = $this->getUser();
        $app = $user->getUserOptions()->getSelectedApp();
        $project = $this->projectRepository->findOneById($id);
        return new JsonResponse(
            [
                "project" => $project->getData(),
                "clientsSelect" => EntityCollectionUtil::convertToSelectable($app->getClients(), "name"),
                "websitesSelect" => EntityCollectionUtil::convertToSelectable($app->getWebsites(), "domain")
            ]
        );
    }

    #[Route('/projects/{id}', name: 'projects_delete', methods: ["DELETE"])]
    public function delete(int $id, Request $request): JsonResponse {
        $project = $this->projectRepository->findOneById($id);
        $projectData = $project->getData();

        $this->projectRepository->delete($project);
        return new JsonResponse($projectData);
    }

    #[Route('/projects/{id}/updateClient', name: 'projects_update_client', methods: ["PUT"])]
    public function updateClient(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $project = $this->projectRepository->findOneById($id);
        $client = $this->clientRepository->findOneById($data->clientId);
        $project->setClient($client);
        $this->projectRepository->save($project);

        return new JsonResponse($project->getData());
    }

    #[Route('/projects/{id}/updateWebsite', name: 'projects_update_website', methods: ["PUT"])]
    public function updateWebsite(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $project = $this->projectRepository->findOneById($id);
        $website = $this->websiteRepository->findOneById($data->websiteId);
        $project->setWebsite($website);
        $this->projectRepository->save($project);

        return new JsonResponse($project->getData());
    }

    #[Route('/projects/{id}/updateState/{stateId}', name: 'update_project_state', methods: ["PUT"])]
    public function updateProjectState(int $id, int $stateId, Request $request): JsonResponse {
        $newState = $this->projectStateRepository->findOneById($stateId);
        $project = $this->projectRepository->findOneById($id);
        $project->setProjectState($newState);

        $this->projectRepository->save($project);

        return new JsonResponse($project->getData());
    }

    private function addAndEditForm(App $app, ?Project $project = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "Project name", FormField::TEXT, ["value" => $project?->getName() ?? ""]);
        $formBuilder->add("client", "Client", FormField::SELECT, ["value" => $project?->getClient()?->getId() ?? "", "options" => EntityCollectionUtil::convertToSelectable($app->getClients(), "name")]);
        $formBuilder->add("website", "Website", FormField::SELECT, ["value" => $project?->getWebsite()?->getId() ?? "", "options" => EntityCollectionUtil::convertToSelectable($app->getWebsites(), "domain")]);

        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
