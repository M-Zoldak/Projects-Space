import { FlexboxGrid } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import CommonList from "../../components/Data/CommonList";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { WebsiteType } from "../../interfaces/EntityTypes/WebsiteType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

export default function WebsitesList() {
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  const { addNotification } = useNotificationsContext();
  const [websites, setWebsites] = useState<WebsiteType[]>([]);

  useEffect(() => {
    setLoaded(false);
    http_methods
      .fetchAll<WebsiteType>(appData.token, `/websites`)
      .then((data) => {
        setWebsites(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, [appData]);

  console.log(websites);

  return (
    <StandardLayout title="Websites overview" activePage="Websites">
      <FlexboxGrid className="buttons_container">
        {appData.currentUser.currentAppRole.permissions?.websites
          .hasOptions && (
          <SimpleCreateModal<WebsiteType>
            title="New website"
            entity="websites"
            onSuccess={(website) => {
              setWebsites([...websites, website]);
              addNotification({
                text: `Website ${website?.domain} was created succesfully!`,
                notificationProps: {
                  type: "success",
                },
              });
            }}
          />
        )}
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <h3>Websites</h3>
        {websites?.length ? (
          <CommonList<WebsiteType>
            items={websites}
            label={(website) => (
              <a
                href={new URL("/", `https://www.${website.domain}`).href}
                target="_blank"
              >
                {website.domain}{" "}
                <FontAwesomeIcon size="xs" icon={faExternalLink} />
              </a>
            )}
            entity="websites"
            onDelete={(item) => {
              let newWebsites = websites.filter(
                (website) => website.id != item.id
              );
              setWebsites(newWebsites);
              addNotification({
                text: `Website ${item.domain} was deleted succesfully`,
                notificationProps: { type: "success" },
              });
            }}
            buttons={{
              deleteable:
                appData.currentUser.currentAppRole.permissions?.websites
                  .deleteable,
              hasOptions:
                appData.currentUser.currentAppRole.permissions?.websites
                  .hasOptions,
              hasView:
                appData.currentUser.currentAppRole.permissions?.websites
                  .hasView,
            }}
          />
        ) : (
          <p>You don't have any websites yet. Create one now!</p>
        )}

        {/* <h3>Archivized websites</h3> */}
      </ContentLoader>
    </StandardLayout>
  );
}
