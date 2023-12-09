<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\WebsiteRepository;

#[ORM\Entity(repositoryClass: WebsiteRepository::class)]
class Website extends Entity {

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    #[ORM\ManyToOne(inversedBy: 'websites')]
    private ?App $app = null;

    #[ORM\ManyToOne(inversedBy: 'websites')]
    private ?Client $client = null;

    #[ORM\ManyToOne(inversedBy: 'websites')]
    private ?WebsiteHosting $hosting = null;

    public function getDomain(): ?string {
        return $this->domain;
    }

    public function setDomain(string $domain): static {
        $this->domain = $domain;

        return $this;
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "domain" => $this->getDomain(),
            "hosting" => $this->getHosting()->getData(),
            "client" => $this->getClient()->getData()
        ];
    }

    public function getApp(): ?App {
        return $this->app;
    }

    public function setApp(?App $app): static {
        $this->app = $app;

        return $this;
    }

    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): static {
        $this->client = $client;

        return $this;
    }

    public function getHosting(): ?WebsiteHosting {
        return $this->hosting;
    }

    public function setHosting(?WebsiteHosting $hosting): static {
        $this->hosting = $hosting;

        return $this;
    }
}
