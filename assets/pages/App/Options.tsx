import { Button, FlexboxGrid, Input, InputGroup } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppOptionsType, AppType } from "../../interfaces/EntityTypes/AppType";
import { AppRoleType } from "../../interfaces/EntityTypes/AppRoleType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { UserType } from "../../interfaces/EntityTypes/UserType";
import FormComponent from "../../components/Forms/FormComponent";
import CommonList from "../../components/Data/CommonList";
import { filterOutItem } from "../../Functions/Collections";

export default function Options() {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [app, setApp] = useState<AppType>();
  const [users, setUsers] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [appRolesList, setAppRolesList] = useState([]);

  useEffect(() => {
    http_methods
      .fetch<AppOptionsType>(appData.token, `/apps/${params.id}/options`)
      .then((data) => {
        setAppRolesList(data.roles);
        setUsers(data.users);
        setApp(data.app);
        setFormFields(data.form);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
  }, []);

  const createNewRole = async () => {
    const successData = await http_methods.post<AppRoleType>(
      `/app-roles/create`,
      {
        name: newRole,
        appId: params.id,
      },
      appData.token
    );

    let role = successData;
    setAppRolesList([...appRolesList, role]);
  };

  const sendInvitation = async () => {
    await http_methods.post<any>(
      `/apps/${params.id}/invite`,
      {
        userEmail: newUser,
      },
      appData.token
    );
  };

  const actionOnSuccess = (successData: AppType) => {
    setApp(successData);
    return addNotification({
      text: "Changes were saved.",
      notificationProps: { type: "success" },
    });
  };

  return (
    <StandardLayout
      title={app?.name ? `${app.name} overview` : "Loading..."}
      activePage="My Apps"
    >
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to={"/apps"}>
          Back to overview
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <FormComponent<AppType>
          formData={formFields}
          setFormData={setFormFields}
          onSuccess={actionOnSuccess}
          postPath={`/apps/${params.id}/update`}
        />

        <h3>Users</h3>
        <CommonList<UserType>
          entity="user"
          items={users}
          userPermissions={appData.currentUser.currentAppRole.permissions.apps}
          buttons={{
            deleteable: (item: UserType) => !item.appRole.isOwnerRole,
            hasOptions: true,
            hasView: false,
          }}
          onDelete={(item) => {
            let newUsers = filterOutItem(users, item);
            setAppRolesList(newUsers);
          }}
        />

        {appData.currentUser.currentAppRole.permissions.apps.hasOptions && (
          <FlexboxGrid>
            <InputGroup>
              <InputGroup.Addon>Invite user: </InputGroup.Addon>
              <Input value={newUser} onChange={setNewUser} />
              <InputGroup.Button onClick={sendInvitation}>
                Send invitation
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid>
        )}

        <h3>App Roles</h3>
        <CommonList<AppRoleType>
          entity="app-roles"
          items={appRolesList}
          userPermissions={appData.currentUser.currentAppRole.permissions.apps}
          buttons={{
            deleteable: (item: AppRoleType) => !item.isOwnerRole,
            hasOptions: true,
            hasView: false,
          }}
          onDelete={(item) => {
            let roles = filterOutItem(appRolesList, item);
            setAppRolesList(roles);
          }}
        />

        {appData.currentUser.currentAppRole.permissions.apps.hasOptions && (
          <FlexboxGrid>
            <InputGroup>
              <InputGroup.Addon>New role name: </InputGroup.Addon>
              <Input value={newRole} onChange={setNewRole} />
              <InputGroup.Button onClick={createNewRole}>
                Create new
              </InputGroup.Button>
            </InputGroup>
          </FlexboxGrid>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
