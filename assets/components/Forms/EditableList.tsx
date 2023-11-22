import { Link, useNavigation } from "react-router-dom";
import { Button, FlexboxGrid, List, ListItemProps } from "rsuite";
import {
  ActionButtonsType,
  PermissionsType,
} from "../../interfaces/DefaultTypes";

export type EditableListItemProps = {
  name: string;
  id: number;
};

// export type extraPropsToShow = {
//   name: string;
//   options?: {
//     tag: boolean;
//   };
// };

type EditableListProps = {
  items: Array<EditableListItemProps>;
  entity: string;
  title?: string;
  // propsToShow?: Array<extraPropsToShow>;
  backlink: string;
  buttons?: ActionButtonsType;
  userPermissions?: PermissionsType;
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
  userPermissions,
}: EditableListProps) {
  const destroyAction = () => {};

  const renderActionButtons = (item: EditableListItemProps) => {
    let overview =
      buttons.hasView && (userPermissions?.hasView ?? false) ? (
        <Button
          appearance="ghost"
          size="sm"
          as={Link}
          to={`/${entity}/${item.id}`}
          color="blue"
        >
          Show
        </Button>
      ) : (
        ""
      );

    let options =
      buttons.hasOptions && (userPermissions?.hasOptions ?? false) ? (
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

    let destroy =
      buttons.destroyable && (userPermissions?.destroyable ?? false) ? (
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

  console.log(items);

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
