import { useState } from "react";
import { FlexboxGrid, Input, InputGroup } from "rsuite";

export type InputButtonGroupProps = {
  value?: string;
  onSubmit: (value: string) => void;
  onChange: (value: string) => void;
  buttonText: string;
  label: string;
};

export default function InputButtonGroup({
  value = "",
  onSubmit,
  onChange,
  buttonText,
  label,
}: InputButtonGroupProps) {
  return (
    <FlexboxGrid>
      <InputGroup>
        <InputGroup.Addon>{label}</InputGroup.Addon>
        <Input
          value={value}
          onChange={onChange}
          onKeyDown={(keyEvent) =>
            keyEvent.code == "Enter" ? onSubmit(value) : ""
          }
        />
        <InputGroup.Button
          onClick={() => onSubmit(value)}
          onSubmit={() => onSubmit(value)}
        >
          {buttonText}
        </InputGroup.Button>
      </InputGroup>
    </FlexboxGrid>
  );
}
