import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  Schema,
  FormInstance,
  DatePicker,
  Divider,
} from 'rsuite';
import LoginLayout from '../../layouts/LoginLayout';
import { Ref, forwardRef, useRef, useState } from 'react';
import { Link, redirect } from 'react-router-dom';
const { StringType, NumberType, DateType } = Schema.Types;

const model = Schema.Model({
  firstName: StringType().isRequired('This field is required.'),
  lastName: StringType().isRequired('This field is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
  birthDate: DateType().isRequired('This field is required'),
  password: StringType().isRequired('This field is required.'),
  verifyPassword: StringType()
    .addRule((value, data) => {
      if (value !== data.password) {
        return false;
      }

      return true;
    }, 'The two passwords do not match')
    .isRequired('This field is required.'),
});

const TextField = forwardRef((props: any, ref: Ref<any>) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
});

function Registration() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const formRef = useRef<FormInstance>();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verifyPassword: '',
    birthDate: null,
  });

  const handleSubmit = async () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }

    await registerUser();
  };

  const registerUser = () => {
    fetch('/api/user/create', {
      method: 'POST',
      body: JSON.stringify(formValue),
      headers: {
        'Content-Type': 'text/json',
      },
    }).then((res: Response) =>
      res.status == 200 ? redirect('/dashboard') : tellAboutProblems(res.json())
    );
  };

  //   const handleCheckEmail = () => {
  //     formRef.current.checkForField('email', (checkResult: any) => {
  //       console.log(checkResult);
  //     });
  //   };

  const tellAboutProblems = (problems: any) => {
    if (problems.passwordVerify) {
    }
  };

  return (
    <LoginLayout>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item>
          <Panel header={<h3>Registration</h3>} bordered>
            <Form
              ref={formRef}
              onChange={setFormValue}
              onCheck={setFormError}
              formValue={formValue}
              model={model}
            >
              <TextField
                name="firstName"
                label="First Name"
                autoComplete="off"
              />
              <TextField name="lastName" label="Last Name" autoComplete="off" />

              <Form.Group controlId="birthDate">
                <Form.ControlLabel>Date of birth</Form.ControlLabel>
                {/* <DatePicker format="yyyy-MM-dd" name="birthDate" /> */}
                <Form.Control
                  name="birthDate"
                  accepter={DatePicker}
                  format="yyyy-MM-dd"
                />
              </Form.Group>

              <TextField name="email" label="Email" autoComplete="off" />
              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="off"
              />
              <TextField
                name="verifyPassword"
                label="Verify password"
                type="password"
                autoComplete="off"
              />

              <ButtonToolbar>
                <Button appearance="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </ButtonToolbar>

              {/* <Button onClick={handleCheckEmail}>Check Email</Button> */}

              <Divider />
              <ButtonToolbar>
                <Button appearance="link" as={Link} to="/login">
                  Login
                </Button>
                <Button appearance="link">Forgot password?</Button>
              </ButtonToolbar>
            </Form>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </LoginLayout>
  );
}

export default Registration;
