import { Button, ButtonToolbar, FlexboxGrid, Form, Notification } from 'rsuite';
import StandardLayout, {
  NotificationInterface,
} from '../../layouts/StandardLayout';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import { Link, useLocation, useNavigation, useParams } from 'react-router-dom';

import { get, post } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';

import PermissionsTable from '../../components/Data/PermissionsTable';
import { useNotificationsContext } from '../../contexts/NotificationsContext';

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

  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    get(token, `/app_role/options/${params.id}`)
      .then((data) => {
        setLoaded(true);
        setAppRole(data);
      })
      .catch((err: Error) => {
        addNotification({ text: 'test' });
      });
  }, []);

  const updateAppRole = (e: Event, role: AppRoleProps) => {
    role.id;
  };

  return (
    <StandardLayout title="Role options" activePage="My Apps">
      <ButtonToolbar className="buttons_container">
        <Button appearance="ghost" as={Link} to={state.backlink}>
          Back
        </Button>
      </ButtonToolbar>

      <ContentLoader loaded={loaded}>
        <h3>{appRole?.name} permissions</h3>
        {!!appRole ? (
          <PermissionsTable
            id={appRole?.id}
            items={appRole?.sectionPermissions}
            token={token}
            label="none yet"
            name="some Name"
            setItems={updateAppRole}
            propsToRender={[]}
          />
        ) : (
          <p>You don't have any apps yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
