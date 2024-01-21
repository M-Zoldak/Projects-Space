<?php

namespace App\Controller\Api;

use App\Entity\App;
use App\Entity\User;
use App\Entity\Client;
use App\Entity\Address;
use App\Enums\FormField;
use App\Classes\FormBuilder;
use OpenApi\Attributes as OA;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
use App\Repository\ClientRepository;
use App\Repository\AddressRepository;
use App\Repository\AppRoleRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[OA\Tag(name: 'Addresss')]
#[Route("")]
class AddressController extends AbstractController {
    public function __construct(
        private ClientRepository $clientRepository,
        private AppRepository $appRepository,
        private AppRoleRepository $appRoleRepository,
        private AddressRepository $addressRepository
    ) {
    }

    #[Route('/clients/{id}/addresses/create', name: 'addresses_create_form', methods: ["GET"])]
    public function addForm(Request $request): JsonResponse {
        $formBuilder = $this->addAndEditForm();
        return new JsonResponse($formBuilder->getFormData());
    }

    #[Route('/clients/{id}/addresses', name: 'addresses_overview', methods: ["GET"])]
    public function list(int $id): JsonResponse {
        /** @var Client $client */
        $client = $this->clientRepository->findOneById($id);
        $addressesData = EntityCollectionUtil::createCollectionData($client->getAddresses());
        return new JsonResponse($addressesData);
    }

    #[Route('/clients/{id}/addresses', name: 'addresses_create', methods: ["POST"])]
    public function create(int $id, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        /** @var Client $client */
        $client = $this->clientRepository->findOneById($id);

        $address = new Address();
        $address->setCountry($data->country);
        $address->setCity($data->city);
        $address->setPostal($data->postal);
        $address->setStreet($data->street);
        $address->setClient($client);

        $this->addressRepository->save($address);

        return new JsonResponse($address->getData());
    }

    #[Route('/clients/{id}/addresses/{addressId}', name: 'addresses', methods: ["GET"])]
    public function getData($addressId): JsonResponse {
        $address = $this->addressRepository->findOneById($addressId);
        return new JsonResponse($address->getData());
    }

    #[Route('/clients/{id}/addresses/{addressId}/options', name: 'address_options', methods: ["GET"])]
    public function getOptionsData(int $addressId): JsonResponse {
        $address = $this->addressRepository->findOneById($addressId);
        $formBuilder = $this->addAndEditForm($address);
        return new JsonResponse($formBuilder->getFormData());
        // return new JsonResponse($address->getData());
    }


    #[Route('/clients/{id}/addresses/{addressId}/update', name: 'address_update', methods: ["PUT"])]
    public function updateAddress(int $id, int $addressId, Request $request): JsonResponse {
        $data = json_decode($request->getContent());

        /** @var Address $address */
        $address = $this->addressRepository->findOneById($addressId);

        $address->setCity($data->city);
        $address->setCountry($data->country);
        $address->setPostal($data->postal);
        $address->setStreet($data->street);

        $this->clientRepository->save($address);

        return new JsonResponse($address->getData());
    }

    #[Route('/clients/{id}/addresses/{addressId}', name: 'addresses_delete', methods: ["DELETE"])]
    public function delete(string $addressId, Request $request): JsonResponse {
        $address = $this->addressRepository->findOneById($addressId);
        $addressData = $address->getData();

        $this->clientRepository->delete($address);
        return new JsonResponse($addressData);
    }

    private function addAndEditForm(?Address $address = null): FormBuilder {
        $formBuilder = new FormBuilder();
        $formBuilder->add("country", "Country", FormField::TEXT, ["value" => $address?->getCountry()]);
        $formBuilder->add("city", "City", FormField::TEXT, ["value" => $address?->getCity()]);
        $formBuilder->add("postal", "Postal", FormField::TEXT, ["value" => $address?->getPostal()]);
        $formBuilder->add("street", "Street with number", FormField::TEXT, ["value" => $address?->getStreet()]);

        $formBuilder->createAppIdField();
        return $formBuilder;
    }
}
