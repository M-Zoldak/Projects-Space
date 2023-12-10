<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Client;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\ClientRepository;
use App\Repository\AppRoleRepository;
use App\Repository\ContactPersonRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Clients')]
#[Route("")]
class ClientsController extends AbstractController {
    public function __construct(
        private ClientRepository $clientRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private ContactPersonRepository $contactPersonRepository
    ) {
    }

    #[Route('/clients/create', name: 'clients_create_form', methods: ["GET"])]
    public function addForm(Request $request): JsonResponse {
        $formBuilder = $this->addAndEditForm();
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/clients', name: 'clients_overview', methods: ["GET"])]
    public function list(Request $request, #[CurrentUser] ?User $user): JsonResponse {
        $app = $user->getUserOptions()->getSelectedApp();
        $clients = $app->getClients();
        $clientsData = EntityCollectionUtil::createCollectionData($clients);

        // return new JsonResponse();
        return new JsonResponse($clientsData);
    }

    #[Route('/clients', name: 'clients_create', methods: ["POST"])]
    public function create(Request $request): JsonResponse {
        $data = json_decode($request->getContent());
        $app = $this->appRepository->findOneById($data->appId);

        $client = new Client();
        $client->setName($data->name);
        $client->setFax($data->fax);
        $client->setMobile($data->mobile);
        $client->setPhone($data->phone);

        $app->addClient($client);
        $this->appRepository->save($app);

        return new JsonResponse($client->getData());
    }

    #[Route('/clients/{id}', name: 'clients', methods: ["GET"])]
    public function getData(int $id): JsonResponse {
        $client = $this->clientRepository->findOneById($id);
        return new JsonResponse($client->getData());
    }

    #[Route('/clients/{id}/options', name: 'client_options', methods: ["GET"])]
    public function getOptionsData(int $id): JsonResponse {
        $client = $this->clientRepository->findOneById($id);
        $formBuilder = $this->addAndEditForm($client);
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/clients/{id}/updateName', name: 'client_name_update', methods: ["PUT"])]
    public function updateClientName(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        /** @var Client $client */
        $client = $this->clientRepository->findOneById($id);

        $client->setName($data->name);

        $this->clientRepository->save($client);

        return new JsonResponse($client->getData());
    }

    #[Route('/clients/{id}', name: 'client_update', methods: ["PUT"])]
    public function updateClient(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        /** @var Client $client */
        $client = $this->clientRepository->findOneById($id);

        // $client->setName($data->name);
        $client->setPhone($data->phone);
        $client->setFax($data->fax);
        $client->setMobile($data->mobile);

        $this->clientRepository->save($client);

        return new JsonResponse($client->getData());
    }

    #[Route('/clients/{id}', name: 'clients_delete', methods: ["DELETE"])]
    public function delete(string $id, Request $request): JsonResponse {
        $client = $this->clientRepository->findOneById($id);
        $clientData = $client->getData();

        $this->clientRepository->delete($client);
        return new JsonResponse($clientData);
    }



    private function addAndEditForm(?Client $client = null): FormBuilder {
        $formBuilder = new FormBuilder();
        if (!$client) $formBuilder->add("name", "Client name", FormField::TEXT, ["value" => $client?->getName() ?? ""]);
        $formBuilder->add("phone", "Phone", FormField::TEXT, ["value" => $client?->getPhone() ?? ""]);
        $formBuilder->add("mobile", "Mobile", FormField::TEXT, ["value" => $client?->getMobile() ?? ""]);
        $formBuilder->add("fax", "Fax", FormField::TEXT, ["value" => $client?->getFax() ?? ""]);

        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
