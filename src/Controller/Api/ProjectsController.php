<?php

namespace App\Controller\Api;

use Mpdf\Mpdf;
use App\Entity\App;
use App\Entity\Note;
use App\Entity\User;
use App\Entity\Project;
use Mpdf\MpdfException;
use App\Enums\FormField;
use App\Helpers\DateHelper;
use App\Classes\FormBuilder;
use App\Entity\ProjectState;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Repository\NoteRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\ClientRepository;
use App\Repository\AppRoleRepository;
use App\Repository\ProjectRepository;
use App\Repository\WebsiteRepository;
use Mpdf\PsrHttpMessageShim\Response;
use App\Repository\ProjectStateRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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
        private ProjectStateRepository $projectStateRepository,
        private NoteRepository $noteRepository
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

        $project->setStartDate(DateHelper::convertToDate($data->startDate));
        $project->setEndDate(DateHelper::convertToDate($data->endDate));
        $projectStates = $project->getApp()->getProjectStates();
        if ($projectStates) {
            $project->setProjectState($projectStates->findFirst(fn ($index, ProjectState $state) => $state->getPosition() == 0));
        }

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

    #[Route('/projects/{id}/options', name: 'projects_options', methods: ["GET"])]
    public function getOptionsForm(int $id): JsonResponse {
        $project = $this->projectRepository->findOneById($id);
        /** @var User $user */
        $user = $this->getUser();
        $app = $user->getUserOptions()->getSelectedApp();
        $formBuilder = $this->addAndEditForm($app, $project);
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/projects/{id}', name: 'project_update', methods: ["PUT"])]
    public function update(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($data->appId);

        $project = $this->projectRepository->findOneById($id);

        $client = $this->clientRepository->findOneById($data->client);
        if ($client) $project->setClient($client);

        $website = $this->websiteRepository->findOneById($data->website);
        if ($website) $project->setWebsite($website);

        $project->setName($data->name);
        $project->setStartDate(DateHelper::convertToDate($data->startDate));
        $project->setEndDate(DateHelper::convertToDate($data->endDate));

        $this->projectRepository->save($project);

        $app->addProject($project);
        $this->appRepository->save($app);

        return new JsonResponse($project->getData());
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

    #[Route('/projects/{id}/addNote', name: 'add_project_note', methods: ["POST"])]
    public function addNote(int $id, Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $data = json_decode($request->getContent());

        $project = $this->projectRepository->findOneById($id);

        $note = new Note();
        $note->setText($data->text);
        $note->setProject($project);
        $note->setUser($user);

        $this->noteRepository->save($note);

        return new JsonResponse($note->getData());
    }


    #[Route('/projects/{id}/toPDF', name: 'projects_update_website', methods: ["GET"])]
    public function downloadPDF(int $id, Request $request): JsonResponse {
        $project = $this->projectRepository->findOneById($id);
        $client = $project->getClient();
        $website = $project->getWebsite();
        $tasks = $project->getTasks();

        try {
            $mpdf = new Mpdf([
                "mode" => 'utf-8',
                'format' => 'A4'
            ]);

            $mpdf->SetFont("FreeSans");
            $mpdf->SetStyles("font-family: FreeSans");

            $mpdf->SetHTMLHeader('
            <div style="text-align: right; font-weight: bold;">
                Projects space
            </div>');
            $mpdf->SetHTMLFooter('
            <table width="100%">
                <tr>
                    <td width="33%">{DATE j-m-Y}</td>
                    <td width="33%" align="center">{PAGENO}/{nbpg}</td>
                    <td width="33%" style="text-align: right;">My document</td>
                </tr>
            </table>');

            $mpdf->AddPage();
            $mpdf->setFooter('{PAGENO}');

            foreach ($project->getTasks() as $task) {
                $mpdf->WriteHTML($task->getName());
                $mpdf->WriteHTML($task->getStartDate());
                $mpdf->WriteHTML($task->getEndDate());
            }


            return $mpdf->Output("t", "D");
        } catch (MpdfException $e) {
            dump($e->getMessage());
        }

        return new JsonResponse($project->getData());
    }

    private function addAndEditForm(App $app, ?Project $project = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "Project name", FormField::TEXT, ["value" => $project?->getName() ?? ""]);
        $formBuilder->add("startDate", "Start date", FormField::DATE, ["value" => $project?->getStartDate()?->format("Y-m-d")  ?? ""]);
        $formBuilder->add("endDate", "End date", FormField::DATE, ["value" => $project?->getEndDate()?->format("Y-m-d") ?? ""]);
        $formBuilder->add("client", "Client", FormField::SELECT, ["value" => $project?->getClient()?->getId() ?? "", "options" => EntityCollectionUtil::convertToSelectable($app->getClients(), "name")]);
        $formBuilder->add("website", "Website", FormField::SELECT, ["value" => $project?->getWebsite()?->getId() ?? "", "options" => EntityCollectionUtil::convertToSelectable($app->getWebsites(), "domain")]);

        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
