import { Button, FlexboxGrid } from 'rsuite';
import StandardLayout, { MessageInterface } from '../../layouts/StandardLayout';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import FormComponent, {
  FormFieldProps,
  SubmitCallbackFullfillmentProps,
} from '../../components/Forms/FormComponent';
import { Link, redirect, useParams } from 'react-router-dom';
import { get, post } from '../../Functions/Fetch';

const getFormValues = (formData: Array<FormFieldProps>) => {
  if (formData.length) {
    return formData.reduce((obj, curr) =>
      Object.assign(obj, { [curr.name]: curr.value ?? '' }, {})
    );
  } else return {};
};

export default function Edit() {
  let params = useParams();
  const { token, setToken } = useToken();
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [errorMessages, setErrorMessages] = useState<Array<MessageInterface>>(
    []
  );

  useEffect(() => {
    get(token, `/api/app/edit/${params.id}`)
      .then((data) => {
        setFormFields(data);
        setFormValues(getFormValues(data));
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
    redirect('/apps');
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

      <FormComponent
        formData={formFields}
        onSubmit={handleSubmit}
        onSuccess={actionOnSuccess}
        formValues={formValues}
      />
    </StandardLayout>
  );
}
