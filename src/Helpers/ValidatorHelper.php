<?php

namespace App\Helpers;

use Error;
use App\Entity\Entity;
use Symfony\Component\Validator\ConstraintViolationList;
use \Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidatorHelper {

    public static function validateObject(Entity $object, ValidatorInterface $validator) {
        $validation = $validator->validate($object);
        return self::mapErrorMessages($validation);
    }

    public static function mapErrorMessages(ConstraintViolationList $validation) {
        return (object) array_reduce(
            (array) $validation->getIterator(),
            function ($array, $error) {
                return array_merge($array, [$error->getPropertyPath() => $error->getMessage()]);
            },
            array()
        );
    }

    public static function mergeErrorMessages(...$objects) {
        return (object) array_reduce($objects, function ($initial, $messagesObject) {
            return array_merge($initial, (array) $messagesObject);
        }, []);
    }
}
