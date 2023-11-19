import { Link } from "react-router-dom";
import { Button, FlexboxGrid, List, ListItemProps, Table } from "rsuite";
import { PermissionsType } from "../../interfaces/DefaultTypes";

const { Column, HeaderCell, Cell } = Table;

export type CommonListItemProps = {
  // [key: 'string']: string;
  props?: ListItemProps;
  name: string;
  id: number;
} & PermissionsType;

type EditableListProps = {
  items: Array<CommonListItemProps>;
  entity: string;
  propsToRender: Array<{
    id?: string;
    name: string;
    readableName: string;
    sectionName: string;
    delete: boolean;
    read: boolean;
    edit: boolean;

    options?: {
      tag?: boolean;
      checkbox?: boolean;
    };
  }>;
} & PermissionsType;

export default function EditableTable({
  items,
  hasView = true,
  destroyable = true,
  hasOptions = false,
  entity,
  propsToRender,
}: EditableListProps) {
  const destroyAction = () => {};

  // const copyAction = () => {};

  const renderActionButtons = (item: CommonListItemProps) => {
    let edit =
      hasView && item.hasView ? (
        <Button
          appearance="ghost"
          size="sm"
          as={Link}
          to={`/${entity}/edit/${item.id}`}
          color="blue"
        >
          Overview
        </Button>
      ) : (
        ""
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
        ""
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
        ""
      );

    return (
      <FlexboxGrid className="buttons_container">
        {options}
        {edit}name
        {/* {copy} */}
        {destroy}
      </FlexboxGrid>
    );
  };

  return (
    <Table hover bordered data={items}>
      {propsToRender.map((defs, index) => (
        <>
          <Column fixed key={index}>
            <HeaderCell>{defs.readableName}</HeaderCell>
            <Cell dataKey={defs.name} />
          </Column>
        </>
      ))}
    </Table>
  );
}
