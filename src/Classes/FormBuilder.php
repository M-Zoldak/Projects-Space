<?php

namespace App\Classes;

use App\Enums\FormField;

class FormBuilder {
    private array $fields = [];

    public function add(string $fieldName, string $fieldLabel, FormField $fieldType, array $options): void {
        if (empty($fieldName)) return;

        $field = (object) ["name" => $fieldName, "type" => $fieldType, "label" => $fieldLabel];

        $this->addDefaultOptions($fieldType, $field);
        $this->assignOptions($field, $options);

        $this->fields[] = $field;
    }

    public function getFormData(): array {
        return $this->fields;
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

    private function assignOptions(object $field, array $options) {
        foreach ($options as $key => $val) {
            $field->$key = $val;
        };
    }
}
