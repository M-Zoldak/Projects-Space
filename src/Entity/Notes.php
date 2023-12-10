<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\NotesRepository;

#[ORM\Entity(repositoryClass: NotesRepository::class)]
class Notes extends Entity {

    #[ORM\Column(type: Types::TEXT)]
    private ?string $text = null;

    #[ORM\Column(length: 255)]
    private ?string $entityType = null;

    #[ORM\Column]
    private ?int $entityId = null;

    public function getText(): ?string {
        return $this->text;
    }

    public function setText(string $text): static {
        $this->text = $text;

        return $this;
    }

    public function getEntityType(): ?string {
        return $this->entityType;
    }

    public function setEntityType(string $entityType): static {
        $this->entityType = $entityType;

        return $this;
    }

    public function getEntityId(): ?int {
        return $this->entityId;
    }

    public function setEntityId(int $entityId): static {
        $this->entityId = $entityId;

        return $this;
    }
}
