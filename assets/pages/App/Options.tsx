import { Button, FlexboxGrid, Input, InputGroup } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import { Link, useLocation, useParams } from "react-router-dom";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import EditableList, {
  EditableListItemProps,
} from "../../components/Forms/EditableList";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppOptionsType, AppType } from "../../interfaces/EntityTypes/AppType";
import { AppRoleType } from "../../interfaces/EntityTypes/AppRoleType";

export default function Options() {
  const location = useLocation();
  const params = useParams();
  const { token } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [appName, setAppName] = useState("");
  const [appRolesList, setAppRolesList] = useState<
    Array<EditableListItemProps>
  >([]);
  const { addNotification } = useNotificationsContext();
  const [users, setUsers] = useState<Array<EditableListItemProps>>([]);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    http_methods
      .fetch<AppOptionsType>(token, `/apps/options/${params.id}`)
      .then((data) => {
        setAppRolesList(data.roles);
        setUsers(data.users);
        setAppName(data.app_name);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
  }, []);

  const createNewRole = async () => {
    const successData = await http_methods.post<AppRoleType>(
      token,
      `/app_role/add`,
      {
        name: newRole,
        appId: params.id,
      }
    );

    let role = successData as EditableListItemProps;
    setAppRolesList([...appRolesList, role]);
  };

  console.log(appRolesList);
  return (
    <StandardLayout title={`${appName} overview`} activePage="My Apps">
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to={"/apps"}>
          Back to overview
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <h3>Users</h3>
        <EditableList
          entity="user"
          items={users}
          token={token}
          propsToShow={[{ name: "app_role" }]}
          backlink={location.pathname}
        />

        <h3>App Roles</h3>
        <EditableList
          entity="app_role"
          items={appRolesList}
          copyable={false}
          hasView={true}
          token={token}
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
