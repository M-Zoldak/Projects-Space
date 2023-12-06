<?php

namespace App\Classes\Notifications;

use App\Interfaces\INotification;
use App\Enums\NotificationActions;

class DefaultNotification implements INotification {
    /**
     * @var Array<string>
     */
    private array $notifications;

    public function __construct(private string $message, private ?string $icon = null) {
    }

    public function getActions(): array {
        return array_unique($this->notifications);
    }

    public function getIcon(): ?string {
        return $this->icon;
    }

    public function getMessage(): string {
        return $this->message;
    }

    public function addAction(NotificationActions $action): void {
        // dd($action);
        $this->notifications[] = $action->name;
    }
}
