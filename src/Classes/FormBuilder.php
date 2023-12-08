<?php

namespace App\Classes;

use stdClass;
use App\Enums\FormField;

class FormBuilder {
    private array $fields = [];

    public function add(string $fieldName, string $fieldLabel, FormField $fieldType, array $options = []): void {
        if (empty($fieldName)) return;

        $field = (object) [
            "name" => $fieldName,
            "type" => $fieldType->value,
            "label" => $fieldLabel,
            "value" => ""
        ];

        $this->addDefaultOptions($fieldType, $field);
        $this->assignOptions($field, $options);

        $this->fields[] = $field;
    }

    public function getFormData(): array {
        return $this->fields;
    }

    public function createAppIdField() {
        $this->fields[] = (object) ["name" => "appId", "type" => FormField::HIDDEN->value, "value" => ""];
    }

    public function getValidationData(): array {
        return [];
    }

    private function addDefaultOptions(FormField $formField, object &$field): void {
        if ($formField->hasDefaultValues()) {
            $defaultOptions = $formField->getFieldDefaultOptions();
            $this->assignOptions($field, $defaultOptions);
        }
    }

    private function assignOptions(object &$field, array $options) {
        foreach ($options as $key => $val) {
            if (!empty($val)) $field->$key = $val;
        };
    }
}
