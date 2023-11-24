<?php

namespace App\Utils;

use stdClass;
use Doctrine\Common\Collections\Collection;

class EntityCollectionUtil {

    public static function createCollectionData(Collection|array $collection, array $functionParameters = []): array {

        return array_map(function ($item) use ($functionParameters) {
            return $item->getData(...$functionParameters);
        }, self::toArray($collection));
    }

    public static function createNamedCollectionData(Collection|array $collection, string $propertyName): object {
        $propertyName = ucfirst($propertyName);
        return array_reduce(
            self::toArray($collection),
            function ($obj, $item) use ($propertyName) {
                $obj->{$item->{"get$propertyName"}()} = $item->getData();
                return $obj;
            },
            new stdClass
        );
    }

    private static function toArray(Collection|array $collection): array {
        return $collection instanceof Collection ? $collection->toArray() : $collection;
    }
}
