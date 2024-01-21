<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\Task;
use App\Entity\User;
use App\Entity\Project;
use App\Enums\FormField;
use App\Helpers\DateHelper;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Tasks')]
#[Route("")]
class TasksController extends AbstractController {
    public function __construct(
        private TaskRepository $taskRepository,
        private ProjectRepository $projectRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private UserRepository $userRepository
    ) {
    }

    #[Route('/projects/{id}/tasks/create', name: 'tasks_create_form', methods: ["GET"])]
    public function addForm(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $formBuilder = $this->addAndEditForm($app);
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/projects/{id}/tasks', name: 'tasks_create', methods: ["POST"])]
    public function create(Project $project, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        $task = new Task();
        $task->setName($data->name);
        $task->setStartDate(DateHelper::convertToDate($data->startDate));
        $task->setEndDate(DateHelper::convertToDate($data->endDate));
        $task->setCategory("task");
        $task->setAssignedTo($this->userRepository->findOneById($data->assignedTo));
        $project->addTask($task);
        $this->projectRepository->save($project);

        return new JsonResponse($task->getData());
    }

    #[Route('/projects/{id}/tasks', name: 'tasks_overview', methods: ["GET"])]
    public function list(Project $project, Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $tasks = $app->getProjects();
        $tasksData = EntityCollectionUtil::createCollectionData($tasks);

        return new JsonResponse($tasksData);
    }

    #[Route('/projects/{id}/tasks/{taskId}', name: 'tasks', methods: ["GET"])]
    public function getData(int $taskId): JsonResponse {
        $task = $this->taskRepository->findOneById($taskId);
        return new JsonResponse($task->getData());
    }

    #[Route('/projects/{id}/tasks/{taskId}', name: 'tasks_delete', methods: ["DELETE"])]
    public function delete(string $taskId, Request $request): JsonResponse {
        $task = $this->taskRepository->findOneById($taskId);
        $taskData = $task->getData();

        $this->taskRepository->delete($task);
        return new JsonResponse($taskData);
    }

    #[Route('/projects/{id}/tasks/{taskId}/updateCheckbox', name: 'task_update_completed', methods: ["PUT"])]
    public function updateCheckbox(string $taskId, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $task = $this->taskRepository->findOneById($taskId);
        $task->setCompleted($data->completed);

        $this->taskRepository->save($task);

        return new JsonResponse($task->getData());
    }

    #[Route('/userTasks', name: 'user_active_tasks', methods: ["GET"])]
    public function userActiveTasks(Request $request, #[CurrentUser] ?User $user): JsonResponse {

        // $apps = $user->getApps();
        // $projects = $apps->map(fn (App $app) => $app->getProjects());

        // $tasks = 
        // $taskData = $task->getData();

        // $this->taskRepository->delete($task);
        return new JsonResponse();
    }

    private function addAndEditForm(App $app, ?Task $task = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "Task name", FormField::TEXT, ["value" => $task?->getName()]);
        $formBuilder->add("assignedTo", "Assigned employee", FormField::SELECT, ["value" => $task?->getAssignedTo()?->getId() ?? "", "options" => EntityCollectionUtil::convertToSelectable($app->getUsers(), "fullName")]);
        $formBuilder->add("startDate", "Start date", FormField::DATE, ["value" => $task?->getStartDate()?->format("Y-m-d")]);
        $formBuilder->add("endDate", "End date", FormField::DATE, ["value" => $task?->getEndDate()?->format("Y-m-d")]);
        $formBuilder->add("description", "Task name", FormField::TEXT, ["value" => $task?->getDescription()]);

        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
