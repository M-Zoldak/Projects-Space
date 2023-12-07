<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProjectCategoriesRepository;

#[ORM\Entity(repositoryClass: ProjectCategoriesRepository::class)]
class ProjectCategories extends Entity {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private array $categories = [];

    #[ORM\ManyToOne(inversedBy: 'projectCategories')]
    private ?App $app = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getCategories(): array {
        return $this->categories;
    }

    public function setCategories(array $categories): static {
        $this->categories = $categories;

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
