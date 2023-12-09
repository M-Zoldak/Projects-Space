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
use App\Repository\WebsiteOptionsRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Websites')]
#[Route("")]
class WebsiteOptionsController extends AbstractController {
    public function __construct(
        private WebsiteOptionsRepository $websiteOptionsRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private ClientRepository $clientRepository
    ) {
    }

    // #[Route('/websites/create', name: 'websites_create_form', methods: ["GET"])]
    // public function addForm(Request $request, #[CurrentUser] ?User $user): JsonResponse {
    //     $app = $user->getUserOptions()->getSelectedApp();
    //     $formBuilder = $this->addAndEditForm($app);
    //     return new JsonResponse($formBuilder->getFormData());
    // }

    // #[Route('/websites', name: 'websites_create', methods: ["POST"])]
    // public function create(Request $request): JsonResponse {
    //     $data = json_decode($request->getContent());

    //     $app = $this->appRepository->findOneById($data->appId);
    //     $client = $this->clientRepository->findOneById($data->client);

    //     $website = new Website();
    //     $website->setHosting("jeb z dzidy laserowej");
    //     $website->setDomain($data->domain);
    //     $website->setClient($client);

    //     $this->websiteRepository->save($website);

    //     $app->addWebsite($website);
    //     $this->appRepository->save($app);

    //     return new JsonResponse($website->getData());
    // }

    // #[Route('/websites', name: 'websites_overview', methods: ["GET"])]
    // public function list(Request $request, #[CurrentUser] ?User $user): JsonResponse {
    //     $app = $user->getUserOptions()->getSelectedApp();
    //     $websites = $app->getWebsites();
    //     $websitesData = EntityCollectionUtil::createCollectionData($websites);

    //     return new JsonResponse($websitesData);
    // }

    // #[Route('/websites/{id}', name: 'websites', methods: ["GET"])]
    // public function getData($id): JsonResponse {
    //     $website = $this->websiteRepository->findOneById($id);
    //     return new JsonResponse($website->getData());
    // }

    // #[Route('/websites/{id}', name: 'websites_delete', methods: ["DELETE"])]
    // public function delete(string $id, Request $request): JsonResponse {
    //     $website = $this->websiteRepository->findOneById($id);
    //     $websiteData = $website->getData();

    //     $this->websiteRepository->delete($website);
    //     return new JsonResponse($websiteData);
    // }


    // #[Route('/websites/hostings', name: 'websites_hostings_list', methods: ["GET"])]
    // public function hostsList(Request $request): JsonResponse {
    //     $data = json_decode($request->getContent());
    //     $app = $this->appRepository->findOneById($data->appId);
    //     $hostingsList = $app->getWebsiteOptions()->getHostingsList();

    //     return new JsonResponse($hostingsList);
    // }

    #[Route('/websites/hostings', name: 'websites_add_hosting', methods: ["POST"])]
    public function addHosting(Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($data->appId);
        $websiteHosting = new WebsiteHosting($data->name);
        $app->getWebsiteOptions()->addHosting($websiteHosting);

        $this->websiteOptionsRepository->save($app->getWebsiteOptions());
        $this->appRepository->save($app);
        return new JsonResponse($websiteHosting->getData());
    }

    // private function addAndEditForm(App $app, ?Website $website = null): FormBuilder {
    //     $formBuilder = new FormBuilder();
    //     $formBuilder->add("domain", "Domain", FormField::TEXT, ["value" => $website?->getDomain() ?? ""]);
    //     $formBuilder->add("client", "Client", FormField::SELECT, ["value" => $website?->getClient() ?? "", "options" => EntityCollectionUtil::convertToSelectable($app->getClients(), "name")]);
    //     // $formBuilder->add("hosting", "Hosting platform", FormField::SELECT, ["value" => $website?->getHosting() ?? "", "options" => $website->getApp()->getWebsiteOptions()->getHostingsList()]);
    //     $formBuilder->createAppIdField();
    //     return $formBuilder;
    // }
}
