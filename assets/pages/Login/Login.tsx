import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  Divider,
} from 'rsuite';
import LoginLayout from '../../layouts/LoginLayout';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TextField from '../../components/Forms/TextField';
import useToken from '../../components/App/useToken';
import Dashboard from '../Dashboard';

function Login() {
  const navigate = useNavigate();
  const { token, setToken } = useToken();
  const [errorMessage, setErrorMessage] = useState('');
  const [formValue, setFormValue] = useState({
    username: '',
    password: '',
  });

  const login = async () => {
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(formValue),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setToken(data.token))
      .then(() => true)
      .catch((err) => setErrorMessage(err.getMessage()));

    if (true) return navigate('/dashboard');
  };

  return (
    <LoginLayout>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={12}>
          <Panel header={<h3>Login</h3>} bordered>
            <Form fluid onChange={setFormValue}>
              <TextField name="username" label="Email address" />
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="off"
              />
              <ButtonToolbar>
                <Button
                  appearance="primary"
                  type="submit"
                  onClick={() => login()}
                  onSubmit={() => login()}
                >
                  Sign in
                </Button>
              </ButtonToolbar>
              <Divider />
              <ButtonToolbar>
                <Button appearance="link" as={Link} to="/register">
                  Register
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

export default Login;
