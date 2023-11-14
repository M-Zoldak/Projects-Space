import { Button, ButtonToolbar, FlexboxGrid, Form, Message } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import TextField from '../../components/Forms/TextField';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link, useLocation, useNavigation, useParams } from 'react-router-dom';
import CommonList, {
  CommonListItemProps,
} from '../../components/Data/CommonList';
import { get, post } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';
import { SubmitCallbackFullfillmentProps } from '../../components/Forms/FormComponent';
import EditableList, {
  EditableListItemProps,
} from '../../components/Forms/EditableList';
import EditableTable from '../../components/Data/EditableTable';
import { extraPropsToShow } from '../../components/Forms/EditableList';

export default function OptionsAppRole() {
  const params = useParams();
  const { state } = useLocation();
  const { token, setToken } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [appRole, setAppRole] = useState<Array<EditableListItemProps>>([]);
  const [appRoleName, setAppRoleName] = useState('');
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );

  useEffect(() => {
    get(token, `/api/app_role/options/${params.id}`)
      .then((data) => {
        setAppRoleName(data.name);
        setAppRole(data.app_role);
        setLoaded(true);
      })
      .catch((err: Error) => {
        setErrorMessages([...errorMessages, { text: err.message }]);
      });
  }, []);

  return (
    <StandardLayout
      title="Role options"
      activePage="My Apps"
      messages={errorMessages}
    >
      <ButtonToolbar className="buttons_container">
        <Button appearance="ghost" as={Link} to={state.backlink}>
          Back
        </Button>
      </ButtonToolbar>

      <ContentLoader loaded={loaded}>
        <h3>{appRoleName} permissions</h3>
        <EditableTable
          entity="app_role"
          items={appRole}
          token={token}
          setErrorMessages={setErrorMessages}
          errorMessages={errorMessages}
          propsToRender={[
            { name: 'not_exist', readableName: 'Projects permissions' },
          ]}
          // backlink={location.pathname}
          // creator={true}
        />
      </ContentLoader>
    </StandardLayout>
  );
}
