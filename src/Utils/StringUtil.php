<?php

namespace App\Utils;

class StringUtil {

    public function convertString($inputString) {
        // Convert to lowercase
        $lowercaseString = strtolower($inputString);

        // Replace spaces with underscores
        $underscoredString = str_replace(' ', '_', $lowercaseString);

        return $underscoredString;
    }
}
