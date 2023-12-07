<?php

namespace App\Classes\Notifications;

use App\Entity\App;
use App\Entity\User;
use App\Enums\NotificationActions;

class AppInvitation extends DefaultNotification {

    public function __construct(User $user, App $app) {
        parent::__construct(
            "You were invited by {$user->getFullName()} to collaborate with him on {$app->getName()}."
        );
        $this->addAction(NotificationActions::Redirect);
    }
}
