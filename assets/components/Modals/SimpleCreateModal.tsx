import { Button, Modal } from "rsuite";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import FormComponent, {
  SubmitCallbackFullfillmentProps,
} from "../../components/Forms/FormComponent";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";

type OnSuccessProps = {
  notification: string;
  path?: string;
};

type SimpleCreateModalProps = {
  createPath: string;
  onSuccess: OnSuccessProps;
  title: string;
};

export default function SimpleCreateModal({
  createPath,
  onSuccess,
  title,
}: SimpleCreateModalProps) {
  const navigate = useNavigate();
  const { token } = useToken();
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    get<any>(token, createPath)
      .then((data) => {
        setFormFields(data.data);
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

  const actionOnSuccess = (successData: DynamicallyFilledObject) => {
    if (successData.path) {
      return navigate(successData.path, {
        state: {
          notification: successData.notification,
          type: "success",
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
        <Modal open={modalOpen} onClose={() => setModalOpen(!modalOpen)}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ContentLoader loaded={loaded}>
              <FormComponent
                formData={formFields}
                onSubmit={handleSubmit}
                onSuccess={actionOnSuccess}
                setFormData={setFormFields}
              />
            </ContentLoader>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
