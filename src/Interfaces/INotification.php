<?php

namespace App\Interfaces;

use App\Enums\NotificationActions;

interface INotification {

    public function getMessage(): string;
    public function getIcon(): ?string;

    /**
     * @return Array<IAction>
     */
    public function getActions(): array;

    public function addAction(NotificationActions $action): void;
}
