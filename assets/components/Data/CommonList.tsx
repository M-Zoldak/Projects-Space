import { Link } from 'react-router-dom';
import { Button, FlexboxGrid, List, ListItemProps } from 'rsuite';

export type CommonListItemProps = {
  props?: ListItemProps;
  name: string;
  id: number;
  editable: boolean;
  hasOptions: boolean;
  deleteable: boolean;
};

export default function CommonList({
  items,
  editable = true,
  deleteable = true,
  copyable = true,
  hasOptions = false,
  entity,
}: {
  items: Array<CommonListItemProps>;
  editable?: boolean;
  deleteable?: boolean;
  copyable?: boolean;
  hasOptions?: boolean;
  entity: string;
}) {
  const destroyAction = () => {};

  const copyAction = () => {};

  const renderActionButtons = (item: CommonListItemProps) => {
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
      deleteable && item.deleteable ? (
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

  return (
    <List hover bordered>
      {items.map((item) => (
        <List.Item key={item.id.toString()}>
          <FlexboxGrid justify="space-between" align="middle">
            <h5>{item.name}</h5>
            {renderActionButtons(item)}
          </FlexboxGrid>
        </List.Item>
      ))}
    </List>
  );
}
