<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\SiteRepository;

#[ORM\Entity(repositoryClass: SiteRepository::class)]
class Site extends Entity {

    #[ORM\Column(length: 255)]
    private ?string $domain = null;

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
