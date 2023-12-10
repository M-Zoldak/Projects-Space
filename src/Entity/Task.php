<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\TaskRepository;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task extends Entity {
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(length: 255)]
    private ?string $category = null;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    private ?Project $project = null;

    public function __construct() {
        parent::__construct();
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "projectId" => $this->getProject()->getId(),
            "name" => $this->getName(),
            "startDate" => $this->getStartDate(),
            "endDate" => $this->getEndDate(),
            "taskCategory" => $this->getCategory()
        ];
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

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

    public function getCategory(): ?string {
        return $this->category;
    }

    public function setCategory(string $category): static {
        $this->category = $category;

        return $this;
    }

    public function getProject(): ?Project {
        return $this->project;
    }

    public function setProject(?Project $project): static {
        $this->project = $project;

        return $this;
    }
}
