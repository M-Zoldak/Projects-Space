<?php

namespace App\Utils;

use Doctrine\Common\Collections\Collection;

class EntityCollectionUtil {

    public static function createCollectionData(Collection|array $collection): array {
        return array_map(function ($item) {
            return $item->getData();
        }, self::toArray($collection));
    }

    private static function toArray(Collection|array $collection): array {
        return $collection instanceof Collection ? $collection->toArray() : $collection;
    }
}
