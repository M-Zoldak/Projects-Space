import { useParams } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import { http_methods } from "../../Functions/HTTPMethods";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { WebsiteType } from "../../interfaces/EntityTypes/WebsiteType";
import Backlink from "../../components/Buttons/Backlink";
import { ButtonToolbar } from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import MainTitle from "../../components/Text/MainTitle";
import FormComponent from "../../components/Forms/FormComponent";

export default function WebsiteOptions() {
  const params = useParams();
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [website, setWebsite] = useState<WebsiteType>(null);
  // const [tasks, setTasks] = useState<TaskType[]>(null);

  useEffect(() => {
    http_methods.fetch<WebsiteType>(`/websites/${params.id}`).then(setWebsite);
  }, []);

  return (
    <AppLayout title="Website options" activePage="Websites">
      <ButtonToolbar>
        <Backlink link="/websites" />
      </ButtonToolbar>
      <MainTitle>{website && `${website.domain} settings`}</MainTitle>
      <FormComponent<WebsiteType>
        entity="websites"
        updatePath={{ id: params.id }}
        onSuccess={(website) => {
          setWebsite(website);
          addNotification({
            text: `Website was succesfully updated.`,
            notificationProps: { type: "success" },
          });
        }}
      />
    </AppLayout>
  );
}
