<?php


namespace App\Enums;

enum FormField: string {
    case TEXT = "text";
    case DATE = "date";
    case CHECKBOX = "checkbox";
    case RADIO = "radio";

    public function hasDefaultValues(): bool {
        switch ($this) {
            case (self::TEXT):
                return true;
            case (self::DATE):
                return true;
            default:
                return false;
        }
    }

    public function getFieldDefaultOptions(): array | null {
        switch ($this) {
            case (self::TEXT):
                return ["autoComplete" => "off"];
            case (self::DATE):
                return ["dateFormat" => "yyyy-MM-dd"];
            default:
                return null;
        }
    }
}
