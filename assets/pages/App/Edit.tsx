import { Button, FlexboxGrid, Loader } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import FormComponent, {
  FormFieldProps,
  SubmitCallbackFullfillmentProps,
} from '../../components/Forms/FormComponent';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';

export default function Edit() {
  let params = useParams();
  const navigate = useNavigate();
  const { token, setToken } = useToken();
  const [formFields, setFormFields] = useState([]);
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    get(token, `/api/app/edit/${params.id}`)
      .then((data) => {
        setFormFields(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        setErrorMessages([...errorMessages, { text: err.message }]);
      });
  }, []);

  const handleSubmit =
    async (formValue: {}): Promise<SubmitCallbackFullfillmentProps> => {
      return post(token, `/api/app/edit/${params.id}`, formValue);
    };

  const actionOnSuccess = (successData: {}) => {
    console.log(successData);
    // localStorage.setItem("message");
    return navigate('/apps');
  };

  return (
    <StandardLayout
      title="App edit"
      activePage="My Apps"
      messages={errorMessages}
    >
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
