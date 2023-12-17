<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Entity\AppRole;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Entity\UserNotification;
use App\Helpers\ValidatorHelper;
use App\Repository\AppRepository;
use App\Repository\UserRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\AppRoleRepository;
use App\Classes\Notifications\AppInvitation;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\SectionPermissionsRepository;
use App\Classes\Notifications\NewAppNotification;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\Internal\TopologicalSort\CycleDetectedException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Apps')]
#[Route("")]
class AppsController extends AbstractController {

    public function __construct(
        private AppRepository $appRepository,
        private UserRepository $userRepository,
        private AppRoleRepository $appRoleRepository,
        private SectionPermissionsRepository $sectionPermissionsRepository
    ) {
    }

    #[Route('/apps', name: 'apps_list', methods: ["GET"])]
    public function index(): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        $apps = $user->getApps();
        $appsInvitations = $user->getAppInvitations();

        $appsData = EntityCollectionUtil::createCollectionData($apps);
        $appsInvitationsData = EntityCollectionUtil::createCollectionData($appsInvitations);

        return new JsonResponse(["apps" => $appsData, "appsInvitations" => $appsInvitationsData]);
    }

    #[Route('/apps/create', name: 'app_create_form', methods: ["GET"])]
    public function form(): JsonResponse {
        $formBuilder = $this->addAndEditForm();
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/apps', name: 'app_create', methods: ["POST"])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse {
        $data = json_decode($request->getContent());
        /** @var User $user */
        $user = $this->getUser();

        $app = new App();
        $app->setName($data->name);
        $app->addUser($user);
        $app->setOwner($user);

        $errors = ValidatorHelper::validateObject($app, $validator);

        if (count((array) $errors)) {
            return new JsonResponse($errors, 422);
        }

        $ownerRole = new AppRole("Owner", $app, $this->sectionPermissionsRepository);
        $ownerRole->setIsDestroyable(false);

        $this->appRoleRepository->save($ownerRole);

        $user->addAppRole($ownerRole);

        $app->addRole($ownerRole);
        $app->setDefaultRole($ownerRole);

        $errors = ValidatorHelper::validateObject($app, $validator);

        if (count((array) $errors)) {
            return new JsonResponse($errors);
        }

        $this->appRepository->save($app);

        return new JsonResponse((object) $app->getData());
    }

    #[Route('/apps/{id}/options', name: 'app_options', methods: ["GET"])]
    public function options(string $id, #[CurrentUser] ?User $user): JsonResponse {
        $app = $this->appRepository->findOneById($id);
        $appUsers = EntityCollectionUtil::createCollectionData($app->getUsers(), [$app]);
        $appInvitedUsers = EntityCollectionUtil::createCollectionData($app->getInvitedUsers());
        $appRoles = EntityCollectionUtil::createCollectionData($app->getRoles());
        $formBuilder = $this->addAndEditForm($app);

        return new JsonResponse([
            "app" => $app->getData($user),
            "roles" => $appRoles,
            "users" => $appUsers,
            "invitedUsers" => $appInvitedUsers ?? [],
            "websitesOptions" => $app->getWebsiteOptions()->getData(),
            "projectStates" =>  EntityCollectionUtil::createCollectionData($app->getProjectStates()),
            "form" => $formBuilder->getFormData(),
        ]);


        return new JsonResponse([""]);
    }

    #[Route('/apps/{id}', name: 'app_delete', methods: ["DELETE"])]
    public function delete(string $id, Request $request): JsonResponse {
        $app = $this->appRepository->findOneById($id);
        if (!$app) return new JsonResponse([], 404);

        // $users = $app->getUsers()->toArray();
        // array_walk($users, fn (User $user) => $user->getUserOptions()->setSelectedApp());
        $deletedAppData = $app->getData();
        try {
            $app->setDefaultRole(null);
            $app->getRoles()->forAll(fn ($roleKey, $role) => $this->appRoleRepository->delete($role));
            $this->appRepository->delete($app);
        } catch (CycleDetectedException $exc) {
            dump($exc->getCycle());
            // dd($exc->getCycle());
        }

        return new JsonResponse($deletedAppData);
    }

    #[Route('/apps/{id}', name: 'app_update', methods: ["PUT"])]
    public function updateApp(string $id, Request $request, ValidatorInterface $validator): JsonResponse {

        $data = (object) json_decode($request->getContent());
        $app = $this->appRepository->findOneById($id);

        $app->setName($data->name);

        $errors = ValidatorHelper::validateObject($app, $validator);

        if (count((array) $errors)) {
            return new JsonResponse($errors, 422);
        }

        $this->appRepository->save($app);

        return new JsonResponse($app->getData());
    }

    #[Route('/apps/{id}/updateDefaultRole', name: 'app_update_default_role', methods: ["PUT"])]
    public function updateAppDefaultRole(string $id, Request $request): JsonResponse {
        $data = (object) json_decode($request->getContent());
        $app = $this->appRepository->findOneById($id);
        $role = $this->appRoleRepository->findOneById($data->defaultRoleId);
        $app->setDefaultRole($role);
        $this->appRepository->save($app);
        return new JsonResponse($app->getData());
    }

    #[Route('/apps/{id}/invite', name: 'app_invite_user', methods: ["POST"])]
    public function inviteToApp(string $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $this->appRepository->findOneById($id);
        $user = $this->userRepository->findOneBy(["email" => $data->userEmail]);

        if (!$user) {
            return new JsonResponse(["message" => "User with this e-mail is not registered. Would you like to invite him into Projects Space?"], 404);
        }

        $user->addAppInvitation($app);
        $this->userRepository->save($user);

        return new JsonResponse(["message" => "Invitation was sent to user.", "user" => $user->getData()]);
    }

    #[Route('/apps/{id}/invite/accept', name: 'app_invitation_confirm', methods: ["POST"])]
    public function acceptInvitationToApp(string $id, #[CurrentUser] ?User $user, Request $request): JsonResponse {
        $app = $this->appRepository->findOneById($id);

        $defaultRole = $app->getDefaultRole();
        $user->addAppRole($defaultRole);
        $app->addUser($user);
        $app->removeInvitedUser($user);
        $this->appRepository->save($app);
        return new JsonResponse($user->getData());
    }

    #[Route('/apps/invite/email', name: 'app_cinvite_email', methods: ["POST"])]
    public function emailInvitation(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $data = json_decode($request->getContent());

        if (strlen($data->userEmail) == 0) return new JsonResponse(["error" => "This field might not be empty"]);

        $emailSent = mail($data->userEmail, "{$user->getFullName()} invites you to Projects Space!", $data->message . "\n\nhttps://$_SERVER[HTTP_HOST]/register");

        if ($emailSent) return new JsonResponse(["message" => "E-mail to $data->userEmail was sent succesfully"]);
        else return new JsonResponse(["message" => "Something went wrong. E-mail could not be sent. Please try again later"], 503);
    }

    #[Route('/apps/{id}/updateUserRole', name: 'app_update_user_role', methods: ["PUT"])]
    public function updateUserRole(string $id, Request $request): JsonResponse {
        $data = (object) json_decode($request->getContent());
        $app = $this->appRepository->findOneById($id);
        $user = $this->userRepository->findOneById($data->userId);
        $appRole = $this->appRoleRepository->findOneById($data->appRoleId);
        $currentAppRole = $user->getAppRoles()->findFirst(fn ($i, AppRole $appRole) => $appRole->getApp()->getId() == $app->getId());

        $user->removeAppRole($currentAppRole);
        $user->addAppRole($appRole);

        $this->userRepository->save($user);

        return new JsonResponse($user->getData($app));
    }

    #[Route('/apps/{appId}/user/{userId}', name: 'app_revoku_user_invitation', methods: ["DELETE"])]
    public function revokeInvitationToApp(string $appId, string $userId, Request $request): JsonResponse {
        $app = $this->appRepository->findOneById($appId);
        $user = $this->userRepository->findOneById($userId);

        if ($app->hasUser($user)) {
            $user->removeApp($app);
        } else {
            $user->removeAppInvitation($app);
        }

        $this->appRepository->save($app);

        return new JsonResponse($user->getData());
    }

    private function addAndEditForm(App $app = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "App name", FormField::TEXT, ["value" => $app?->getName() ?? ""]);
        return $formBuilder;
    }
}
