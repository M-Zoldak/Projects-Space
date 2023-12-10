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
use App\Repository\WebsiteHostingRepository;
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
        private WebsiteHostingRepository $websiteHostingRepository,
        private WebsiteRepository $websiteRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private ClientRepository $clientRepository
    ) {
    }

    #[Route('/apps/{id}/hostings/{hostingId}', name: 'apps_delete_hosting', methods: ["DELETE"])]
    public function delete(string $id, string $hostingId, Request $request): JsonResponse {
        $app = $this->appRepository->findOneById($id);
        $websiteOptions = $app->getWebsiteOptions();
        $hosting = $this->websiteHostingRepository->findOneById($hostingId);

        $websitesWithHoster = $this->websiteRepository->findBy(["hosting" => $hosting->getId()]);

        foreach ($websitesWithHoster as $website) {
            $website->setHosting(null);
        }

        $websiteOptions->removeHosting($hosting);
        $hostingData = $hosting->getData();

        $this->websiteHostingRepository->delete($hosting);
        return new JsonResponse($hostingData);
    }


    #[Route('/apps/hostings', name: 'apps_add_hosting', methods: ["POST"])]
    public function addHosting(Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($data->appId);
        $websiteHosting = new WebsiteHosting($data->name);
        $app->getWebsiteOptions()->addHosting($websiteHosting);

        $this->websiteOptionsRepository->save($app->getWebsiteOptions());
        $this->appRepository->save($app);
        return new JsonResponse($websiteHosting->getData());
    }
}
