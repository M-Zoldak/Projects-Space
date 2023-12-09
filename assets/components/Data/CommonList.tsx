import React, { Component, ReactElement, ReactNode, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Col,
  FlexboxGrid,
  Grid,
  List,
  ListItemProps,
  Modal,
  Row,
} from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import {
  ActionButtonsType,
  DynamicallyFilledObject,
  PermissionsType,
} from "../../interfaces/DefaultTypes";
import { http_methods } from "../../Functions/Fetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";

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
  inViewBacklink?: string;
  additionalInfo?: (item: T) => ReactElement;
  linkPrepend?: string;
  ownButtons?: (item: T) => ReactNode;
  label: (item: T) => string | ReactNode;
};

export default function CommonList<T>({
  items,
  linkPrepend = "",
  buttons = {
    deleteable: true,
    hasOptions: true,
    hasView: true,
  },
  entity,
  onDelete,
  inViewBacklink,
  additionalInfo,
  ownButtons,
  label,
}: CommonListProps<T>) {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [chosenObjectId, setChosenObjectId] = useState("");
  const [destroyOpen, setDestroyOpen] = useState(false);

  const destroyObject = async () => {
    http_methods
      .delete<T>(appData.token, `${linkPrepend}/${entity}/${chosenObjectId}`)
      .then((data) => {
        onDelete(data);
        setDestroyOpen(false);
      })
      .catch((err: Error) => addNotification({ text: err.message }));
  };

  const renderActionButtons = (item: CommonListItemProps) => {
    let isViewable =
      typeof buttons.hasView == "function"
        ? buttons.hasView(item)
        : buttons.hasView;
    let overview = isViewable && (
      <Button
        appearance="ghost"
        size="sm"
        as={Link}
        to={`${linkPrepend}/${entity}/${item.id}`}
        color="blue"
        state={{ backlink: inViewBacklink }}
      >
        Show
      </Button>
    );

    let isOptionable =
      typeof buttons.hasOptions == "function"
        ? buttons.hasOptions(item)
        : buttons.hasOptions;
    let options = isOptionable && (
      <Button
        appearance="ghost"
        size="sm"
        color="yellow"
        as={Link}
        to={`${linkPrepend}/${entity}/${item.id}/options`}
        state={{ backlink: inViewBacklink }}
      >
        Options
      </Button>
    );

    let isDestroyable =
      typeof buttons.deleteable == "function"
        ? buttons.deleteable(item)
        : buttons.deleteable;
    let destroy = isDestroyable && (
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
        items.map((item: CommonListItemProps) => (
          <List.Item key={item.id.toString()}>
            <FlexboxGrid align="middle" justify="space-between">
              <FlexboxGridItem as={Col} colspan={24} md={9}>
                <h5>{label(item as T)}</h5>
              </FlexboxGridItem>
              {additionalInfo && (
                <FlexboxGridItem as={Col} style={{ flexGrow: 1 }}>
                  {additionalInfo(item as T)}
                </FlexboxGridItem>
              )}
              <FlexboxGridItem as={Col} style={{ alignSelf: "end" }}>
                {ownButtons ? (
                  <FlexboxGrid className="buttons_container">
                    {ownButtons(item as T)}
                  </FlexboxGrid>
                ) : (
                  renderActionButtons(item)
                )}
              </FlexboxGridItem>
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
