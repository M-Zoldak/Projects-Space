import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, FlexboxGrid, List, ListItemProps, Modal } from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";

export type CommonListItemProps = {
  // [key: 'string']: string;
  props?: ListItemProps;
  name: string;
  id: number;
  editable: boolean;
  hasOptions: boolean;
  destroyable: boolean;
};

type CommonListProps = {
  items: Array<CommonListItemProps>;
  setItems: Function;
  editable?: boolean;
  destroyable?: boolean;
  copyable?: boolean;
  hasOptions?: boolean;
  entity: string;
  token: string;
  onDelete: (items: any) => void;
};

export default function CommonList({
  items,
  editable = true,
  destroyable = true,
  copyable = true,
  hasOptions = false,
  entity,
  token,
  setItems,
  onDelete,
}: CommonListProps) {
  const [chosenObjectId, setChosenObjectId] = useState(0);
  const [destroyOpen, setDestroyOpen] = useState(false);
  const { addNotification } = useNotificationsContext();

  const destroyObject = async () => {
    await fetch(`/api/${entity}/delete`, {
      method: "DELETE",
      body: JSON.stringify({ id: chosenObjectId }),
      headers: {
        Authorization: "Bearer " + token,
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

  const copyAction = () => {};

  const renderActionButtons = (item: CommonListItemProps) => {
    let edit = editable && item.editable && (
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
    let copy = copyable && (
      <Button appearance="ghost" size="sm" color="cyan" onClick={copyAction}>
        Copy
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
        {copy}
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
