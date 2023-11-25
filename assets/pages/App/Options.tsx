import { Button, FlexboxGrid, Input, InputGroup, Radio } from "rsuite";
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
import Backlink from "../../components/Buttons/Backlink";
import InputButtonGroup from "../../components/Forms/InputButtonGroup";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { HoverTooltip } from "../../components/Text/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faCreativeCommonsBy } from "@fortawesome/free-brands-svg-icons";

export default function Options() {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [app, setApp] = useState<AppType>();
  const [users, setUsers] = useState([]);
  const [defaultRoleId, setDefaultRoleId] = useState("");
  const [appName, setAppName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState("");
  const [appRolesList, setAppRolesList] = useState([]);

  useEffect(() => {
    http_methods
      .fetch<AppOptionsType>(appData.token, `/apps/${params.id}/options`)
      .then((data) => {
        setAppRolesList(data.roles);
        setUsers(data.users);
        setApp(data.app);
        setDefaultRoleId(data.app.defaultRoleId);
        setAppName(data.app.name);
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
    setNewRole("");
  };

  const sendInvitation = async () => {
    await http_methods.post<any>(
      `/apps/${params.id}/invite`,
      {
        userEmail: newUser,
      },
      appData.token
    );
    setNewUser("");
  };

  const updateAppName = () => {
    http_methods
      .put<AppType>(`/apps/${app.id}`, { name: appName }, appData.token)
      .then((appData) => {
        setApp(appData);
      });
  };

  const userAdditionalInfo = (item: UserType) => {
    return (
      <FlexboxGrid>
        <FlexboxGridItem>
          <HoverTooltip text="User role">
            <FontAwesomeIcon icon={faUserTie} /> {item.appRole.name}
          </HoverTooltip>
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  };

  const appRoleAdditionalInfo = (item: AppRoleType) => {
    return (
      <FlexboxGrid align="middle">
        <FlexboxGridItem>
          <HoverTooltip text="Click to choose as default role for new users">
            <FontAwesomeIcon icon={faCreativeCommonsBy} />{" "}
            <Radio
              checked={item.id == defaultRoleId}
              onClick={() => {
                http_methods
                  .put<AppType>(
                    `/apps/${params.id}/updateDefaultRole`,
                    {
                      defaultRoleId: item.id,
                    },
                    appData.token
                  )
                  .then((data) => {
                    setDefaultRoleId(data.defaultRoleId);
                  });
              }}
            ></Radio>
          </HoverTooltip>
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  };

  return (
    <StandardLayout
      title={app?.name ? `App overview` : "Loading..."}
      activePage="My Apps"
    >
      <Backlink link="/apps" />

      <ContentLoader loaded={loaded}>
        <h2>{app?.name} options</h2>

        <InputButtonGroup
          buttonText="Update app name"
          label="App name: "
          onChange={(val) => setAppName(val)}
          value={appName}
          onSubmit={updateAppName}
        />

        <h3>Users</h3>
        <CommonList<UserType>
          entity="user"
          items={users}
          inViewBacklink={`/apps/${params.id}/options`}
          userPermissions={appData.currentUser.currentAppRole.permissions.apps}
          linkPrepend={`/apps/${params.id}`}
          buttons={{
            deleteable: (item: UserType) => !item.appRole.isOwnerRole,
            hasOptions: true,
            hasView: false,
          }}
          onDelete={(item) => {
            let newUsers = filterOutItem(users, item);
            setAppRolesList(newUsers);
          }}
          additionalInfo={userAdditionalInfo}
        />

        {appData.currentUser.currentAppRole.permissions.apps.hasOptions && (
          <InputButtonGroup
            label="Invite user: "
            value={newUser}
            onChange={(val: string) => setNewUser(val)}
            buttonText="Send Invitation"
            onSubmit={sendInvitation}
          />
        )}

        <h3>Roles</h3>
        <CommonList<AppRoleType>
          entity="app-roles"
          items={appRolesList}
          inViewBacklink={`/apps/${params.id}/options`}
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
          additionalInfo={appRoleAdditionalInfo}
        />

        {appData.currentUser.currentAppRole.permissions.apps.hasOptions && (
          <InputButtonGroup
            buttonText="Create new"
            label="New role name: "
            onChange={(val) => setNewRole(val)}
            onSubmit={createNewRole}
            value={newRole}
          />
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
