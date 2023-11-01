import {
  FlexboxGrid,
  Panel,
  ButtonToolbar,
  Button,
  Form,
  Content,
} from 'rsuite';
import LoginLayout from '../../layouts/LoginLayout';
import FluidText from '../../components/Text/FluidText';
import { Link } from 'react-router-dom';

function RegistrationConfirmation() {
  const username = localStorage.getItem('spa_app_username');

  return (
    <LoginLayout>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={12}>
          <Panel header={<h3>Congratulations!</h3>} bordered>
            <FluidText>
              Your account have been created
              {username != 'undefined' ? ` ${username}!` : '.'} <br />
              You can now proceed to <Link to="/login">login page</Link>.
            </FluidText>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </LoginLayout>
  );
}

export default RegistrationConfirmation;
