import { useParams } from "react-router-dom";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import { http_methods } from "../../Functions/Fetch";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { ProjectType } from "../../interfaces/EntityTypes/ProjectType";
import Backlink from "../../components/Buttons/Backlink";
import { ButtonToolbar } from "rsuite";
import SimpleCreateModal from "../../components/Modals/SimpleCreateModal";
import { TaskType } from "../../interfaces/EntityTypes/TaskType";
import CommonList from "../../components/Data/CommonList";
import { useNotificationsContext } from "../../contexts/NotificationsContext";

export default function Project() {
  const params = useParams();
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [project, setProject] = useState<ProjectType>(null);
  const [tasks, setTasks] = useState<TaskType[]>(null);

  useEffect(() => {
    http_methods
      .fetch<ProjectType>(appData.token, `/projects/${params.id}`)
      .then(setProject);
  }, []);

  return (
    <StandardLayout title="Project overview" activePage="Projects">
      <ButtonToolbar>
        <Backlink link="/projects" />
        <SimpleCreateModal<TaskType>
          entity="tasks"
          title="Add new task"
          onSuccess={(task) => {
            setTasks([...tasks, task]);
            addNotification({
              text: `Task ${task.name} was created succesfully!`,
              notificationProps: { type: "success" },
            });
          }}
        />
      </ButtonToolbar>
      <h3>{project && project.name}</h3>
      {tasks && (
        <CommonList<TaskType>
          label={(task) => task.name}
          entity="tasks"
          items={tasks}
          onDelete={() => {}}
        />
      )}
    </StandardLayout>
  );
}
