<?php

namespace App\Helpers;

use DateTimeImmutable;

class DateHelper {

    public static function convertToDate(string $dateString) {
        $date = new DateTimeImmutable(strtotime($dateString));
        $date->setTime(00, 00, 00);
        return $date;
    }
}
