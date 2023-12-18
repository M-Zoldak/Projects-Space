<?php

namespace App\Helpers;

use DateTime;
use DateTimeZone;
use DateTimeImmutable;
use DateTimeInterface;

class DateHelper {

    public static function convertToDate(string $dateString) {
        // dump($dateString);

        $date = new DateTime();
        $date->setTimestamp($dateString / 1000);
        $date->modify("+2 hours");
        // dd($date);
        return $date;
    }

    public static function exposeDate(DateTimeInterface $date) {
        return $date->format("Y.m.d");
    }
}
