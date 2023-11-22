import { Button, FlexboxGrid } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CommonList, {
  CommonListItemProps,
} from "../../components/Data/CommonList";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { AppType } from "../../interfaces/EntityTypes/AppType";

export default function AppsList() {
  const { appData, setApps } = useAppDataContext();
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
      .then((data) => {
        setApps(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, []);

  return (
    <StandardLayout title="Apps overview" activePage="My Apps">
      <FlexboxGrid className="buttons_container">
        <Button color="green" appearance="ghost" as={Link} to={"/app/create"}>
          Create new App
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        {appData?.apps?.length ? (
          <CommonList<AppType>
            items={appData.apps as CommonListItemProps[]}
            entity="apps"
            userPermissions={appData.currentUser.userPermissions?.apps}
            onDelete={(item) => {
              console.log(item);
              let newApps = appData.apps.filter((app) => app.id != item.id);
              addNotification({
                text: `App ${item.name} was deleted succesfully`,
                notificationProps: { type: "success" },
              });
              setApps(newApps);
            }}
            buttons={{ hasView: false, destroyable: true, hasOptions: true }}
          />
        ) : (
          <p>You don't have any apps yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
