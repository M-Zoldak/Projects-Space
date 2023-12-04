<?php


namespace App\Tests\Classes;

use App\Enums\FormField;
use App\Classes\FormBuilder;
use PHPUnit\Framework\TestCase;

final class FormBuilderTest extends TestCase {

    public function testFormBuilding() {
        $formBuilder = new FormBuilder();
        $formBuilder->add("name", "User name", FormField::TEXT);

        $this->assertSame(
            (object) ["name" => (object) [
                "fieldType" => "text",
                "label" => "User name",
                "autoComplete" => "off",
                "value" => ""
            ]],
            $formBuilder->getFormData()
        );
    }
}
