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
import ContentLoader from "../../components/Loader";

function Registration() {
  const navigate = useNavigate();

  const handleSuccess = (successData: any) => {
    navigate("/register/confirm");
  };

  return (
    <LoginLayout>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item>
          <Panel header={<h3>Registration</h3>} bordered>
            {/* <ContentLoader loaded={loaded}> */}
            <FormComponent<any> entity="register" onSuccess={handleSuccess} />
            {/* </ContentLoader> */}
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </LoginLayout>
  );
}

export default Registration;
