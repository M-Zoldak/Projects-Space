<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProjectStateRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: ProjectStateRepository::class)]
class ProjectState extends Entity {
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'projectState')]
    #[ORM\JoinColumn(nullable: false)]
    private ?App $app = null;

    #[ORM\Column]
    private ?int $position = null;

    #[ORM\OneToMany(mappedBy: 'projectState', targetEntity: Project::class)]
    private Collection $projects;

    public function __construct(string $name, App $app) {
        parent::__construct();
        $this->setName($name);
        $this->setApp($app);
        $this->setPosition($this->app->getProjectStates()->count());
        $this->projects = new ArrayCollection();
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "appId" => $this->getApp()->getId(),
            "name" => $this->getName(),
            "position" => $this->getPosition()
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

    public function getPosition(): ?int {
        return $this->position;
    }

    public function setPosition(int $position): static {
        $this->position = $position;

        return $this;
    }

    /**
     * @return Collection<int, Project>
     */
    public function getProjects(): Collection {
        return $this->projects;
    }

    public function addProject(Project $project): static {
        if (!$this->projects->contains($project)) {
            $this->projects->add($project);
            $project->setProjectState($this);
        }

        return $this;
    }

    public function removeProject(Project $project): static {
        if ($this->projects->removeElement($project)) {
            // set the owning side to null (unless already changed)
            if ($project->getProjectState() === $this) {
                $project->setProjectState(null);
            }
        }

        return $this;
    }
}
