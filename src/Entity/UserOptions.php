<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserOptionsRepository;

#[ORM\Entity(repositoryClass: UserOptionsRepository::class)]
class UserOptions {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'userOptions', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userOptions')]
    private ?App $selectedApp = null;

    public function getData(): array {
        return [
            "selectedAppId" => $this->getSelectedApp()?->getId()
        ];
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getUser(): ?User {
        return $this->user;
    }

    public function setUser(User $user): static {
        $this->user = $user;

        return $this;
    }

    public function getSelectedApp(): ?App {
        return $this->selectedApp;
    }

    public function setSelectedApp(?App $selectedApp): static {
        $this->selectedApp = $selectedApp;

        return $this;
    }
}
