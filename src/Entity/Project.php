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

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Task::class, cascade: ["persist", "remove"], orphanRemoval: true)]
    private Collection $tasks;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $participants = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?Client $client = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?Website $website = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    private ?ProjectState $projectState = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Note::class, cascade: ["persist", "remove"], orphanRemoval: true)]
    private Collection $note;

    #[ORM\ManyToOne(inversedBy: 'projectsManagerFor')]
    #[ORM\JoinColumn(nullable: true, onDelete: "SET NULL")]
    private ?User $manager = null;

    public function __construct(App $app, string $name) {
        parent::__construct();
        $this->tasks = new ArrayCollection();
        $this->setApp($app);
        $this->setName($name);
        $this->note = new ArrayCollection();
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "appId" => $this->getApp()?->getId(),
            "name" => $this->getName(),
            "tasks" => EntityCollectionUtil::createCollectionData($this->getTasks()),
            "participants" => $this->getParticipants(),
            "client" => $this->getClient()?->getData(),
            "website" => $this->getWebsite()?->getData(),
            "projectState" => $this->getProjectState()?->getData(),
            "startDate" => $this->getStartDate(),
            "endDate" => $this->getEndDate(),
            "notes" => EntityCollectionUtil::createCollectionData($this->getNotes()),
            "manager" => $this->getManager()?->getData()
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

    public function getStartDate(): ?\DateTimeInterface {
        return $this->startDate;
    }

    public function setStartDate(?\DateTimeInterface $startDate): static {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeInterface $endDate): static {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * @return Collection<int, Note>
     */
    public function getNotes(): Collection {
        return $this->note;
    }

    public function addNote(Note $note): static {
        if (!$this->note->contains($note)) {
            $this->note->add($note);
            $note->setProject($this);
        }

        return $this;
    }

    public function removeNote(Note $note): static {
        if ($this->note->removeElement($note)) {
            // set the owning side to null (unless already changed)
            if ($note->getProject() === $this) {
                $note->setProject(null);
            }
        }

        return $this;
    }

    public function getManager(): ?User {
        return $this->manager;
    }

    public function setManager(?User $manager): static {
        $this->manager = $manager;

        return $this;
    }
}
