import { useParams } from "react-router-dom";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import ContentLoader from "../../components/Loader";
import Backlink from "../../components/Buttons/Backlink";
import MainTitle from "../../components/Text/MainTitle";
import FormComponent from "../../components/Forms/FormComponent";
import { ProjectType } from "../../interfaces/EntityTypes/ProjectType";
import { http_methods } from "../../Functions/HTTPMethods";

export default function ProjectOptions() {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [project, setProject] = useState(null);

  useEffect(() => {
    setLoaded(false);
    http_methods.fetch(`/projects/${params.id}`).then(setProject);
    setLoaded(true);
  }, []);

  return (
    <AppLayout
      title={project ? `${project?.project.name} options` : "Loading..."}
      activePage="Projects"
    >
      <Backlink link={`/projects`} />

      <ContentLoader loaded={loaded}>
        <FormComponent<ProjectType>
          entity="projects"
          updatePath={{ id: params.id }}
          onSuccess={(project) => {
            // setAddress(address);
            addNotification({
              text: `Project was succesfully updated.`,
              notificationProps: { type: "success" },
            });
          }}
        />
      </ContentLoader>
    </AppLayout>
  );
}
