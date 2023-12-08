<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Entity\Client;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use App\Entity\ContactPerson;
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

#[OA\Tag(name: 'ContactPersons')]
#[Route("")]
class ContactPersonController extends AbstractController {
    public function __construct(
        private ClientRepository $clientRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private ContactPersonRepository $contactPersonRepository
    ) {
    }

    #[Route('/clients/{id}/contacts/create', name: 'contact_persons_create_form', methods: ["GET"])]
    public function addForm(Request $request): JsonResponse {
        $formBuilder = $this->addAndEditForm();
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/clients/{id}/contacts', name: 'contact_persons_overview', methods: ["GET"])]
    public function list(int $id): JsonResponse {
        /** @var Client $client */
        $client = $this->clientRepository->findOneById($id);
        $contactsData = EntityCollectionUtil::createCollectionData($client->getEmployees());
        return new JsonResponse($contactsData);
    }

    #[Route('/clients/{id}/contacts', name: 'contact_persons_create', methods: ["POST"])]
    public function create(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());


        /** @var Client $client */
        $client = $this->clientRepository->findOneById($id);

        $contactPerson = new ContactPerson();
        $contactPerson->setFirstName($data->firstName);
        $contactPerson->setLastName($data->lastName);
        $contactPerson->setMobile($data->mobile);
        $contactPerson->setRole($data->role);
        $contactPerson->setOwnerCompany($client);
        $contactPerson->setEmail($data->email);

        $this->contactPersonRepository->save($contactPerson);

        return new JsonResponse($contactPerson->getData());
    }

    #[Route('/clients/{id}/contacts/{personId}', name: 'contact_persons', methods: ["GET"])]
    public function getData($personId): JsonResponse {
        $contactPerson = $this->contactPersonRepository->findOneById($personId);
        return new JsonResponse($contactPerson->getData());
    }

    #[Route('/clients/{id}/contacts/{personId}/options', name: 'contact_person_options', methods: ["GET"])]
    public function getOptionsData(int $personId): JsonResponse {
        $contactPerson = $this->contactPersonRepository->findOneById($personId);
        $formBuilder = $this->addAndEditForm($contactPerson);
        return new JsonResponse($formBuilder->getFormData());
        // return new JsonResponse($contactPerson->getData());
    }


    #[Route('/clients/{id}/contacts/{personId}', name: 'contact_person_update', methods: ["POST"])]
    public function updateContactPerson(int $id, int $personId, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        /** @var ContactPerson $contactPerson */
        $contactPerson = $this->contactPersonRepository->findOneById($personId);

        $contactPerson->setFirstName($data->firstName);
        $contactPerson->setLastName($data->fax);
        $contactPerson->setMobile($data->mobile);
        $contactPerson->setRole($data->role);
        $contactPerson->setEmail($data->email);

        $this->clientRepository->save($contactPerson);

        return new JsonResponse($contactPerson->getData());
    }

    #[Route('/clients/{id}/contacts/{personId}', name: 'contact_persons_delete', methods: ["DELETE"])]
    public function delete(string $personId, Request $request): JsonResponse {
        $contactPerson = $this->contactPersonRepository->findOneById($personId);
        $contactPersonData = $contactPerson->getData();

        $this->clientRepository->delete($contactPerson);
        return new JsonResponse($contactPersonData);
    }

    private function addAndEditForm(?ContactPerson $contactPerson = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("firstName", "First name", FormField::TEXT, ["value" => $contactPerson?->getFirstName()]);
        $formBuilder->add("lastName", "Last name", FormField::TEXT, ["value" => $contactPerson?->getLastName()]);
        $formBuilder->add("role", "Role in company", FormField::TEXT, ["value" => $contactPerson?->getRole()]);
        $formBuilder->add("email", "Email", FormField::TEXT, ["value" => $contactPerson?->getEmail()]);
        $formBuilder->add("mobile", "Mobile", FormField::TEXT, ["value" => $contactPerson?->getMobile()]);

        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
