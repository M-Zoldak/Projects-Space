import { FlexboxGrid } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
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
      .fetchAll<ProjectType>(appData.token, `/projects`)
      .then((data) => {
        setProjects(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, [appData]);

  return (
    <StandardLayout title="Projects overview" activePage="Projects">
      <FlexboxGrid className="buttons_container">
        {appData.currentUser.currentAppRole.permissions?.projects
          .hasOptions && (
          <SimpleCreateModal<ProjectType>
            title="New project"
            entity="projects"
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
        )}
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <h3>Active projects</h3>
        {projects?.length ? (
          <CommonList<ProjectType>
            items={projects}
            label={(project) => project.name}
            entity="projects"
            onDelete={(item) => {
              let newProjects = projects.filter(
                (project) => project.id != item.id
              );
              setProjects(newProjects);
              addNotification({
                text: `Project ${item.name} was deleted succesfully`,
                notificationProps: { type: "success" },
              });
            }}
            buttons={{
              deleteable:
                appData.currentUser.currentAppRole.permissions?.projects
                  .deleteable,
              hasOptions:
                appData.currentUser.currentAppRole.permissions?.projects
                  .hasOptions,
              hasView:
                appData.currentUser.currentAppRole.permissions?.projects
                  .hasView,
            }}
          />
        ) : (
          <p>You don't have any projects yet. Create one now!</p>
        )}
        <h3>Projects to delete</h3>

        <h3>Archivized projects</h3>
      </ContentLoader>
    </StandardLayout>
  );
}
