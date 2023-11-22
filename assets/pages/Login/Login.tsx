import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  Divider,
} from "rsuite";
import LoginLayout from "../../layouts/LoginLayout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import TextField from "../../components/Forms/TextField";
import Dashboard from "../Dashboard";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { http_methods } from "../../Functions/Fetch";
import { UserType } from "../../interfaces/EntityTypes/UserType";
import { AppType } from "../../interfaces/EntityTypes/AppType";

function Login() {
  const navigate = useNavigate();
  const { setToken, setUser, setApps, setAppId } = useAppDataContext();
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });

  const login = async () => {
    let token = await http_methods
      .post<any>("/login", formValue)
      .then((data) => {
        setToken(data.token);
        return data.token;
      })
      .catch((err: Error) => console.log(err.message));

    if (token) {
      await http_methods
        .fetch<any>(token, "/initial_data")
        .then((data: { user: UserType; apps: AppType[] }) => {
          setUser(data.user);
          setApps(data.apps);
          setAppId(data.user?.options?.currentAppId ?? data.apps[0].id);
        });

      if (true) return navigate("/dashboard");
    }
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
