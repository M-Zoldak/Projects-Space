import { FlexboxGrid } from "rsuite";
import AppLayout from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import CommonList from "../../components/Data/CommonList";
import { http_methods } from "../../Functions/HTTPMethods";
import ContentLoader from "../../components/Loader";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { ProjectType } from "../../interfaces/EntityTypes/ProjectType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faPerson } from "@fortawesome/free-solid-svg-icons";

export default function ProjectsList() {
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  const { addNotification } = useNotificationsContext();
  const [projects, setProjects] = useState<Array<ProjectType>>([]);

  useEffect(() => {
    setLoaded(false);
    http_methods
      .fetch<ProjectType[]>(`/projects`)
      .then((data) => {
        setProjects(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, [appData]);

  const projectAdditionalInfo = (project: ProjectType) => {
    return (
      <FlexboxGrid style={{ gap: "1rem" }}>
        <FlexboxGridItem>
          <FontAwesomeIcon icon={faBarsProgress} /> State:{" "}
          {project?.projectState?.name ?? "Unset"}
        </FlexboxGridItem>
        {project?.client?.name && (
          <FlexboxGridItem>
            <FontAwesomeIcon icon={faPerson} /> Client: {project?.client?.name}
          </FlexboxGridItem>
        )}
      </FlexboxGrid>
    );
  };

  return (
    <AppLayout title="Projects overview" activePage="Projects">
      <FlexboxGrid className="buttons_container">
        {appData?.currentUser?.currentAppRole.permissions?.projects
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
        <h3>Projects</h3>
        {projects && (
          <CommonList<ProjectType>
            onEmpty="You don't have any projects yet. Create one now!"
            items={projects}
            label={(project) => project.name}
            entity="projects"
            sortingItems={[
              { label: "Project name", value: "name" },
              { label: "Project state", value: ["projectState", "position"] },
              { label: "Client", value: ["client", "name"] },
            ]}
            sortingDefaults={{
              direction: "asc",
              field: "name",
            }}
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
                appData?.currentUser?.currentAppRole.permissions?.projects
                  .deleteable,
              hasOptions:
                appData?.currentUser?.currentAppRole.permissions?.projects
                  .hasOptions,
              hasView:
                appData?.currentUser?.currentAppRole.permissions?.projects
                  .hasView,
            }}
            filters={[
              { label: "Project state", value: "projectState" },
              { label: "Client", value: "client" },
            ]}
            additionalInfo={projectAdditionalInfo}
          />
        )}
        {/* <h3>Projects to delete</h3> */}

        {/* <h3>Archivized projects</h3> */}
      </ContentLoader>
    </AppLayout>
  );
}
