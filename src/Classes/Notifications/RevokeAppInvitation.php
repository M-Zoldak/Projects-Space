<?php

namespace App\Classes\Notifications;

use App\Entity\App;
use App\Entity\User;
use App\Enums\NotificationActions;

class NewAppNotification extends DefaultNotification {

    public function __construct(User $user, App $app) {
        parent::__construct(
            "You were invited by {$user->getEmail()} to collaborate with him on {$app->getName()}."
        );
        $this->addAction(NotificationActions::Redirect);
    }
}
