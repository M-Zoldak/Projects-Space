<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\SiteRepository;

#[ORM\Entity(repositoryClass: SiteRepository::class)]
class Site extends Entity {

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $hosting = null;

    #[ORM\ManyToOne(inversedBy: 'sites')]
    private ?App $App = null;

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
        return $this->App;
    }

    public function setApp(?App $App): static {
        $this->App = $App;

        return $this;
    }
}
