import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  DatePicker,
  Divider,
} from "rsuite";
import LoginLayout from "../../layouts/LoginLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../../components/Forms/FormComponent";
import { http_methods } from "../../Functions/Fetch";
import { FormDataType } from "../../interfaces/FormDataType";

function Registration() {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState([]);

  useEffect(() => {
    http_methods.fetch<Array<FormDataType>>("", "/register").then((res) => {
      setFormValue(res);
    });
  }, []);

  const handleSuccess = (successData: any) => {
    navigate("/register/confirm");
  };

  return (
    <LoginLayout>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item>
          <Panel header={<h3>Registration</h3>} bordered>
            {formValue ? (
              <FormComponent<any>
                formData={formValue}
                postPath="/register"
                setFormData={setFormValue}
                onSuccess={handleSuccess}
              ></FormComponent>
            ) : (
              "Loading..."
            )}
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </LoginLayout>
  );
}

export default Registration;
