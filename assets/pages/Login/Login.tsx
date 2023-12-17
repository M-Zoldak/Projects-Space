import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  Divider,
} from "rsuite";
import Cookies from "js-cookie";
import {
  Link,
  redirect,
  redirectDocument,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import TextField from "../../components/Forms/TextField";
import FormError from "../../components/Forms/FormError";
import PortalLayout from "../../layouts/PortalLayout";
import { http_methods } from "../../Functions/HTTPMethods";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { useAccessControlContext } from "../../contexts/PlaceContext";

function Login() {
  const navigate = useNavigate();
  const { setAccessControl } = useAccessControlContext();
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });
  const { initializeAppData } = useAppDataContext();
  const [errorMsg, setErrorMsg] = useState("");

  const login = async () => {
    await http_methods
      .notTokenizedpost<any>("/login", formValue)
      .then((data) => {
        Cookies.set("token", data.token, { expires: 0.01, secure: true });
        setAccessControl("app");
        initializeAppData(data.appData.apps, data.appData.user);
        console.log(Cookies.get("token"));
      })
      .then(() => navigate("/dashboard"))
      .catch((err: Error) => setErrorMsg("Invalid email or password."));
  };

  return (
    <PortalLayout activePage="login" title="Login" withContainer={false}>
      <FlexboxGrid justify="center" style={{ paddingBlock: "2rem" }}>
        <FlexboxGrid.Item colspan={12}>
          <Panel header={<h3>Login</h3>} bordered>
            <Form fluid>
              <TextField
                name="username"
                label="Email"
                onChange={(username: string) =>
                  setFormValue({ ...formValue, username })
                }
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="off"
                onChange={(password: string) =>
                  setFormValue({ ...formValue, password })
                }
              />
              {errorMsg && (
                <>
                  <FormError error={errorMsg} />
                  <br />
                </>
              )}
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
    </PortalLayout>
  );
}

export default Login;
