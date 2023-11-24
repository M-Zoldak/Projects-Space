import { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const { addNotification } = useNotificationsContext();
  const params = useParams();
  const [chosenObjectId, setChosenObjectId] = useState("");
  const [destroyOpen, setDestroyOpen] = useState(false);

  const destroyObject = async () => {
    http_methods
      .delete<T>(appData.token, `/${entity}/${chosenObjectId}`)
      .then((data) => {
        onDelete(data);
        setDestroyOpen(false);
      })
      .catch((err: Error) => addNotification({ text: err.message }));
  };

  const renderActionButtons = (item: CommonListItemProps) => {
    let overview = buttons.hasView && userPermissions?.hasView && (
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

    let isDestroyable =
      typeof buttons.deleteable == "function"
        ? buttons.deleteable(item)
        : buttons.deleteable;
    let destroy = isDestroyable && userPermissions?.deleteable && (
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

    let options = buttons.hasOptions && userPermissions?.hasOptions && (
      <Button
        appearance="ghost"
        size="sm"
        color="yellow"
        as={Link}
        to={`/${entity}/${item.id}/options`}
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
