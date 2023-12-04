import { Button, FlexboxGrid, SelectPicker } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CommonList from "../../components/Data/CommonList";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { AppType } from "../../interfaces/EntityTypes/AppType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { HoverTooltip } from "../../components/Text/Tooltip";

export default function AppsList() {
  const { appData, refreshAppData } = useAppDataContext();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const { addNotification } = useNotificationsContext();
  const [appsInvitations, setAppsInvitations] = useState<AppType[]>([]);

  useEffect(() => {
    if (location.state?.notification) {
      addNotification({
        text: location.state.notification,
        notificationProps: { type: location.state?.type ?? "error" },
      });
    }

    http_methods
      .fetch<{ apps: AppType[]; appsInvitations: AppType[] }>(
        appData.token,
        "/apps"
      )
      .then(async (appsData) => {
        await refreshAppData();
        setLoaded(true);
        setAppsInvitations(appsData.appsInvitations);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, []);

  const handleDelete = (item: AppType) => {
    addNotification({
      text: `App ${item.name} was deleted succesfully`,
      notificationProps: { type: "success" },
    });
    refreshAppData();
  };

  const appAdditionalInfo = (item: AppType) => {
    return (
      <FlexboxGrid>
        <FlexboxGridItem>
          <HoverTooltip text="Users in space">
            <FontAwesomeIcon icon={faUser} /> {item.statistics.usersCount}
          </HoverTooltip>
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  };

  const acceptInvitation = (item: AppType) => {
    http_methods
      .post("/apps/invite/accept", { appId: item.id }, appData.token)
      .then(async (res) => {
        addNotification({
          text: `You have joined ${item.name} space!`,
          notificationProps: { type: "success" },
        });

        await refreshAppData();
        setAppsInvitations(appsInvitations.filter((inv) => inv.id != item.id));
      });
  };

  return (
    <StandardLayout title="My apps" activePage="My Apps">
      <FlexboxGrid className="buttons_container">
        <Button color="green" appearance="ghost" as={Link} to={"/apps/create"}>
          Create new Space
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <h3>Active Spaces</h3>
        {appData?.apps?.length ? (
          <CommonList<AppType>
            items={appData.apps}
            entity="apps"
            userPermissions={
              appData.currentUser.currentAppRole.permissions.apps
            }
            onDelete={handleDelete}
            buttons={{ hasView: false, deleteable: true, hasOptions: true }}
            additionalInfo={appAdditionalInfo}
          />
        ) : (
          <p>
            You don't have any apps yet. Create one now or join someones other
            space!
          </p>
        )}

        {appsInvitations && (
          <>
            <h3>Invitations to spaces</h3>
            <CommonList<AppType>
              items={appsInvitations}
              entity="apps"
              userPermissions={
                appData.currentUser.currentAppRole.permissions.apps
              }
              onDelete={handleDelete}
              // buttons={{ hasView: false, deleteable: true, hasOptions: true }}
              ownButtons={(item: AppType) => (
                <Button
                  appearance="ghost"
                  size="sm"
                  color="cyan"
                  onClick={() => acceptInvitation(item)}
                >
                  Join space
                </Button>
              )}
              additionalInfo={appAdditionalInfo}
            />
          </>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
