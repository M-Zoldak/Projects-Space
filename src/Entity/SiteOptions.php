<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\SiteOptionsRepository;

#[ORM\Entity(repositoryClass: SiteOptionsRepository::class)]
class SiteOptions extends Entity {

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $hosting = null;

    #[ORM\OneToOne(inversedBy: 'siteOptions', cascade: ['persist', 'remove'])]
    private ?App $app = null;

    #[ORM\Column(nullable: true)]
    private ?array $hostingsList = null;

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

    public function getHostingsList(): ?array {
        return $this->hostingsList;
    }

    public function setHostingsList(?array $hostingsList): static {
        $this->hostingsList = $hostingsList;

        return $this;
    }
}
