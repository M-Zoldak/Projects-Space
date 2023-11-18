import { Button, FlexboxGrid, Loader } from "rsuite";
import StandardLayout from "../../layouts/StandardLayout";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import FormComponent, {
  FormFieldProps,
  SubmitCallbackFullfillmentProps,
} from "../../components/Forms/FormComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import { useNotificationsContext } from "../../contexts/NotificationsContext";

export default function Edit() {
  let params = useParams();
  const navigate = useNavigate();
  const { token } = useToken();
  const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    get<any>(token, `/apps/edit/${params.id}`)
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
      return post(token, `/apps/edit/${params.id}`, formData);
    };

  const actionOnSuccess = (successData: any) => {
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
