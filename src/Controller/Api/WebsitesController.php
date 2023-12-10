<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Entity\Website;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Entity\WebsiteHosting;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\ClientRepository;
use App\Repository\AppRoleRepository;
use App\Repository\WebsiteRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Websites')]
#[Route("")]
class WebsitesController extends AbstractController {
    public function __construct(
        private WebsiteRepository $websiteRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private ClientRepository $clientRepository
    ) {
    }

    #[Route('/websites/create', name: 'websites_create_form', methods: ["GET"])]
    public function addForm(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $formBuilder = $this->addAndEditForm($app);
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/websites', name: 'websites_create', methods: ["POST"])]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $this->appRepository->findOneById($data->appId);
        $client = $this->clientRepository->findOneById($data->client);
        $websiteHosting = $app->getWebsiteOptions()->getHostings()->findFirst(fn (int $index, WebsiteHosting $h) => $h->getId() == $data->hosting);

        $website = new Website();
        $website->setHosting($websiteHosting);
        $website->setDomain($data->domain);
        $website->setClient($client);

        $app->addWebsite($website);
        $this->appRepository->save($app);

        return new JsonResponse($website->getData());
    }

    #[Route('/websites', name: 'websites_overview', methods: ["GET"])]
    public function list(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $websites = $app->getWebsites();
        $websitesData = EntityCollectionUtil::createCollectionData($websites);

        return new JsonResponse($websitesData);
    }

    #[Route('/websites/{id}', name: 'websites', methods: ["GET"])]
    public function getData($id): JsonResponse {
        $website = $this->websiteRepository->findOneById($id);
        return new JsonResponse($website->getData());
    }


    #[Route('/websites/{id}/options', name: 'websites_options_form', methods: ["GET"])]
    public function edit(int $id): JsonResponse {
        $website = $this->websiteRepository->findOneById($id);
        $formBuilder = $this->addAndEditForm($website->getApp(), $website);
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/websites/{id}', name: 'websites_update', methods: ["PUT"])]
    public function update(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        $app = $this->appRepository->findOneById($data->appId);
        $client = $this->clientRepository->findOneById($data->client);
        $websiteHosting = $app->getWebsiteOptions()->getHostings()->findFirst(fn (int $index, WebsiteHosting $h) => $h->getId() == $data->hosting);

        $website = $this->websiteRepository->findOneById($id);

        $website->setHosting($websiteHosting);
        $website->setDomain($data->domain);
        $website->setClient($client);

        $this->websiteRepository->save($website);

        return new JsonResponse($website->getData());
    }

    #[Route('/websites/{id}', name: 'websites_delete', methods: ["DELETE"])]
    public function delete(string $id, Request $request): JsonResponse {
        $website = $this->websiteRepository->findOneById($id);
        $websiteData = $website->getData();

        $this->websiteRepository->delete($website);
        return new JsonResponse($websiteData);
    }

    private function addAndEditForm(App $app, ?Website $website = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("domain", "Domain", FormField::TEXT, ["value" => $website?->getDomain() ?? ""]);
        $formBuilder->add("client", "Client", FormField::SELECT, ["value" => $website?->getClient()?->getId() ?? null, "options" => EntityCollectionUtil::convertToSelectable($app->getClients(), "name")]);
        $formBuilder->add("hosting", "Hosting platform", FormField::SELECT, ["value" => $website?->getHosting()?->getId() ?? null, "options" => EntityCollectionUtil::convertToSelectable($app->getWebsiteOptions()->getHostings(), "name")]);
        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
