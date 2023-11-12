import { Button, FlexboxGrid } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import FormComponent, {
  SubmitCallbackFullfillmentProps,
} from '../../components/Forms/FormComponent';
import { Link, redirect } from 'react-router-dom';
import { get, post } from '../../Functions/Fetch';

export default function Create() {
  const { token, setToken } = useToken();
  const [formFields, setFormFields] = useState([]);
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );

  useEffect(() => {
    get(token, '/api/app/create')
      .then((data) => {
        setFormFields(data);
      })
      .catch((err: Error) => {
        setErrorMessages([...errorMessages, { text: err.message }]);
      });
  }, []);

  const handleSubmit =
    async (formValue: {}): Promise<SubmitCallbackFullfillmentProps> => {
      return post(token, '/api/app/create', formValue);
    };

  const actionOnSuccess = (successData: {}) => {
    redirect('/apps');
  };

  return (
    <StandardLayout
      title="New App"
      activePage="My Apps"
      messages={errorMessages}
    >
      <FlexboxGrid className="buttons_container">
        <Button appearance="ghost" as={Link} to="/apps">
          Back to My Apps
        </Button>
      </FlexboxGrid>

      <FormComponent
        formData={formFields}
        onSubmit={handleSubmit}
        onSuccess={actionOnSuccess}
        formValues={{}}
      />
    </StandardLayout>
  );
}
