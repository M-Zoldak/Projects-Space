import { Button, FlexboxGrid, Form, Notification } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import TextField from "../../components/Forms/TextField";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import { Link, useLocation } from "react-router-dom";
import CommonList from "../../components/Data/CommonList";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { ProjectType } from "../../interfaces/EntityTypes/ProjectType";
import { useAppDataContext } from "../../contexts/AppDataContext";

export default function ProjectsList() {
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  const { addNotification } = useNotificationsContext();
  const [projects, setProjects] = useState<Array<any>>([]);

  useEffect(() => {
    setLoaded(false);
    http_methods
      .fetchAll<ProjectType>(
        appData.token,
        `/projects?appId=${appData.currentAppId}`
      )
      .then((data) => {
        setProjects(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, [appData.currentAppId]);

  return (
    <StandardLayout title="Projects overview" activePage="Projects">
      <FlexboxGrid className="buttons_container">
        <SimpleCreateModal<ProjectType>
          title="New project"
          createPath="/projects/create"
          onSuccess={(project) => {
            setProjects([...projects, project]);
            addNotification({
              text: `Project ${project.name} was created succesfully!`,
              notificationProps: {
                type: "success",
              },
            });
          }}
        />
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        {projects && projects.length ? (
          <CommonList<ProjectType>
            items={projects}
            entity="project"
            onDelete={(items, item) => {
              setProjects(items);
              addNotification({
                text: `Project ${item.name} was deleted succesfully`,
                notificationProps: { type: "success" },
              });
            }}
          />
        ) : (
          <p>You don't have any projects yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
