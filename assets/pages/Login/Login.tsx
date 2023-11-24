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
import { useAppDataContext } from "../../contexts/AppDataContext";
import { http_methods } from "../../Functions/Fetch";
import { UserType } from "../../interfaces/EntityTypes/UserType";
import { AppType } from "../../interfaces/EntityTypes/AppType";

function Login() {
  const navigate = useNavigate();
  const { initializeAppData } = useAppDataContext();
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });

  const login = async () => {
    let token = await http_methods
      .post<any>("/login", formValue)
      .then(async (data) => data.token)
      .catch((err: Error) => console.log(err.message));

    let dataLoaded = await initializeAppData(token);

    if (dataLoaded) {
      return navigate("/dashboard");
    } else {
      throw new Error("Necessary data couldn't be loaded");
    }
    // })
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
