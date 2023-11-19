import { Link, useNavigation } from "react-router-dom";
import { Button, FlexboxGrid, List, ListItemProps } from "rsuite";
import { PermissionsType } from "../../interfaces/DefaultTypes";

export type EditableListItemProps = {
  props?: ListItemProps;
  name: string;
  id: number;
  userPermissions: PermissionsType;
};

export type extraPropsToShow = {
  name: string;
  options?: {
    tag: boolean;
  };
};

type EditableListProps = {
  items: Array<EditableListItemProps>;
  entity: string;
  title?: string;
  propsToShow?: Array<extraPropsToShow>;
  backlink: string;
  buttons?: PermissionsType;
};

export default function EditableList<T>({
  items,
  entity,
  backlink,
  buttons = {
    destroyable: true,
    hasOptions: true,
    hasView: true,
  },
}: EditableListProps) {
  const destroyAction = () => {};

  const renderActionButtons = (item: EditableListItemProps) => {
    let overview =
      buttons.hasView && item.userPermissions.hasView ? (
        <Button
          appearance="ghost"
          size="sm"
          as={Link}
          to={`/${entity}/edit/${item.id}`}
          color="blue"
        >
          Show
        </Button>
      ) : (
        ""
      );

    let destroy =
      buttons.destroyable && item.userPermissions.destroyable ? (
        <Button
          appearance="ghost"
          size="sm"
          color="red"
          onClick={destroyAction}
        >
          Delete
        </Button>
      ) : (
        ""
      );

    let options =
      buttons.hasOptions && item.userPermissions.hasOptions ? (
        <Button
          appearance="ghost"
          size="sm"
          color="yellow"
          as={Link}
          to={`/${entity}/options/${item.id}`}
          state={{ backlink: backlink }}
        >
          Options
        </Button>
      ) : (
        ""
      );

    return (
      <FlexboxGrid className="buttons_container">
        {overview}
        {options}
        {destroy}
      </FlexboxGrid>
    );
  };

  // const renderSpecifiedProps = (
  //   item: EditableListItemProps,
  //   props: Array<extraPropsToShow>
  // ) =>
  //   props.map((prop) => {
  //     // return <>{item.prop.name}</>;
  //   });

  return (
    <List hover bordered>
      {items.map((item) => (
        <List.Item key={item.id.toString()}>
          <FlexboxGrid justify="space-between" align="middle">
            <h5>{item.name}</h5>
            {/* {propsToShow ? renderSpecifiedProps(item, propsToShow) : ''} */}
            {renderActionButtons(item)}
          </FlexboxGrid>
        </List.Item>
      ))}
    </List>
  );
}
