import { Button, FlexboxGrid } from "rsuite";
import { useEffect, useState } from "react";
import FormComponent from "../../components/Forms/FormComponent";
import { Link, useNavigate } from "react-router-dom";
import { http_methods } from "../../Functions/HTTPMethods";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import AppLayout from "../../layouts/AppLayout";
import { FormDataType } from "../../interfaces/FormDataType";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { AppType } from "../../interfaces/EntityTypes/AppType";

export default function Create() {
  const navigate = useNavigate();
  const { appData, updateApps } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  // const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    http_methods
      .fetch<Array<FormDataType>>("/apps/create")
      .then((data) => {
        // setFormFields(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, []);

  const actionOnSuccess = async (newApp: AppType) => {
    updateApps([...appData.apps, newApp]);
    return navigate("/apps", {
      state: {
        notification: `Your app ${newApp.name} was created succesfully!`,
        type: "success",
      },
    });
  };

  return (
    <AppLayout title="New App" activePage="My Apps">
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to="/apps">
          Back to My Apps
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <FormComponent<AppType> onSuccess={actionOnSuccess} entity="apps" />
      </ContentLoader>
    </AppLayout>
  );
}
