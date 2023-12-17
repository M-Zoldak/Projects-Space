import {
  Button,
  ButtonToolbar,
  FlexboxGrid,
  Input,
  Modal,
  Radio,
  SelectPicker,
} from "rsuite";
import AppLayout from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http_methods } from "../../Functions/HTTPMethods";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppOptionsType, AppType } from "../../interfaces/EntityTypes/AppType";
import { AppRoleType } from "../../interfaces/EntityTypes/AppRoleType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { UserType } from "../../interfaces/EntityTypes/UserType";
import CommonList from "../../components/Data/CommonList";
import { filterOutItem } from "../../Functions/Collections";
import Backlink from "../../components/Buttons/Backlink";
import InputButtonGroup from "../../components/Forms/InputButtonGroup";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { HoverTooltip } from "../../components/Text/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockFour, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faCreativeCommonsBy } from "@fortawesome/free-brands-svg-icons";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import { HostingType } from "../../interfaces/EntityTypes/WebsiteOptionsType";
import { ProjectStateType } from "../../interfaces/EntityTypes/ProjectStateType";
import FluidText from "../../components/Text/FluidText";

export default function Options() {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [app, setApp] = useState<AppType>();
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [defaultRoleId, setDefaultRoleId] = useState("");
  const [appName, setAppName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState("");
  const [appRolesList, setAppRolesList] = useState([]);
  const [emailInvitationPopup, setEmailInvitationPopup] = useState<{
    message: string;
    show: boolean;
  }>();
  const [hostingsList, setHostingsList] = useState<HostingType[]>([]);
  const [newHosting, setNewHosting] = useState<string>("");
  const [projectStatesList, setProjectStatesList] = useState<
    ProjectStateType[]
  >([]);
  const [newProjectState, setNewProjectState] = useState<string>("");

  useEffect(() => {
    http_methods
      .fetch<AppOptionsType>(`/apps/${params.id}/options`)
      .then((data) => {
        setAppRolesList(data.roles);
        setUsers(data.users);
        setInvitedUsers(data.invitedUsers);
        setApp(data.app);
        setHostingsList(data.app.websiteOptions.hostings);
        setDefaultRoleId(data.app.defaultRoleId);
        setProjectStatesList(
          data.app.projectStates.sort((i1, i2) =>
            i1.position > i2.position ? 1 : 0
          )
        );
        setAppName(data.app.name);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
  }, []);

  const createNewRole = () => {
    http_methods
      .post<AppRoleType>(`/app-roles`, {
        name: newRole,
        appId: params.id,
      })
      .then((role) => {
        setAppRolesList([...appRolesList, role]);
        setNewRole("");
      })
      .catch((err: Error) => {
        addNotification({ text: JSON.parse(err.message).name });
      });
  };

  const sendInvitation = async () => {
    await http_methods
      .post<DynamicallyFilledObject<string>>(`/apps/${params.id}/invite`, {
        userEmail: newUser,
      })
      .then((res) => {
        addNotification({
          text: res.message,
          notificationProps: { type: "success" },
        });
        setInvitedUsers([...invitedUsers, res.user]);
      })
      .catch((res) => {
        setEmailInvitationPopup({
          message: JSON.parse(res.message).message,
          show: true,
        });
      });
  };

  const renderInvitationModal = () => {
    return (
      <Modal
        open={emailInvitationPopup.show}
        onClose={() => {
          setEmailInvitationPopup({ ...emailInvitationPopup, show: false });
        }}
      >
        <Modal.Header>
          <Modal.Title>We encountered a small problem...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{emailInvitationPopup.message}</p>
          <h6>Message:</h6>
          <Input
            readOnly
            value="I want to collaborate with you on my Project at Projects Space!"
          />
        </Modal.Body>

        <Modal.Footer>
          {/* <ButtonGroup> */}
          <ButtonToolbar>
            <Button
              appearance="ghost"
              color="green"
              onClick={() =>
                http_methods
                  .post<any>("/apps/invite/email", {
                    userEmail: newUser,
                    message:
                      "I want to collaborate with you on my Project at Projects Space!",
                  })
                  .then((res) => {
                    setEmailInvitationPopup({
                      ...emailInvitationPopup,
                      show: false,
                    });
                    addNotification({
                      text: res.message,
                      notificationProps: { type: "success" },
                    });
                    setNewUser("");
                  })
                  .catch((err: Error) => {
                    addNotification({ text: JSON.parse(err.message).message });
                    setEmailInvitationPopup({
                      ...emailInvitationPopup,
                      show: false,
                    });
                  })
              }
            >
              Send
            </Button>
            <Button appearance="ghost" color="red">
              Abort
            </Button>
          </ButtonToolbar>
          {/* </ButtonGroup> */}
        </Modal.Footer>
      </Modal>
    );
  };

  const updateAppName = (newAppName: string) => {
    http_methods
      .put<AppType>(`/apps/${app.id}`, { name: newAppName })
      .then((appData) => {
        setApp(appData);
      });
  };

  const updateUserAppRole = (appRoleId: number, user: UserType) => {
    http_methods
      .put<UserType>(`/apps/${params.id}/updateUserRole`, {
        appRoleId: appRoleId.toString(),
        userId: user.id,
      })
      .then((user) => {
        let newUsers = users.filter((u) => u.id != user.id);
        setUsers([...newUsers, user]);
      });
  };

  const userAdditionalInfo = (user: UserType) => {
    const userIsActive = users.find((i) => i.id == user.id) ? true : false;

    return (
      <FlexboxGrid>
        <FlexboxGridItem>
          {userIsActive ? (
            <SelectPicker
              size="sm"
              searchable={false}
              value={user.appRole.id}
              cleanable={false}
              data={appRolesList.map((appRole) => {
                return { value: appRole.id, label: appRole.name };
              })}
              disabled={user.appRole.isOwnerRole && user.id == app.ownerId}
              label={
                <>
                  <FontAwesomeIcon icon={faUserTie} /> User role
                </>
              }
              onChange={(val) => updateUserAppRole(val, user)}
            />
          ) : (
            <>
              <FontAwesomeIcon icon={faClockFour} /> Pending...
            </>
          )}
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  };

  const appRoleAdditionalInfo = (item: AppRoleType) => {
    return (
      <FlexboxGrid align="middle">
        <FlexboxGridItem>
          <HoverTooltip text="Check to set as default role for new users">
            <FontAwesomeIcon icon={faCreativeCommonsBy} />{" "}
            <Radio
              checked={item.id == defaultRoleId}
              onClick={() => {
                http_methods
                  .put<AppType>(`/apps/${params.id}/updateDefaultRole`, {
                    defaultRoleId: item.id,
                  })
                  .then((data) => {
                    setDefaultRoleId(data.defaultRoleId);
                  });
              }}
            />
          </HoverTooltip>
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  };

  const addHosting = (name: string) => {
    http_methods
      .post<HostingType>("/websites/hostings", {
        name,
        appId: app.id,
      })
      .then((hoster) => setHostingsList([...hostingsList, hoster]));
  };

  const addProjectState = (name: string) => {
    http_methods
      .post<ProjectStateType>(`/apps/${app.id}/projectState`, {
        name,
      })
      .then((projectState) => {
        setProjectStatesList([...projectStatesList, projectState]);
      });
  };

  const updateProjectStatePositions = () => {
    http_methods.put(
      `/apps/${app.id}/updateProjectStatesPosition`,
      projectStatesList.map((el, index) => ({ ...el, position: index }))
    );
  };

  const handleSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) =>
    setProjectStatesList((prvData) => {
      const moveData = prvData.splice(oldIndex, 1);
      const newData = [...prvData];
      // moveData[0].position = newIndex;
      newData.splice(newIndex, 0, moveData[0]);
      // console.log(newData);
      return newData;
    });

  console.log(projectStatesList);

  return (
    <AppLayout
      title={app?.name ? `App overview` : "Loading..."}
      activePage="My Apps"
    >
      <Backlink link="/apps" />

      <ContentLoader loaded={loaded}>
        <h2>{app?.name} options</h2>
        <InputButtonGroup
          buttonText="Update app name"
          label="App name: "
          value={appName}
          onSubmit={updateAppName}
          onChange={setAppName}
        />
        <h3>Users</h3>
        <CommonList<UserType>
          entity="user"
          onEmpty=""
          sortingItems={[
            { label: "Name", value: "name" },
            { label: "Role", value: ["appRole", "name"] },
          ]}
          sortingDefaults={{ field: "name" }}
          label={(user) => user.name}
          items={[...users, ...invitedUsers]}
          inViewBacklink={`/apps/${params.id}/options`}
          linkPrepend={`/apps/${params.id}`}
          buttons={{
            deleteable: (item: UserType) => app.ownerId != item.id,
            hasOptions: (item: UserType) =>
              !invitedUsers.find((u) => u.id == item.id),
            hasView: false,
          }}
          onDelete={(item) => {
            if (users.find((u) => u.id == item.id)) {
              let newUsers = filterOutItem(users, item);
              setUsers(newUsers);
              addNotification({
                text: `User ${item.name} was removed from App.`,
                notificationProps: { type: "success" },
              });
            } else {
              let newUsers = filterOutItem(invitedUsers, item);
              setInvitedUsers(newUsers);
              addNotification({
                text: `Invitation for ${item.name} was revoked.`,
                notificationProps: { type: "success" },
              });
            }
          }}
          additionalInfo={userAdditionalInfo}
        />
        {appData?.currentUser?.currentAppRole?.permissions?.apps
          ?.hasOptions && (
          <InputButtonGroup
            label="Invite user: "
            value={newUser}
            buttonText="Send Invitation"
            onSubmit={sendInvitation}
            onChange={setNewUser}
          />
        )}
        {emailInvitationPopup?.show && renderInvitationModal()}
        <h3>Roles</h3>
        <CommonList<AppRoleType>
          entity="app-roles"
          items={appRolesList}
          onEmpty=""
          label={(appRole) => appRole.name}
          inViewBacklink={`/apps/${params.id}/options`}
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
        {appData?.currentUser?.currentAppRole?.permissions?.apps
          ?.hasOptions && (
          <InputButtonGroup
            buttonText="Create new"
            label="New role name: "
            onSubmit={createNewRole}
            value={newRole}
            onChange={setNewRole}
          />
        )}

        <h3>Webite options</h3>
        <FluidText>Possible hostings for websites:</FluidText>
        <CommonList<HostingType>
          // emptyCollectiontext="There are no hostings specified for websites"
          // itemsList={hostingsList}
          onEmpty="There are no hostings, you can add one."
          onDelete={(hosting) => {
            let newPS = projectStatesList.filter((h) => h.id != hosting.id);
            addNotification({
              text: `Project state ${hosting.name} was deleted.`,
              notificationProps: {
                type: "success",
              },
            });
            setProjectStatesList(newPS);
          }}
          entity="hostings"
          editableLabel
          linkPrepend={`/apps/${app?.id}/`}
          items={hostingsList}
          label={(item) => item.name}
          buttons={{
            hasView: false,
            hasOptions: false,
            deleteable: app?.currentUserRole?.permissions.apps.deleteable,
          }}
        />
        <InputButtonGroup
          buttonText="Add"
          label="New hosting name"
          onSubmit={addHosting}
          value={newHosting}
          onChange={setNewHosting}
        />

        <h3>Project options</h3>
        <FluidText>Project states:</FluidText>
        <CommonList<ProjectStateType>
          sortable
          onSort={handleSortEnd}
          onEmpty="There are no project states yet. Create one."
          editableLabel
          onDelete={(projectState) => {
            let newPS = projectStatesList.filter(
              (ps) => ps.id != projectState.id
            );
            addNotification({
              text: `Project state ${projectState.name} was deleted.`,
              notificationProps: {
                type: "success",
              },
            });
            setProjectStatesList(newPS);
          }}
          entity="projectStates"
          linkPrepend={`/apps/${app?.id}/`}
          items={projectStatesList}
          label={(item) => item.name}
          buttons={{
            hasView: false,
            hasOptions: false,
            deleteable: app?.currentUserRole?.permissions.apps.deleteable,
          }}
        />
        {projectStatesList && (
          <Button
            onClick={updateProjectStatePositions}
            disabled={projectStatesList.length == 0}
          >
            Update positions
          </Button>
        )}
        <InputButtonGroup
          buttonText="Add"
          label="New project state"
          onSubmit={addProjectState}
          value={newProjectState}
          onChange={setNewProjectState}
        />
      </ContentLoader>
    </AppLayout>
  );
}
