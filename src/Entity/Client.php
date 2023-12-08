<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Utils\EntityCollectionUtil;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client extends Entity {
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $fax = null;

    #[ORM\Column(length: 255)]
    private ?string $phone = null;

    #[ORM\Column(length: 255)]
    private ?string $mobile = null;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Address::class, cascade: ["persist"], orphanRemoval: true)]
    private Collection $addresses;

    #[ORM\OneToMany(mappedBy: 'ownerCompany', targetEntity: ContactPerson::class, cascade: ["persist"], orphanRemoval: true)]
    private Collection $employees;

    #[ORM\ManyToOne(inversedBy: 'clients')]
    private ?App $app = null;

    public function __construct() {
        parent::__construct();
        $this->addresses = new ArrayCollection();
        $this->employees = new ArrayCollection();
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "appId" => $this->getApp()?->getId(),
            "name" => $this->getName(),
            "mobile" => $this->getMobile(),
            "phone" => $this->getPhone(),
            "fax" => $this->getFax(),
            "addresses" => EntityCollectionUtil::createCollectionData($this->getAddresses()),
            "employees" => EntityCollectionUtil::createCollectionData($this->getEmployees()),
        ];
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

        return $this;
    }

    public function getFax(): ?string {
        return $this->fax;
    }

    public function setFax(string $fax): static {
        $this->fax = $fax;

        return $this;
    }

    public function getPhone(): ?string {
        return $this->phone;
    }

    public function setPhone(string $phone): static {
        $this->phone = $phone;

        return $this;
    }

    public function getMobile(): ?string {
        return $this->mobile;
    }

    public function setMobile(string $mobile): static {
        $this->mobile = $mobile;

        return $this;
    }

    /**
     * @return Collection<int, Address>
     */
    public function getAddresses(): Collection {
        return $this->addresses;
    }

    public function addAddress(Address $address): static {
        if (!$this->addresses->contains($address)) {
            $this->addresses->add($address);
            $address->setClient($this);
        }

        return $this;
    }

    public function removeAddress(Address $address): static {
        if ($this->addresses->removeElement($address)) {
            // set the owning side to null (unless already changed)
            if ($address->getClient() === $this) {
                $address->setClient(null);
            }
        }

        return $this;
    }

    public function getApp(): ?App {
        return $this->app;
    }

    public function setApp(?App $app): static {
        $this->app = $app;

        return $this;
    }

    /**
     * @return Collection<int, ContactPerson>
     */
    public function getEmployees(): Collection {
        return $this->employees;
    }

    public function addEmployee(ContactPerson $employee): static {
        if (!$this->employees->contains($employee)) {
            $this->employees->add($employee);
            $employee->setOwnerCompany($this);
        }

        return $this;
    }

    public function removeEmployee(ContactPerson $employee): static {
        if ($this->employees->removeElement($employee)) {
            // set the owning side to null (unless already changed)
            if ($employee->getOwnerCompany() === $this) {
                $employee->setOwnerCompany(null);
            }
        }

        return $this;
    }
}
