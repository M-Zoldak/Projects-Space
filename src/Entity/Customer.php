<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
class Customer extends Entity {
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $phoneNumber = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $mobileNumber = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $city = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $postalCode = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $street = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $homeNumber = null;

    #[ORM\ManyToOne(inversedBy: 'customers')]
    private ?App $App = null;

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(?string $email): static {
        $this->email = $email;

        return $this;
    }

    public function getPhoneNumber(): ?string {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(?string $phoneNumber): static {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    public function getMobileNumber(): ?string {
        return $this->mobileNumber;
    }

    public function setMobileNumber(string $mobileNumber): static {
        $this->mobileNumber = $mobileNumber;

        return $this;
    }

    public function getCity(): ?string {
        return $this->city;
    }

    public function setCity(string $city): static {
        $this->city = $city;

        return $this;
    }

    public function getPostalCode(): ?string {
        return $this->postalCode;
    }

    public function setPostalCode(?string $postalCode): static {
        $this->postalCode = $postalCode;

        return $this;
    }

    public function getStreet(): ?string {
        return $this->street;
    }

    public function setStreet(string $street): static {
        $this->street = $street;

        return $this;
    }

    public function getHomeNumber(): ?string {
        return $this->homeNumber;
    }

    public function setHomeNumber(string $homeNumber): static {
        $this->homeNumber = $homeNumber;

        return $this;
    }

    public function getApp(): ?App {
        return $this->App;
    }

    public function setApp(?App $App): static {
        $this->App = $App;

        return $this;
    }
}
