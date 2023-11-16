import { Link } from 'react-router-dom';
import {
  Button,
  Checkbox,
  FlexboxGrid,
  List,
  ListItemProps,
  Table,
} from 'rsuite';
import {
  NotificationsFunctionSignature,
  NotificationInterface,
} from '../../layouts/StandardLayout';
import { DynamicallyFilledObject } from '../../interfaces/DefaultTypes';

const { Column, HeaderCell, Cell } = Table;

export type PermissionsTableProps = {
  // [key: 'string']: string;
  id: string;
  name: string;
  label: string;
  propsToRender: Array<PermissionRenderProps>;
  token: string;
  items: Array<{}>;
  setItems: Function;
};

type PermissionRenderProps = {
  [key: string]: string | boolean;
  key: string;
  label: string;
  fieldType: 'string' | 'checkbox';
};

export default function PermissionsTable({
  items,
  propsToRender,
  token,
  setItems,
}: PermissionsTableProps) {
  const createProperField = (props: PermissionRenderProps) => {
    switch (props.fieldType) {
      case 'checkbox':
        return (
          <Cell style={{ alignContent: 'center' }}>
            <Checkbox onChange={(e) => setItems(e, props)} />
          </Cell>
        );
      case 'string':
        return <Cell dataKey={props.key} />;
    }
  };

  return (
    <Table hover bordered data={items}>
      {propsToRender.map((props, index) => {
        let align = index > 0 && 'center';

        return (
          <Column fixed key={props.key} align={align}>
            <HeaderCell>{props.name}</HeaderCell>
            {createProperField(props)}
          </Column>
        );
      })}
    </Table>
  );
}
