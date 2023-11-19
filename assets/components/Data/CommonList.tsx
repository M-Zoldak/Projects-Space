import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, FlexboxGrid, List, ListItemProps, Modal } from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { PermissionsType } from "../../interfaces/DefaultTypes";

export type CommonListItemProps = {
  props?: ListItemProps;
  name: string;
  id: number;
} & PermissionsType;

type CommonListProps = {
  items: Array<CommonListItemProps>;
  setItems: Function;
  hasView?: boolean;
  destroyable?: boolean;
  hasOptions?: boolean;
  entity: string;
  onDelete: (items: any) => void;
};

export default function CommonList({
  items,
  hasView = true,
  destroyable = true,
  hasOptions = false,
  entity,
  setItems,
  onDelete,
}: CommonListProps) {
  const { appData } = useAppDataContext();
  const [chosenObjectId, setChosenObjectId] = useState(0);
  const [destroyOpen, setDestroyOpen] = useState(false);
  const { addNotification } = useNotificationsContext();

  const destroyObject = async () => {
    await fetch(`/api/${entity}/delete`, {
      method: "DELETE",
      body: JSON.stringify({ id: chosenObjectId }),
      headers: {
        Authorization: "Bearer " + appData.token,
      },
    })
      .then((res) => {
        if (res.status == 200) return res.json();
        if (res.status == 403)
          throw new Error("Unsufficient rights to delete this.");
      })
      .then(() => {
        items = items.filter((item) => item.id != chosenObjectId);
        setItems(items);
        setDestroyOpen(false);
        addNotification({
          text: "Item and all dependencies was deleted succesfully.",
          notificationProps: { type: "success" },
        });
        onDelete(items);
      })
      .catch((err: Error) => addNotification({ text: err.message }));
  };

  const renderActionButtons = (item: CommonListItemProps) => {
    let edit = hasView && item.hasView && (
      <Button
        appearance="ghost"
        size="sm"
        as={Link}
        to={`/${entity}/edit/${item.id}`}
        color="blue"
      >
        Edit
      </Button>
    );

    let destroy = destroyable && item.destroyable && (
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

    let options = (hasOptions || item.hasOptions) && (
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
        {options}
        {edit}
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
