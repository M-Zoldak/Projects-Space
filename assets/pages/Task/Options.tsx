import { useParams } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import { http_methods } from "../../Functions/HTTPMethods";
import { useAppDataContext } from "../../contexts/AppDataContext";
import Backlink from "../../components/Buttons/Backlink";
import { ButtonToolbar } from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import MainTitle from "../../components/Text/MainTitle";
import FormComponent from "../../components/Forms/FormComponent";
import { TaskType } from "../../interfaces/EntityTypes/TaskType";

export default function TaskOptions() {
  const params = useParams();
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [task, setTask] = useState<TaskType>(null);
  // const [tasks, setTasks] = useState<TaskType[]>(null);

  useEffect(() => {
    http_methods
      .fetch<TaskType>(`/projects/${params.id}/tasks/${params.taskId}`)
      .then(setTask);
  }, []);

  return (
    <AppLayout title="Task options" activePage="Projects">
      <ButtonToolbar>
        <Backlink link={`/projects/${params.id}`} />
      </ButtonToolbar>
      <MainTitle>{task && `${task.name} settings`}</MainTitle>
      <FormComponent<TaskType>
        entity="tasks"
        prependQuery={`/projects/${params.id}`}
        updatePath={{ id: params.taskId }}
        onSuccess={(task) => {
          setTask(task);
          addNotification({
            text: `Task was succesfully updated.`,
            notificationProps: { type: "success" },
          });
        }}
      />
    </AppLayout>
  );
}
