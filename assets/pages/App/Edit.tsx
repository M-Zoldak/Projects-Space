import { Button, FlexboxGrid, Loader } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import FormComponent from "../../components/Forms/FormComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { AppType } from "../../interfaces/EntityTypes/AppType";
import { FormDataType } from "../../interfaces/FormDataType";

export default function Edit() {
  let params = useParams();
  const navigate = useNavigate();
  const { token } = useToken();
  const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    http_methods
      .fetch<Array<FormDataType>>(token, `/apps/edit/${params.id}`)
      .then((data) => {
        setFormFields(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: "test" });
      });
  }, []);

  const actionOnSuccess = (successData: AppType) => {
    return navigate("/apps");
  };

  return (
    <StandardLayout title="App edit" activePage="My Apps">
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to="/apps">
          Back to My Apps
        </Button>
      </FlexboxGrid>

      <ContentLoader loaded={loaded}>
        <FormComponent<AppType>
          formData={formFields}
          onSuccess={actionOnSuccess}
          setFormData={setFormFields}
          postPath={`/apps/edit/${params.id}`}
        />
      </ContentLoader>
    </StandardLayout>
  );
}
