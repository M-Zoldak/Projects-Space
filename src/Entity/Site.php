<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\SiteRepository;

#[ORM\Entity(repositoryClass: SiteRepository::class)]
class Site {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getDomain(): ?string {
        return $this->domain;
    }

    public function setDomain(string $domain): static {
        $this->domain = $domain;

        return $this;
    }

    public function getData() {
        return [
            "id" => $this->getId(),
            "domain" => $this->getDomain(),
        ];
    }
}
