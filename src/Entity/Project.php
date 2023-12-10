<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Utils\EntityCollectionUtil;
use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
class Project extends Entity {

    #[Assert\NotBlank()]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?App $app = null;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Task::class, cascade: ["persist"])]
    private Collection $tasks;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $participants = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?Client $client = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?Website $website = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?ProjectState $projectState = null;

    public function __construct(App $app, string $name) {
        parent::__construct();
        $this->tasks = new ArrayCollection();
        $this->setApp($app);
        $this->setName($name);
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "appId" => $this->getApp()->getId(),
            "name" => $this->getName(),
            "tasks" => EntityCollectionUtil::createCollectionData($this->getTasks()),
            "participants" => $this->getParticipants(),
            "client" => $this->getClient()?->getData(),
            "website" => $this->getWebsite()?->getData(),
            "projectState" => $this->getProjectState()?->getData(),
            "participants" => $this->getParticipants()
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
     * @return Collection<int, Task>
     */
    public function getTasks(): Collection {
        return $this->tasks;
    }

    public function addTask(Task $task): static {
        if (!$this->tasks->contains($task)) {
            $this->tasks->add($task);
            $task->setProject($this);
        }

        return $this;
    }

    public function removeTask(Task $task): static {
        if ($this->tasks->removeElement($task)) {
            // set the owning side to null (unless already changed)
            if ($task->getProject() === $this) {
                $task->setProject(null);
            }
        }

        return $this;
    }

    public function getParticipants(): ?array {
        return $this->participants;
    }

    public function setParticipants(?array $participants): static {
        $this->participants = $participants;

        return $this;
    }

    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): static {
        $this->client = $client;

        return $this;
    }

    public function getWebsite(): ?Website {
        return $this->website;
    }

    public function setWebsite(?Website $website): static {
        $this->website = $website;

        return $this;
    }

    public function getProjectState(): ?ProjectState {
        return $this->projectState;
    }

    public function setProjectState(?ProjectState $projectState): static {
        $this->projectState = $projectState;

        return $this;
    }
}
