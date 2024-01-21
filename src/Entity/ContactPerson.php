<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ContactPersonRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactPersonRepository::class)]
class ContactPerson  extends Entity {
    #[Assert\NotBlank()]
    #[ORM\Column(length: 255)]
    private ?string $firstName = null;

    #[Assert\NotBlank()]
    #[ORM\Column(length: 255)]
    private ?string $lastName = null;

    #[Assert\NotBlank()]
    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $mobile = null;

    #[ORM\Column(length: 255)]
    private ?string $role = null;

    #[ORM\ManyToOne(inversedBy: 'employees', cascade: ["persist"])]
    private ?Client $ownerCompany = null;

    public function __construct() {
        parent::__construct();
    }

    public function getData() {
        return [
            "id" => $this->getId(),
            "clientId" => $this->getOwnerCompany()->getId(),
            "firstName" => $this->getFirstName(),
            "lastName" => $this->getLastName(),
            "email" => $this->getEmail(),
            "mobile" => $this->getMobile(),
            "role" => $this->getRole()
        ];
    }

    public function getFirstName(): ?string {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(string $email): static {
        $this->email = $email;

        return $this;
    }

    public function getMobile(): ?string {
        return $this->mobile;
    }

    public function setMobile(string $mobile): static {
        $this->mobile = $mobile;

        return $this;
    }

    public function getRole(): ?string {
        return $this->role;
    }

    public function setRole(string $role): static {
        $this->role = $role;

        return $this;
    }

    public function getOwnerCompany(): ?Client {
        return $this->ownerCompany;
    }

    public function setOwnerCompany(?Client $ownerCompany): static {
        $this->ownerCompany = $ownerCompany;

        return $this;
    }
}
