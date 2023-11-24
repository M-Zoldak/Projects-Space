import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, FlexboxGrid, List, ListItemProps, Modal } from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import {
  ActionButtonsType,
  PermissionsType,
} from "../../interfaces/DefaultTypes";
import { http_methods } from "../../Functions/Fetch";

export type CommonListItemProps = {
  id: string;
  name: string;
  props?: ListItemProps;
};

type CommonListProps<T> = {
  items: Array<CommonListItemProps>;
  entity: string;
  onDelete: (item: T) => void;
  buttons?: ActionButtonsType;
  userPermissions?: PermissionsType;
};

export default function CommonList<T>({
  items,
  buttons = {
    deleteable: true,
    hasOptions: true,
    hasView: true,
  },
  entity,
  onDelete,
  userPermissions,
}: CommonListProps<T>) {
  const { appData } = useAppDataContext();
  const [chosenObjectId, setChosenObjectId] = useState("");
  const [destroyOpen, setDestroyOpen] = useState(false);
  const { addNotification } = useNotificationsContext();

  const destroyObject = async () => {
    http_methods
      .delete<T>(appData.token, `/${entity}`, chosenObjectId)
      .then((data) => {
        onDelete(data);
        setDestroyOpen(false);
      })
      .catch((err: Error) => addNotification({ text: err.message }));
  };

  const renderActionButtons = (item: CommonListItemProps) => {
    let overview = buttons.hasView && (userPermissions?.hasView ?? false) && (
      <Button
        appearance="ghost"
        size="sm"
        as={Link}
        to={`/${entity}/${item.id}`}
        color="blue"
      >
        Show
      </Button>
    );

    let destroy = buttons.deleteable &&
      (userPermissions?.deleteable ?? false) && (
        <Button
          appearance="ghost"
          size="sm"
          color="red"
          onClick={() => {
            setChosenObjectId(item.id);
            setDestroyOpen(true);
          }}
        >
          Delete
        </Button>
      );

    let options = buttons.hasOptions &&
      (userPermissions?.hasOptions ?? false) && (
        <Button
          appearance="ghost"
          size="sm"
          color="yellow"
          as={Link}
          to={`/${entity}/options/${item.id}`}
        >
          Options
        </Button>
      );

    return (
      <FlexboxGrid className="buttons_container">
        {overview}
        {options}
        {destroy}
      </FlexboxGrid>
    );
  };

  return (
    <List hover bordered>
      {items &&
        items.map((item) => (
          <List.Item key={item.id.toString()}>
            <FlexboxGrid justify="space-between" align="middle">
              <h5>{item.name}</h5>
              {renderActionButtons(item)}
            </FlexboxGrid>
          </List.Item>
        ))}

      <Modal size="sm" open={destroyOpen} onClose={() => setDestroyOpen(false)}>
        <Modal.Header>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure about deleting this?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setDestroyOpen(false)} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={destroyObject} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </List>
  );
}
