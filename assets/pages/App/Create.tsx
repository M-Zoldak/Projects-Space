import { Button, FlexboxGrid } from "rsuite";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import FormComponent, {
  SubmitCallbackFullfillmentProps,
} from "../../components/Forms/FormComponent";
import { Link, redirect, useNavigate } from "react-router-dom";
import { get, post } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppType } from "../../interfaces/EntityTypes/AppType";
import StandardLayout from "../../layouts/StandardLayout";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    get<any>(token, "/apps/create")
      .then((data) => {
        setFormFields(data.data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
  }, []);

  const handleSubmit =
    async (formData: {}): Promise<SubmitCallbackFullfillmentProps> => {
      return post(token, "/apps/create", formData);
    };

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
          onSubmit={handleSubmit}
          onSuccess={actionOnSuccess}
          setFormData={setFormFields}
        />
      </ContentLoader>
    </StandardLayout>
  );
}
