import { Button, FlexboxGrid, Form, Notification } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import TextField from "../../components/Forms/TextField";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import { Link, useLocation } from "react-router-dom";
import CommonList from "../../components/Data/CommonList";
import { get } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { useNotificationsContext } from "../../contexts/NotificationsContext";

export default function ProjectsList() {
  const location = useLocation();
  const { token } = useToken();
  const [loaded, setLoaded] = useState(false);
  const { addNotification } = useNotificationsContext();
  const [projects, setProjects] = useState<Array<any>>([]);

  useEffect(() => {
    if (location.state?.notification) {
      addNotification({
        text: location.state.notification,
        notificationProps: { type: location.state?.type ?? "error" },
      });
    }

    get<any>(token, "/projects")
      .then((data) => {
        setProjects(data.data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        console.log(err);
        addNotification({ text: err.message });
      });
  }, []);

  return (
    <StandardLayout title="Projects overview" activePage="Projects">
      <FlexboxGrid className="buttons_container">
        <SimpleCreateModal
          title="New project"
          createPath="/projects/create"
          onSuccess={{ notification: `Project xxx was created succesfully.` }}
        />
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        {projects && !!projects.length ? (
          <CommonList
            items={projects}
            copyable={false}
            entity="project"
            token={token}
            setItems={setProjects}
            onDelete={(items) => {}}
          />
        ) : (
          <p>You don't have any projects yet. Create one now!</p>
        )}
      </ContentLoader>
    </StandardLayout>
  );
}
