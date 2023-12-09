import { useState } from "react";
import { FlexboxGrid, Input, InputGroup } from "rsuite";

export type InputButtonGroupProps = {
  value?: string;
  onSubmit: (value: string) => void;
  buttonText: string;
  label: string;
};

export default function InputButtonGroup({
  value = "",
  onSubmit,
  buttonText,
  label,
}: InputButtonGroupProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInputValue = (value: string) => {
    setInputValue(value);
  };

  return (
    <FlexboxGrid>
      <InputGroup>
        <InputGroup.Addon>{label}</InputGroup.Addon>
        <Input value={inputValue} onChange={handleInputValue} />
        <InputGroup.Button
          onClick={() => onSubmit(inputValue)}
          onSubmit={() => onSubmit(inputValue)}
        >
          {buttonText}
        </InputGroup.Button>
      </InputGroup>
    </FlexboxGrid>
  );
}
