import { Form } from 'rsuite';
import FormError from './FormError';

export default function TextField(props: any) {
  const { name, label, accepter, error, ...rest } = props;
  return (
    <Form.Group controlId={`${name}`}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
      <FormError error={error} />
    </Form.Group>
  );
}
