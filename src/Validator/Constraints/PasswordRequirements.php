<?php

use Symfony\Component\Validator\Constraints\Compound;
use Symfony\Component\Validator\Constraints as Assert;

class PasswordRequirements extends Compound {
    protected function getConstraints(array $options): array {
        return [
            new Assert\NotBlank(),
            new Assert\Type('string'),
            new Assert\Length(['min' => 8]),
            //regex -> to have at elast one digit
            new Assert\Regex([
                'pattern' => '/\d+/i',
            ], "Password must contains at least one digit."),
            //regex -> to have at elast one special char from the list
            //note: list of special-char is [#?!@$%^&*-.,]. Adjust to suite your needs
            // new Assert\Regex([
            //     'pattern' => '/[#?!@$%^&*-.,]+/i',
            // ]),
        ];
    }
}
