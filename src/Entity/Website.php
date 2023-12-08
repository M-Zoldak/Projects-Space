<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\WebsiteRepository;

#[ORM\Entity(repositoryClass: WebsiteRepository::class)]
class Website extends Entity {

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $hosting = null;

    #[ORM\ManyToOne(inversedBy: 'websites')]
    private ?App $app = null;

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
            "hosting" => $this->getHosting()
        ];
    }

    public function getHosting(): ?string {
        return $this->hosting;
    }

    public function setHosting(?string $hosting): static {
        $this->hosting = $hosting;

        return $this;
    }

    public function getApp(): ?App {
        return $this->app;
    }

    public function setApp(?App $app): static {
        $this->app = $app;

        return $this;
    }
}
