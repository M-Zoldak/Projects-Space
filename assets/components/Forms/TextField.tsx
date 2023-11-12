import { Form } from 'rsuite';
import FormError from './FormError';

export default function TextField(props: any) {
  const { name, label, accepter, error, value, onChange, ...rest } = props;

  return (
    <Form.Group controlId={`${name}`}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        value={value}
        name={name}
        accepter={accepter}
        onChange={(val, e) => onChange(val, e)}
        {...rest}
      />

      <FormError error={error} />
    </Form.Group>
  );
}
