import { ReactElement, ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  FlexboxGrid,
  List,
  ListItemProps,
  Modal,
  SelectPicker,
} from "rsuite";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { ActionButtonsType } from "../../interfaces/DefaultTypes";
import { http_methods } from "../../Functions/HTTPMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

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
  sortingItems?: Array<{ value: string | string[]; label: string }>;
  sortingDefaults?: {
    direction?: "asc" | "desc";
    field?: string | string[];
  };
  onEmpty: string;
  sortable?: boolean;
  onSort?: (data: any) => void;
  editableLabel?: boolean;
  onEditLabel?: (name: string, item: T) => void;
  filters?: Array<{ value: string; label: string }>;
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
  sortingItems,
  sortingDefaults = {
    direction: "asc",
    field: "",
  },
  onEmpty,
  sortable = false,
  onSort,
  editableLabel,
  onEditLabel,
  filters,
}: CommonListProps<T>) {
  const { appData } = useAppDataContext();
  const { addNotification } = useNotificationsContext();
  const [chosenObjectId, setChosenObjectId] = useState("");
  const [destroyOpen, setDestroyOpen] = useState(false);
  // const [sortingType, setSortingType] = useState(
  //   sortingDefaults.type ?? "alphabetically"
  // );
  const [sortBy, setSortBy] = useState(sortingDefaults.field);
  const [sortDirection, setSortDirection] = useState(sortingDefaults.direction);
  const [currentFilter, setCurrentFilter] = useState("none");
  const [filteredValue, setFilteredValue] = useState("none");

  const destroyObject = () => {
    http_methods
      .delete<T>(
        `${linkPrepend}/${entity}/${chosenObjectId}`.replace("//", "/")
      )
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

  const officialSort = (item1: any, item2: any) => {
    if (Array.isArray(sortBy)) {
      if (sortDirection == "asc") {
        if (
          !item1 ||
          !item1[sortBy[0]] ||
          item1[sortBy[0]][sortBy[1]] == undefined
        ) {
          return 1;
        } else if (
          !item2 ||
          !item2[sortBy[0]] ||
          item2[sortBy[0]][sortBy[1]] == undefined
        )
          return -1;
        else {
          return item1[sortBy[0]][sortBy[1]] > item2[sortBy[0]][sortBy[1]]
            ? 1
            : -1;
        }
      } else {
        if (
          !item1 ||
          !item1[sortBy[0]] ||
          item1[sortBy[0]][sortBy[1]] == undefined
        ) {
          return 1;
        } else if (
          !item2 ||
          !item2[sortBy[0]] ||
          item2[sortBy[0]][sortBy[1]] == undefined
        ) {
          return -1;
        } else {
          return item1[sortBy[0]][sortBy[1]] < item2[sortBy[0]][sortBy[1]]
            ? 1
            : -1;
        }
      }
    } else {
      if (sortDirection == "asc") {
        return item1[sortBy] > item2[sortBy] ? 1 : -1;
      } else {
        return item1[sortBy] < item2[sortBy] ? 1 : -1;
      }
    }
  };

  const renderSorting = () => {
    return (
      <FlexboxGrid align="middle" style={{ padding: "14px 20px", gap: "1rem" }}>
        <h6>Sorting</h6>
        {/* <SelectPicker
          searchable={false}
          size="sm"
          label="Sorting type"
          data={[{ value: "alphabetically", label: "Alphabetically" }]}
          onChange={setSortingType}
          value={sortingType}
        /> */}
        <SelectPicker
          searchable={false}
          size="sm"
          label="Sort by"
          data={sortingItems}
          onChange={(val: string) => setSortBy(val)}
          value={sortBy}
        />
        <SelectPicker
          searchable={false}
          size="sm"
          label="Sorting direction "
          data={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          onChange={setSortDirection}
          value={sortDirection}
        />
        {/* <Button size="sm">Sort</Button> */}
      </FlexboxGrid>
    );
  };

  const renderFilter = () => {
    let keys: string[] = [];
    return (
      <FlexboxGrid align="middle" style={{ padding: "14px 20px", gap: "1rem" }}>
        <h6>Filter</h6>
        <SelectPicker
          searchable={false}
          size="sm"
          label="Filter"
          data={[{ label: "None", value: "none" }, ...filters]}
          onChange={setCurrentFilter}
          value={currentFilter}
          defaultValue={"none"}
          // value={sortDirection}
          onClean={() => setCurrentFilter("none")}
        />

        {currentFilter != "none" && (
          <SelectPicker
            searchable={false}
            size="sm"
            label="Value"
            onChange={setFilteredValue}
            defaultValue={"none"}
            onClean={() => setFilteredValue("none")}
            data={[
              { label: "None", value: "none" },
              ...items
                .map((i: any) => {
                  if (
                    i &&
                    i.hasOwnProperty(currentFilter) &&
                    i[currentFilter] == undefined
                  ) {
                    console.log(i[currentFilter]);
                    if (!keys.includes("unset")) {
                      keys.push("unset");
                      return {
                        label: "Unset",
                        value: "unset",
                      };
                    }
                  } else if (
                    i &&
                    i.hasOwnProperty(currentFilter) &&
                    i[currentFilter] != undefined &&
                    i[currentFilter]?.name != undefined &&
                    i[currentFilter] != null
                  ) {
                    if (!keys.includes(i[currentFilter]?.name)) {
                      console.log(i[currentFilter]);
                      keys.push(i[currentFilter]?.name);
                      return {
                        label: i[currentFilter]?.name ?? ("" as string),
                        value: i[currentFilter]?.name ?? ("" as string),
                      };
                    }
                  }
                })
                .filter((i) => i)
                .sort((a, b) =>
                  b.label == "Unset" || a.label > b.label ? 1 : 0
                ),
            ]}
          />
        )}
      </FlexboxGrid>
    );
  };

  return (
    <List hover bordered sortable={sortable} onSort={onSort}>
      {sortingItems && renderSorting()}
      {filters && renderFilter()}
      {items?.length > 0 ? (
        items
          .filter((i: any) => {
            if (filteredValue == "none" || currentFilter == "none") return true;
            else if (
              filteredValue == "unset" &&
              i[currentFilter] == undefined
            ) {
              return true;
            } else if (
              i.hasOwnProperty(currentFilter) &&
              i[currentFilter] != undefined &&
              i[currentFilter] != null
            )
              return i[currentFilter].name == filteredValue;
            else return false;
          })
          .sort(officialSort)
          .map((item: CommonListItemProps, index: number) => (
            <List.Item key={item.id.toString()} index={index}>
              <FlexboxGrid align="middle" justify="space-between">
                <FlexboxGridItem as={Col} colspan={24} md={9}>
                  <h5>
                    {label(item as T)}
                    {editableLabel ? (
                      <Button style={{ marginLeft: "5px" }} appearance="subtle">
                        <FontAwesomeIcon icon={faEdit} size="sm" />
                      </Button>
                    ) : (
                      <></>
                    )}
                  </h5>
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
          ))
      ) : (
        <p style={{ padding: "20px" }}>{onEmpty}</p>
      )}

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
