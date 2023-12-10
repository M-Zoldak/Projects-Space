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
import {
  faBuilding,
  faExternalLink,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";

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

  const websiteAdditionalInfo = (website: WebsiteType) => {
    return (
      <FlexboxGrid style={{ gap: "1rem" }}>
        <FlexboxGridItem>
          <FontAwesomeIcon icon={faPerson} /> Client:{" "}
          {website?.client?.name ?? "No client"}
        </FlexboxGridItem>
        <FlexboxGridItem>
          <FontAwesomeIcon icon={faBuilding} /> Hosting:{" "}
          {website?.hosting?.name ?? "No hosting"}
        </FlexboxGridItem>
      </FlexboxGrid>
    );
  };

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
        <CommonList<WebsiteType>
          onEmpty="You don't have any websites yet. Add one now!"
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
            hasView: false,
          }}
          additionalInfo={websiteAdditionalInfo}
        />
      </ContentLoader>
    </StandardLayout>
  );
}
