<?php

namespace App\Controller\Api;

use DateTime;
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

        if (empty($data->name)) {
            return new JsonResponse((object)["name" => "Name field may not be empty"], 422);
        }

        $task->setName($data->name);
        $task->setStartDate(DateHelper::convertToDate($data->startDate));
        $task->setEndDate(DateHelper::convertToDate($data->endDate));
        $task->setCategory("task");
        $task->setAssignedTo($this->userRepository->findOneById($data->assignedTo));
        $project->addTask($task);
        $this->projectRepository->save($project);

        return new JsonResponse($task->getData());
    }


    #[Route('/projects/{id}/tasks/{taskId}/options', name: 'task_options', methods: ["GET"])]
    public function options(Project $project, int $taskId, Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $task = $this->taskRepository->findOneById($taskId);
        $formBuilder = $this->addAndEditForm($app, $task);
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/projects/{id}/tasks', name: 'tasks_overview', methods: ["GET"])]
    public function list(Project $project, Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $tasks = $app->getProjects();
        $tasksData = EntityCollectionUtil::createCollectionData($tasks);

        return new JsonResponse($tasksData);
    }

    #[Route('/projects/{id}/tasks/{taskId}', name: 'task_update', methods: ["PUT"])]
    public function update(int $id, int $taskId, Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        // dd($taskId);
        $task = $this->taskRepository->findOneById($taskId);

        if (empty($data->name)) {
            return new JsonResponse((object)["name" => "Name field may not be empty"], 422);
        }

        $task->setName($data->name);
        $task->setStartDate(DateHelper::convertToDate($data->startDate));
        $task->setEndDate(DateHelper::convertToDate($data->endDate));
        $task->setCategory("task");
        $task->setAssignedTo($this->userRepository->findOneById($data->assignedTo));
        // $project->addTask($task);
        $this->taskRepository->save($task);

        return new JsonResponse($task->getData());
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

    private function addAndEditForm(App $app, ?Task $task = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "Task name", FormField::TEXT, ["value" => $task?->getName()]);
        $formBuilder->add("description", "Description", FormField::TEXT, ["value" => $task?->getDescription()]);
        $formBuilder->add("assignedTo", "Laborer", FormField::SELECT, ["value" => $task?->getAssignedTo()?->getId() ?? "", "options" => EntityCollectionUtil::convertToSelectable($app->getUsers(), "fullName")]);
        $formBuilder->add("startDate", "Start date", FormField::DATE, ["value" => $task?->getStartDate()?->format("Y-m-d") ?? (new DateTime())->format("Y-m-d")]);
        $formBuilder->add("endDate", "End date", FormField::DATE, ["value" => $task?->getEndDate()?->format("Y-m-d") ?? (new DateTime())->modify("+1 month")->format("Y-m-d")]);

        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
