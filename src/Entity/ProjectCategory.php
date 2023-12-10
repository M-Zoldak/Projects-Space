<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProjectCategoryRepository;

#[ORM\Entity(repositoryClass: ProjectCategoryRepository::class)]
class ProjectCategory extends Entity {

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function __construct() {
        parent::__construct();
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }
}
