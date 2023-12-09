<?php

namespace App\Utils;

use stdClass;
use App\Entity\Entity;
use Doctrine\Common\Collections\Collection;

class EntityCollectionUtil {

    public static function createCollectionData(Collection|array $collection, array $functionParameters = []): array {
        $array = self::toArray($collection);
        return array_map(function ($item) use ($functionParameters) {
            return $item->getData(...$functionParameters);
        }, $array);
    }

    public static function createNamedCollectionData(Collection|array $collection, string $propertyName): object {
        $array = self::toArray($collection);
        $propertyName = ucfirst($propertyName);
        return array_reduce(
            $array,
            function ($obj, $item) use ($propertyName) {
                $obj->{lcfirst($item->{"get$propertyName"}())} = $item->getData();
                return $obj;
            },
            new stdClass
        );
    }

    /**
     * @param Collection|array $collection
     * @param string $labelToShow
     * 
     * @return array<int, string>
     */
    public static function convertToSelectable(Collection|array $collection, string $labelToShow) {
        $array = self::toArray($collection);
        $label = ucfirst($labelToShow);
        return array_map(fn (Entity $item) => (object) ["value" => $item->getId(), "label" => $item->{"get$label"}()], $array);
    }

    private static function toArray(Collection|array $collection): array {
        return $collection instanceof Collection ? $collection->toArray() : $collection;
    }
}
