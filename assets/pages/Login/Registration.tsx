import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  DatePicker,
  Divider,
} from 'rsuite';
import LoginLayout from '../../layouts/LoginLayout';
import { useState } from 'react';
import { Link, Navigate, redirect, useNavigate } from 'react-router-dom';
import FormError from '../../components/Forms/FormError';
import TextField from '../../components/Forms/TextField';

function Registration() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verifyPassword: '',
    birthDate: null,
  });

  const [formValue, setFormValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verifyPassword: '',
    birthDate: null,
  });

  const handleSubmit = () => {
    fetch('/api/user/create', {
      method: 'POST',
      body: JSON.stringify(formValue),
      headers: {
        'Content-Type': 'text/json',
      },
    })
      .then((res: Response) => {
        if (res.status == 422) return Promise.reject(res);
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('spa_app_username', data.user_data.username);
      })
      .then(() => navigate('/register/confirm'))
      .catch((res: Response) => {
        res.json().then((data) => {
          setFormError(data);
        });
      });
  };

  return (
    <LoginLayout>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item>
          <Panel header={<h3>Registration</h3>} bordered>
            <Form
              onChange={setFormValue}
              onCheck={setFormError}
              formValue={formValue}
            >
              <TextField
                name="firstName"
                label="First Name"
                autoComplete="off"
                error={formError.firstName}
              />

              <TextField
                name="lastName"
                label="Last Name"
                autoComplete="off"
                error={formError.lastName}
              />

              <Form.Group controlId="birthDate">
                <Form.ControlLabel>Date of birth</Form.ControlLabel>
                <Form.Control
                  name="birthDate"
                  accepter={DatePicker}
                  format="yyyy-MM-dd"
                />
                <FormError error={formError.birthDate} />
              </Form.Group>

              <TextField
                name="email"
                label="Email"
                autoComplete="off"
                error={formError.email}
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="off"
                error={formError.password}
              />

              <TextField
                name="verifyPassword"
                label="Verify password"
                type="password"
                autoComplete="off"
                error={formError.verifyPassword}
              />

              <ButtonToolbar>
                <Button
                  appearance="primary"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </ButtonToolbar>

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
