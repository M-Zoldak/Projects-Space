<?php

namespace App\Utils;

class ArrayUtil {
    public static function array_any(array $array, callable $fn) {
        foreach ($array as $value) {
            if ($fn($value)) {
                return true;
            }
        }
        return false;
    }

    public static function array_every(array $array, callable $fn) {
        foreach ($array as $value) {
            if (!$fn($value)) {
                return false;
            }
        }
        return true;
    }
}
