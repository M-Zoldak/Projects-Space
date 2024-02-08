<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\NoteRepository;

#[ORM\Entity(repositoryClass: NoteRepository::class)]
class Note extends Entity {

    #[ORM\Column(type: Types::TEXT)]
    private ?string $text = null;

    #[ORM\ManyToOne(inversedBy: 'notes', cascade: ["persist"])]
    private ?Project $project = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $title = null;

    #[ORM\ManyToOne(inversedBy: 'notes', cascade: ["persist"])]
    #[ORM\JoinColumn(nullable: true, onDelete: "SET NULL")]
    private ?User $user = null;

    public function __construct() {
        parent::__construct();
    }

    public function getData() {
        return [
            "title" => $this->getTitle(),
            "text" => $this->getText(),
            "user" => $this->getUser()->getData(),
            "createdAt" => $this->getCreatedAt()
        ];
    }

    public function getText(): ?string {
        return $this->text;
    }

    public function setText(string $text): static {
        $this->text = $text;

        return $this;
    }

    public function getProject(): ?Project {
        return $this->project;
    }

    public function setProject(?Project $project): static {
        $this->project = $project;

        return $this;
    }

    public function getTitle(): ?string {
        return $this->title;
    }

    public function setTitle(?string $title): static {
        $this->title = $title;

        return $this;
    }

    public function getUser(): ?User {
        return $this->user;
    }

    public function setUser(?User $user): static {
        $this->user = $user;

        return $this;
    }
}
