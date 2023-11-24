import { Button, ButtonToolbar, FlexboxGrid, Form, Notification } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigation, useParams } from "react-router-dom";

import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";

import PermissionsTable from "../../components/Data/PermissionsTable";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppRoleType } from "../../interfaces/EntityTypes/AppRoleType";
import { useAppDataContext } from "../../contexts/AppDataContext";

export default function OptionsAppRole() {
  const params = useParams();
  const { state } = useLocation();
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  const [appRole, setAppRole] = useState<AppRoleType>();

  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    http_methods
      .fetch<AppRoleType>(
        appData.token,
        `apps/${params.appId}/app-roles/${params.roleId}/options`
      )
      .then((data) => {
        setLoaded(true);
        setAppRole(data);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
  }, []);

  const updateAppRole = (e: Event, role: AppRoleType) => {
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
            id={appRole?.id.toString()}
            items={appRole.permissions}
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
