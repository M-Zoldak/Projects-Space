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

  console.log(appData.currentUser);

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
        {projects?.length ? (
          <CommonList<ProjectType>
            items={projects}
            entity="projects"
            userPermissions={
              appData.currentUser.currentAppRole.permissions?.projects
            }
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
          />
        ) : (
          <p>You don't have any projects yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
