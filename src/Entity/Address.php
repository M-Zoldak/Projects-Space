<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\AddressRepository;

#[ORM\Entity(repositoryClass: AddressRepository::class)]
class Address extends Entity {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $street = null;

    #[ORM\Column(length: 255)]
    private ?string $postal = null;

    #[ORM\Column(length: 255)]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    private ?string $country = null;

    #[ORM\ManyToOne(inversedBy: 'addresses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getStreet(): ?string {
        return $this->street;
    }

    public function setStreet(string $street): static {
        $this->street = $street;

        return $this;
    }

    public function getPostal(): ?string {
        return $this->postal;
    }

    public function setPostal(string $postal): static {
        $this->postal = $postal;

        return $this;
    }

    public function getCity(): ?string {
        return $this->city;
    }

    public function setCity(string $city): static {
        $this->city = $city;

        return $this;
    }

    public function getCountry(): ?string {
        return $this->country;
    }

    public function setCountry(string $country): static {
        $this->country = $country;

        return $this;
    }

    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): static {
        $this->client = $client;

        return $this;
    }
}
