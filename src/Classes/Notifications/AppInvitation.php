<?php

namespace App\Classes\Notifications;

use App\Entity\App;
use App\Entity\User;
use App\Enums\NotificationActions;

class AppInvitation extends DefaultNotification {

    public function __construct(App $app) {
        parent::__construct(
            "You were invited to collaborate on app <{$app->getName()}>."
        );
        $this->addAction(NotificationActions::Redirect);
    }
}
