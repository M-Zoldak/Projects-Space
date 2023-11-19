import { Button, Modal } from "rsuite";
import { useEffect, useState } from "react";
import useToken from "../../components/App/useToken";
import FormComponent from "../../components/Forms/FormComponent";
import { useNavigate } from "react-router-dom";
import { get, getAll, post } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { DynamicallyFilledObject } from "../../interfaces/DefaultTypes";
import { useAppDataContext } from "../../contexts/AppDataContext";

type SimpleCreateModalProps<T> = {
  title: string;
  createPath: string;
  onSuccess: ({}: T) => void;
};

export default function SimpleCreateModal<T>({
  createPath,
  onSuccess,
  title,
}: SimpleCreateModalProps<T>) {
  const { appData } = useAppDataContext();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const { addNotification } = useNotificationsContext();

  useEffect(() => {
    getAll<T>(appData.token, createPath)
      .then((data) => {
        setFormFields(data);
        setLoaded(true);
      })
      .catch((err: Error) => {
        addNotification({ text: err.message });
      });
  }, []);

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
                onSuccess={onSuccess}
                setFormData={setFormFields}
                postPath={createPath}
              />
            </ContentLoader>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
