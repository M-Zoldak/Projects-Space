import { Button, FlexboxGrid } from "rsuite";
import { useEffect, useState } from "react";
import FormComponent from "../../components/Forms/FormComponent";
import { Link, useNavigate } from "react-router-dom";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import StandardLayout from "../../layouts/StandardLayout";
import { FormDataType } from "../../interfaces/FormDataType";
import { useAppDataContext } from "../../contexts/AppDataContext";

export default function Create() {
  const navigate = useNavigate();
  const { appData } = useAppDataContext();
  const [loaded, setLoaded] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    http_methods
      .fetch<Array<FormDataType>>(appData.token, "/apps/create")
      .then((data) => {
        setFormFields(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, []);

  const actionOnSuccess = (successData: DynamicallyFilledObject) => {
    return navigate("/apps", {
      state: {
        notification: `Your app ${successData.name} was created succesfully!`,
        type: "success",
      },
    });
  };

  return (
    <StandardLayout title="New App" activePage="My Apps">
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to="/apps">
          Back to My Apps
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <FormComponent
          formData={formFields}
          onSuccess={actionOnSuccess}
          setFormData={setFormFields}
          postPath="/apps/create"
        />
      </ContentLoader>
    </StandardLayout>
  );
}
