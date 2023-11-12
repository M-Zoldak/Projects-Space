import { Form } from 'rsuite';
import FormError from './FormError';

export default function TextField(props: any) {
  const { name, label, accepter, error, value, ...rest } = props;

  console.log(error);
  return (
    <Form.Group controlId={`${name}`}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        defaultValue={value}
        name={name}
        accepter={accepter}
        {...rest}
      />

      <FormError error={error} />
    </Form.Group>
  );
}
