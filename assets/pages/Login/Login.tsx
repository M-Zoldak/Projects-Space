import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  Divider,
  SelectPicker,
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
import { useCookies } from "react-cookie";

function Login() {
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();
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
        setCookie("token", data.token, { maxAge: 300, secure: true });
        initializeAppData(data.appData.apps, data.appData.user);
      })
      .then(() => navigate("/dashboard", { unstable_flushSync: true }))
      .catch((err: Error) => setErrorMsg("Invalid email or password."));
  };

  const setFakeAccount = (email: string) => {
    setFormValue({ username: email, password: "a123456789." });
  };

  return (
    <PortalLayout activePage="login" title="Login" withContainer={false}>
      <FlexboxGrid justify="center" style={{ paddingBlock: "2rem" }}>
        <FlexboxGrid.Item colspan={12}>
          <SelectPicker
            style={{ position: "absolute", right: "1rem", top: "1rem" }}
            label="Choose fake account"
            searchable={false}
            data={[
              { label: "Fake user 1", value: "fakeemail1@fake.com" },
              { label: "Fake user 2", value: "fakeemail2@fake.com" },
              { label: "Fake user 3", value: "fakeemail3@fake.com" },
              { label: "Fake user 4", value: "fakeemail4@fake.com" },
            ]}
            onChange={setFakeAccount}
          />
          <Panel header={<h3>Login</h3>} bordered>
            <Form fluid>
              <TextField
                name="username"
                label="Email"
                value={formValue.username}
                onChange={(username: string) =>
                  setFormValue({ ...formValue, username })
                }
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="off"
                value={formValue.password}
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
