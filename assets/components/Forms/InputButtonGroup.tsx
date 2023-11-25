import { FlexboxGrid, Input, InputGroup } from "rsuite";

export default function InputButtonGroup({
  value,
  onChange,
  onSubmit,
  buttonText,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  buttonText: string;
  label: string;
}) {
  return (
    <FlexboxGrid>
      <InputGroup>
        <InputGroup.Addon>{label}</InputGroup.Addon>
        <Input value={value} onChange={(val) => onChange(val)} />
        <InputGroup.Button onClick={onSubmit} onSubmit={onSubmit}>
          {buttonText}
        </InputGroup.Button>
      </InputGroup>
    </FlexboxGrid>
  );
}
