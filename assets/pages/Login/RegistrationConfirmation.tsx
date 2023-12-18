import { FlexboxGrid, Panel } from "rsuite";
import FluidText from "../../components/Text/FluidText";
import { Link, useLocation, useNavigation } from "react-router-dom";
import PortalLayout from "../../layouts/PortalLayout";

function RegistrationConfirmation() {
  const location = useLocation();
  const username = location.state.name;

  return (
    <PortalLayout activePage="register" title="Register">
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={12}>
          <Panel header={<h3>Congratulations!</h3>} bordered>
            <FluidText>
              Your account have been created
              {username != "undefined" ? ` ${username}!` : "."} <br />
              You can now proceed to <Link to="/login">login page</Link>.
            </FluidText>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </PortalLayout>
  );
}

export default RegistrationConfirmation;
