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

type CommonListProps<T> = {
  items: Array<CommonListItemProps>;
  entity: string;
  onDelete: (items: any, item: T) => void;
  userPermissions?: PermissionsType;
};

export default function CommonList<T>({
  items,
  userPermissions = { hasView: true, destroyable: true, hasOptions: true },
  entity,
  onDelete,
}: CommonListProps<T>) {
  const { appData } = useAppDataContext();
  const [chosenObjectId, setChosenObjectId] = useState(0);
  const [destroyOpen, setDestroyOpen] = useState(false);
  const { addNotification } = useNotificationsContext();

  const destroyObject = async () => {
    await fetch(`/api/${entity}`, {
      method: "DELETE",
      body: JSON.stringify({ id: chosenObjectId }),
      headers: {
        Authorization: "Bearer " + appData.token,
      },
    })
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) return res.json();
        setDestroyOpen(false);
        if (res.status == 403) throw new Error(res.statusText);
        if (res.status == 404) throw new Error(res.statusText);
      })
      .then(() => {
        let item = items.find((item) => item.id == chosenObjectId);
        items = items.filter((item) => item.id != chosenObjectId);
        setDestroyOpen(false);
        onDelete(items, item as T);
      })
      .catch((err: Error) => addNotification({ text: err.message }));
  };

  const renderActionButtons = (item: CommonListItemProps) => {
    let overview = userPermissions.hasView && item.hasView && (
      <Button
        appearance="ghost"
        size="sm"
        as={Link}
        to={`/${entity}/edit/${item.id}`}
        color="blue"
      >
        Show
      </Button>
    );

    let destroy = userPermissions.destroyable && item.destroyable && (
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

    let options = userPermissions.hasOptions && item.hasOptions && (
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
