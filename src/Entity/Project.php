<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
class Project extends Entity {

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?App $app = null;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: ProjectRole::class, orphanRemoval: true)]
    private Collection $projectRoles;

    public function __construct(App $app, string $name) {
        parent::__construct();
        $this->projectRoles = new ArrayCollection();
        $this->setApp($app);
        $this->setName($name);
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "name" => $this->getName()
        ];
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

        return $this;
    }

    public function getApp(): ?App {
        return $this->app;
    }

    public function setApp(?App $app): static {
        $this->app = $app;

        return $this;
    }

    /**
     * @return Collection<int, ProjectRole>
     */
    public function getProjectRoles(): Collection {
        return $this->projectRoles;
    }

    public function addProjectRole(ProjectRole $projectRole): static {
        if (!$this->projectRoles->contains($projectRole)) {
            $this->projectRoles->add($projectRole);
            $projectRole->setProject($this);
        }

        return $this;
    }

    public function removeProjectRole(ProjectRole $projectRole): static {
        if ($this->projectRoles->removeElement($projectRole)) {
            // set the owning side to null (unless already changed)
            if ($projectRole->getProject() === $this) {
                $projectRole->setProject(null);
            }
        }

        return $this;
    }
}
