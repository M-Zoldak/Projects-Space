import { Button, ButtonToolbar, FlexboxGrid, Form, Message } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link, useLocation, useNavigation, useParams } from 'react-router-dom';

import { get, post } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';

import PermissionsTable from '../../components/Data/PermissionsTable';

type AppRoleProps = {
  id: string;
  name: string;
  destroyable: boolean;
  copyable: boolean;
  sectionPermissions: Array<SectionPermissionsProps>;
};

type SectionPermissionsProps = {
  id: string;
  roleId: string;
  sectionName: string;
  delete: boolean;
  read: boolean;
  edit: boolean;
};

export default function OptionsAppRole() {
  const params = useParams();
  const { state } = useLocation();
  const { token, setToken } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [appRole, setAppRole] = useState<AppRoleProps>();

  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );

  useEffect(() => {
    get(token, `/api/app_role/options/${params.id}`)
      .then((data) => {
        setLoaded(true);
        setAppRole(data);
      })
      .catch((err: Error) => {
        setErrorMessages([...errorMessages, { text: err.message }]);
      });
  }, []);

  const updateAppRole = (e: Event, role: AppRoleProps) => {
    role.id;
  };

  console.log(appRole);
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
        <h3>{appRole?.name} permissions</h3>
        <PermissionsTable
          id={appRole?.id}
          items={appRole?.sectionPermissions}
          token={token}
          label="none yet"
          name="some Name"
          setItems={updateAppRole}
          // setErrorMessages={setErrorMessages}
          // errorMessages={errorMessages}
          propsToRender={[]}
        />
      </ContentLoader>
    </StandardLayout>
  );
}
