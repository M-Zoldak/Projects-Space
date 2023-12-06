<?php

namespace App\Entity;

use FrontEndActions;
use Doctrine\ORM\Mapping as ORM;
use App\Interfaces\INotification;
use App\Repository\UserNotificationsRepository;

#[ORM\Entity(repositoryClass: UserNotificationsRepository::class)]
class UserNotification extends Entity {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notifications', cascade: ["persist"])]
    private ?User $user = null;

    #[ORM\Column(length: 1024, nullable: true)]
    private ?string $icon = null;

    #[ORM\Column(length: 2048)]
    private ?string $message = null;

    #[ORM\Column]
    private ?bool $isSeen = null;

    public function __construct(INotification $notification, User $user) {
        parent::__construct();
        $this->setUser($user);
        $this->setMessage($notification->getMessage());
        $this->setIcon($notification->getIcon());
        $this->setIsSeen(false);
    }

    public function getData() {
        return [
            "id" => $this->getId(),
            "message" => $this->getMessage(),
            "isSeen" => $this->isSeen(),
            "icon" => $this->getIcon(),
            "actions" => ""
        ];
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getUser(): ?User {
        return $this->user;
    }

    public function setUser(?User $user): static {
        $this->user = $user;

        return $this;
    }

    public function getIcon(): ?string {
        return $this->icon;
    }

    public function setIcon(?string $icon): static {
        $this->icon = $icon;

        return $this;
    }

    public function getMessage(): ?string {
        return $this->message;
    }

    public function setMessage(string $message): static {
        $this->message = $message;

        return $this;
    }

    public function isSeen(): ?bool {
        return $this->isSeen ?? false;
    }

    public function setIsSeen(bool $isSeen): static {
        $this->isSeen = $isSeen;

        return $this;
    }
}
