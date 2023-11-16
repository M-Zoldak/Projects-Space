<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProjectRoleRepository;

#[ORM\Entity(repositoryClass: ProjectRoleRepository::class)]
class ProjectRole extends Entity {

    #[ORM\ManyToOne(inversedBy: 'projectRoles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Project $project = null;

    #[ORM\ManyToOne(inversedBy: 'projectRoles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    private ?string $role = null;

    public function getData(): array {
        return [];
    }

    public function getProject(): ?Project {
        return $this->project;
    }

    public function setProject(?Project $project): static {
        $this->project = $project;

        return $this;
    }

    public function getUser(): ?User {
        return $this->user;
    }

    public function setUser(?User $user): static {
        $this->user = $user;

        return $this;
    }

    public function getRole(): ?string {
        return $this->role;
    }

    public function setRole(string $role): static {
        $this->role = $role;

        return $this;
    }
}
