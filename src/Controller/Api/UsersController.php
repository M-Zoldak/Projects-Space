<?php

namespace App\Controller\Api;

use stdClass;
use App\Entity\App;
use App\Entity\Task;
use App\Entity\User;
use App\Entity\Project;
use OpenApi\Attributes as OA;
use App\Repository\UserRepository;
use App\Utils\EntityCollectionUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Users')]
#[Route("")]
class UsersController extends AbstractController {
    public function __construct(private UserRepository $userRepository) {
    }

    // #[Route('/users', name: 'app_users', methods: ["GET"])]
    // public function index(): JsonResponse {
    //     return $this->render('users/index.html.twig', [
    //         'controller_name' => 'UsersController',
    //     ]);
    // }

    #[Route('/user/updateSelectedApp', name: 'app_update_user_selected_app', methods: ["POST"])]
    public function updateApp(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $user->getApps()->findFirst(function ($key, $app) use ($data) {
            return $app->getId() == $data->appId;
        });
        $user->getUserOptions()->setSelectedApp($app);
        /** @var User $user */
        $user = $this->userRepository->save($user);

        return new JsonResponse($user->getCurrentUserData($app));
    }


    #[Route('/userData', name: 'get_user_data', methods: ["POST"])]
    public function getUserData(Request $request, #[CurrentUser] ?User $user): JsonResponse {

        $appsData = EntityCollectionUtil::createCollectionData($user->getApps());
        $selectedApp = $user->getUserOptions()->getSelectedApp();
        $userData = $user->getCurrentUserData($selectedApp);

        $data["appData"] = ["apps" => $appsData, "user" => $userData];

        return new JsonResponse($data);
    }


    #[Route('/dashboardData', name: 'user_active_tasks', methods: ["GET"])]
    public function userActiveTasks(Request $request, #[CurrentUser] ?User $user): JsonResponse {

        $statistics = new stdClass;

        $userApps = $user->getApps();
        $appsCount = $userApps->count();

        // $apps =  array_merge_recursive($userApps->map(fn (App $app) => $app->getUsers()->toArray())->toArray());
        // $usersInAppsCount = array_merge_recursive(array_map(function (App $app) {
        //     return $app->getUsers()->toArray();
        // }, $apps));

        $usersAcrossApps = $userApps->getValues();
        $usersAcrossApps = array_map(function (App $app) {
            return $app->getUsers()->toArray();
        }, $usersAcrossApps);
        $usersAcrossApps = array_merge_recursive(...$usersAcrossApps);
        $usernames = [];
        $usersAcrossApps = array_filter($usersAcrossApps, function (User $u) use (&$usernames) {
            if (!in_array($u->getUserIdentifier(), $usernames)) {
                array_push($usernames, $u->getUserIdentifier());
                return true;
            }
            return false;
        });
        $usersAcrossApps = count($usersAcrossApps);

        $userProjects = $userApps->getValues();
        $userProjects = array_map(function (App $app) {
            return $app->getProjects()->toArray();
        }, $userProjects);
        $userProjects = array_merge_recursive(...$userProjects);
        $projectsCount = count($userProjects);

        $userManagedProjects = array_filter($userProjects, function (Project $project) use ($user) {
            return $project->getManager()?->getUserIdentifier() == $user->getUserIdentifier();
        });

        $userTasks = array_map(function (Project $project) {
            return $project->getTasks()->toArray();
        }, $userProjects);
        /** @var Task[] $userTasks */
        $userTasks = array_merge_recursive(...$userTasks);
        $userNotFinishedTasks = array_filter($userTasks, function (Task $task) use ($user) {
            return $task->getAssignedTo()?->getUserIdentifier() == $user->getUserIdentifier() && !$task->isCompleted();
        });
        $tasksCount = count($userTasks);

        $statistics->usersCount = $usersAcrossApps;
        $statistics->appsCount = $appsCount;
        $statistics->projectsCount = $projectsCount;
        $statistics->tasksCount = $tasksCount;

        usort($userTasks, function (Task $t1, Task $t2) {
            return $t1->getEndDate() > $t2->getEndDate() ? 1 : -1;
        });

        $userTasks = array_slice($userNotFinishedTasks, 0, 3);
        $statistics->tasks = array_values(array_map(fn (Task $t1) => $t1->getData(), $userNotFinishedTasks));

        $statistics->projects = array_values(array_map(fn (Project $p1) => $p1->getData(), $userManagedProjects));

        // dd($userProjects->getValues());
        // // $userTasks = $userProjects->map(fn (array $project) => ...$project);
        // dd($userTasks);
        // $apps = $user->getApps();
        // $projects = $apps->map(fn (App $app) => $app->getProjects());

        // $tasks = 
        // $taskData = $task->getData();

        // $this->taskRepository->delete($task);
        return new JsonResponse($statistics);
    }
}
