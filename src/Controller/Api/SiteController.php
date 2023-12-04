<?php

namespace App\Controller\Api;

use App\Entity\Site;
use OpenApi\Attributes as OA;
use App\Repository\SiteRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Websites')]
#[Route("")]
class SiteController extends AbstractController {
    public function __construct(private SiteRepository $siteRepository) {
    }

    // #[Route('/site', name: 'site_add', methods: ["POST"])]
    // public function add(Request $request): RedirectResponse {
    //     $domain = $request->get("domain");
    //     $site = new Site();
    //     $site->setDomain($domain);

    //     $this->siteRepository->save($site);
    //     return new RedirectResponse("/sites?page_created=true");
    // }

    // #[Route('/site/{id}', name: 'site', methods: ["GET"])]
    // public function getData($id): JsonResponse {
    //     $site = $this->siteRepository->findOneById($id);
    //     return new JsonResponse($site->getData());
    // }

    // #[Route('/site/delete/{id}', name: 'site_delete', methods: ["GET"])]
    // public function delete($id): Response {
    //     $site = $this->siteRepository->findOneById($id);
    //     $this->siteRepository->delete($site);
    //     return new Response($site->getDomain() . " deleted successfully.");
    // }

    // #[Route('/sites', name: 'site_overview', methods: ["GET"])]
    // public function getSites(): JsonResponse {
    //     $sites = $this->siteRepository->getData();
    //     return new JsonResponse($sites);
    // }
}
