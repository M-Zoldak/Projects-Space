import { Button, FlexboxGrid } from "rsuite";
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

  useEffect(() => {
    if (location.state?.notification) {
      addNotification({
        text: location.state.notification,
        notificationProps: { type: location.state?.type ?? "error" },
      });
    }

    http_methods
      .fetchAll<AppType>(appData.token, "/apps")
      .then(async (appsData) => {
        await refreshAppData();
        setLoaded(true);
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

  return (
    <StandardLayout title="My apps" activePage="My Apps">
      <FlexboxGrid className="buttons_container">
        <Button color="green" appearance="ghost" as={Link} to={"/app/create"}>
          Create new Space
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
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
          <p>You don't have any apps yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
