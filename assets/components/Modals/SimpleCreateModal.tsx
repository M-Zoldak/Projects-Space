import { Button, Modal } from "rsuite";
import { useEffect, useState } from "react";
import FormComponent from "../../components/Forms/FormComponent";
import { http_methods } from "../../Functions/Fetch";
import ContentLoader from "../../components/Loader";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";

type SimpleCreateModalProps<T> = {
  title: string;
  entity: string;
  onSuccess: ({}: T) => void;
  prependQuery?: string;
  buttonText?: string;
};

export default function SimpleCreateModal<T>({
  entity,
  onSuccess,
  title,
  buttonText = "Create new",
  prependQuery = "",
}: SimpleCreateModalProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setModalOpen(!modalOpen)}
        color="green"
        appearance="ghost"
      >
        {buttonText}
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(!modalOpen)}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <ContentLoader loaded={loaded}> */}
          <FormComponent<T>
            prependQuery={prependQuery}
            onSuccess={(data) => {
              setModalOpen(false);
              onSuccess(data);
            }}
            entity={entity}
          />
          {/* </ContentLoader> */}
        </Modal.Body>
      </Modal>
    </>
  );
}
