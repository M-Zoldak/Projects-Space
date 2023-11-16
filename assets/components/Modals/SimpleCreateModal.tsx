import { Button, FlexboxGrid, Modal } from 'rsuite';
import StandardLayout, {
  NotificationInterface,
} from '../../layouts/StandardLayout';
import { useEffect, useState } from 'react';
import useToken from '../../components/App/useToken';
import FormComponent, {
  SubmitCallbackFullfillmentProps,
} from '../../components/Forms/FormComponent';
import { Link, useNavigate } from 'react-router-dom';
import { get, post } from '../../Functions/Fetch';
import ContentLoader from '../../components/Loader';
import { useNotificationsContext } from '../../contexts/NotificationsContext';

type OnSuccessProps = {
  notification: string;
  path?: string;
};

type SimpleCreateModalProps = {
  createPath: string;
  onSuccess: OnSuccessProps;
};

export default function SimpleCreateModal({
  createPath,
  onSuccess,
}: SimpleCreateModalProps) {
  const navigate = useNavigate();
  const { token, setToken } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    get(token, createPath)
      .then((data) => {
        setFormFields(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        console.log(err);
        addNotification({ text: err.message });
      });
  }, []);

  const handleSubmit =
    async (formValue: {}): Promise<SubmitCallbackFullfillmentProps> => {
      return post(token, createPath, formValue);
    };

  const actionOnSuccess = (successData: OnSuccessProps) => {
    if (successData.path) {
      return navigate(successData.path, {
        state: {
          notification: successData.notification,
          type: 'success',
        },
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setModalOpen(!modalOpen)}
        color="green"
        appearance="ghost"
      >
        Create New
      </Button>

      {modalOpen && (
        <Modal open={modalOpen}>
          <ContentLoader loaded={loaded}>
            <FormComponent
              formData={formFields}
              onSubmit={handleSubmit}
              onSuccess={actionOnSuccess}
              setFormData={setFormFields}
            />
          </ContentLoader>
        </Modal>
      )}
    </>
  );
}
