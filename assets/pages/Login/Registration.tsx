import { FlexboxGrid, Panel } from "rsuite";
import { useNavigate } from "react-router-dom";
import FormComponent from "../../components/Forms/FormComponent";
import PortalLayout from "../../layouts/PortalLayout";

function Registration() {
  const navigate = useNavigate();

  const handleSuccess = (successData: any) => {
    navigate("/register/confirm");
  };

  return (
    <PortalLayout activePage="register" title="Register" withContainer={false}>
      <FlexboxGrid justify="center" style={{ paddingBlock: "2rem" }}>
        <FlexboxGrid.Item>
          <Panel header={<h3>Registration</h3>} bordered>
            <FormComponent<any> entity="register" onSuccess={handleSuccess} />
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </PortalLayout>
  );
}

export default Registration;
