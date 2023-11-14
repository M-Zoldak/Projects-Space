import { Button, FlexboxGrid, Form, Input, InputGroup, Message } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import TextField from '../../components/Forms/TextField';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link, useLocation, useParams } from 'react-router-dom';
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
import { DynamicallyFilledObject } from '../../interfaces/DefaultTypes';

export default function Options() {
  const location = useLocation();
  const params = useParams();
  const { token, setToken } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [appName, setAppName] = useState('');
  const [appRolesList, setAppRolesList] = useState<
    Array<EditableListItemProps>
  >([]);
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );
  const [users, setUsers] = useState<Array<EditableListItemProps>>([]);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    get(token, `/api/app/options/${params.id}`)
      .then((data) => {
        setAppRolesList(data.roles);
        setUsers(data.users);
        setAppName(data.app_name);
        setLoaded(true);
      })
      .catch((err: Error) => {
        setErrorMessages([...errorMessages, { text: err.message }]);
      });
  }, []);

  const createNewRole = async () => {
    const successData = await post(token, `/api/app_role/add`, {
      name: newRole,
      appId: params.id,
    });

    let role = successData.data.app_role as EditableListItemProps;
    setAppRolesList([...appRolesList, role]);
  };

  console.log(appRolesList);
  return (
    <StandardLayout
      title={`${appName} overview`}
      activePage="My Apps"
      messages={errorMessages}
    >
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to={'/apps'}>
          Back to overview
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <h3>Users</h3>
        <EditableList
          entity="user"
          items={users}
          token={token}
          setErrorMessages={setErrorMessages}
          errorMessages={errorMessages}
          propsToShow={[{ name: 'app_role' }]}
          backlink={location.pathname}
        />

        <h3>App Roles</h3>
        <EditableList
          entity="app_role"
          items={appRolesList}
          copyable={false}
          hasOptions={true}
          token={token}
          setErrorMessages={setErrorMessages}
          errorMessages={errorMessages}
          backlink={location.pathname}
        />
        <FlexboxGrid>
          <InputGroup>
            <InputGroup.Addon>New role name: </InputGroup.Addon>
            <Input value={newRole} onChange={setNewRole} />
            <InputGroup.Button onClick={createNewRole}>
              Create new
            </InputGroup.Button>
          </InputGroup>
          {/* <Input  /> <Button>Create new</Button> */}
        </FlexboxGrid>
      </ContentLoader>
    </StandardLayout>
  );
}
