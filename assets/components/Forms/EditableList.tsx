import { Link, useNavigation } from 'react-router-dom';
import { Button, FlexboxGrid, List, ListItemProps } from 'rsuite';
import {
  ErrorMessagesFunctionSignature,
  MessageInterface,
} from '../../layouts/StandardLayout';

export type EditableListItemProps = {
  props?: ListItemProps;
  name: string;
  id: number;
  editable: boolean;
  hasOptions: boolean;
  destroyable: boolean;
};

export type extraPropsToShow = {
  name: string;
  options?: {
    tag: boolean;
  };
};

type EditableListProps = {
  items: Array<EditableListItemProps>;
  editable?: boolean;
  destroyable?: boolean;
  copyable?: boolean;
  hasOptions?: boolean;
  entity: string;
  title?: string;
  propsToShow?: Array<extraPropsToShow>;
  setErrorMessages: typeof ErrorMessagesFunctionSignature;
  errorMessages: Array<MessageInterface>;
  token: string;
  backlink: string;
  creator?: boolean;
};

export default function EditableList({
  items,
  editable = true,
  destroyable = true,
  copyable = true,
  hasOptions = false,
  entity,
  title = 'name',
  propsToShow,
  backlink,
  creator = false,
}: EditableListProps) {
  const destroyAction = () => {};

  const copyAction = () => {};

  const renderActionButtons = (item: EditableListItemProps) => {
    let edit =
      editable && item.editable ? (
        <Button
          appearance="ghost"
          size="sm"
          as={Link}
          to={`/${entity}/edit/${item.id}`}
          color="blue"
        >
          Edit
        </Button>
      ) : (
        ''
      );
    let destroy =
      destroyable && item.destroyable ? (
        <Button
          appearance="ghost"
          size="sm"
          color="red"
          onClick={destroyAction}
        >
          Delete
        </Button>
      ) : (
        ''
      );
    let copy = copyable ? (
      <Button appearance="ghost" size="sm" color="cyan" onClick={copyAction}>
        Copy
      </Button>
    ) : (
      ''
    );
    let options =
      hasOptions || item.hasOptions ? (
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
        ''
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

  const renderSpecifiedProps = (
    item: EditableListItemProps,
    props: Array<extraPropsToShow>
  ) =>
    props.map((prop) => {
      // return <>{item.prop.name}</>;
    });

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
