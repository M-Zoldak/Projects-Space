import { Button, FlexboxGrid, Input, InputGroup } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import EditableList, {
  EditableListItemProps,
} from "../../components/Forms/EditableList";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppOptionsType, AppType } from "../../interfaces/EntityTypes/AppType";
import { AppRoleType } from "../../interfaces/EntityTypes/AppRoleType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { UserType } from "../../interfaces/EntityTypes/UserType";
import FormComponent from "../../components/Forms/FormComponent";

export default function Options() {
  const { appData } = useAppDataContext();
  const location = useLocation();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [app, setApp] = useState<AppType>();
  const { addNotification } = useNotificationsContext();
  const [users, setUsers] = useState<EditableListItemProps[]>([]);
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [appRolesList, setAppRolesList] = useState<EditableListItemProps[]>([]);

  useEffect(() => {
    http_methods
      .fetch<AppOptionsType>(appData.token, `/apps/options/${params.id}`)
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
      `/app_role/add`,
      {
        name: newRole,
        appId: params.id,
      },
      appData.token
    );

    let role = successData as EditableListItemProps;
    setAppRolesList([...appRolesList, role]);
  };

  const sendInvitation = async () => {
    await http_methods.post<any>(
      `/app/invite`,
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
        <EditableList<UserType>
          entity="user"
          items={users}
          // propsToShow={[{ name: "app_role" }]}
          backlink={location.pathname}
          userPermissions={appData.currentUser.userPermissions.apps}
        />
        <FlexboxGrid>
          <InputGroup>
            <InputGroup.Addon>Invite user: </InputGroup.Addon>
            <Input value={newUser} onChange={setNewUser} />
            <InputGroup.Button onClick={sendInvitation}>
              Send invitation
            </InputGroup.Button>
          </InputGroup>
          {/* <Input  /> <Button>Create new</Button> */}
        </FlexboxGrid>

        <h3>App Roles</h3>
        <EditableList<AppRoleType>
          entity="app_role"
          items={appRolesList}
          backlink={location.pathname}
          userPermissions={appData.currentUser.userPermissions.apps}
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
