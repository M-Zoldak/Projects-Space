<?php

namespace App\Utils;

use Doctrine\Common\Collections\Collection;

class EntityCollectionUtil {

    public static function createCollectionData(Collection $collection) {
        return array_map(function ($item) {
            return $item->getData();
        }, $collection->toArray());
    }
}
