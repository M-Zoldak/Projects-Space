<?php

namespace App\Utils;

use Doctrine\Common\Collections\Collection;

class EntityCollectionUtil {

    public static function createCollectionData(Collection|array $collection) {
        $array = $collection instanceof Collection ? $collection->toArray() : $collection;
        return array_map(function ($item) {
            return $item->getData();
        }, $array);
    }
}
