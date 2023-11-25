import { Checkbox, Table } from "rsuite";
import { PermissionsType } from "../../interfaces/DefaultTypes";
import { PropsWithChildren } from "react";
import { HoverTooltip } from "../Text/Tooltip";

const { Column, HeaderCell, Cell } = Table;

export type PermissionsTableProps = {
  // [key: 'string']: string;
  id: string;
  name: string;
  label: string;
  propsToRender: Array<PermissionRenderProps>;
  items: {};
  isLoading: boolean;
};

type PermissionRenderProps = {
  key: string;
  label: string;
  fieldType: "description" | "string" | "checkbox";
  values?: any;
  onChange?: (item: any, value: any, updatedKey: string) => void;
  disabled?: (item: any) => boolean;
  disabledMessage?: string;
};

const CheckCell = ({
  dataKey,
  itemProps,
  ...props
}: {
  dataKey: any;
  itemProps: PermissionRenderProps;
}) => {
  return (
    <Cell
      verticalAlign="middle"
      className="checkbox-cell"
      {...props}
      style={{ padding: 0 }}
    >
      {(rowData, rowIndex) => {
        return itemProps.disabled && itemProps.disabled(rowData) ? (
          <HoverTooltip text={itemProps.disabledMessage}>
            <Checkbox
              value={rowData[dataKey]}
              checked={rowData[dataKey]}
              disabled={
                itemProps.disabled ? itemProps.disabled(rowData) : false
              }
              onChange={() =>
                itemProps.onChange(rowData, rowData[dataKey], itemProps.key)
              }
            />
          </HoverTooltip>
        ) : (
          <Checkbox
            value={rowData[dataKey]}
            checked={rowData[dataKey]}
            disabled={itemProps.disabled ? itemProps.disabled(rowData) : false}
            onChange={() =>
              itemProps.onChange(rowData, rowData[dataKey], itemProps.key)
            }
          />
        );
      }}
    </Cell>
  );
};

export default function PermissionsTable({
  items,
  propsToRender,
  isLoading,
}: PermissionsTableProps) {
  const createProperField = (props: PermissionRenderProps) => {
    switch (props.fieldType) {
      case "checkbox":
        return <CheckCell dataKey={props.key} itemProps={props} />;
      case "string":
        return <Cell align="middle" dataKey={props.key} />;
      case "description":
        return <Cell align="middle" dataKey={props.key} />;
    }
  };

  let itemsArr = Object.values(items).sort((itemA: any, itemB: any) =>
    itemA.name > itemB.name ? 1 : -1
  );

  return (
    <Table hover loading={isLoading} autoHeight bordered data={itemsArr}>
      {propsToRender.map((props: PermissionRenderProps, index) => {
        let align = index > 0 ? "center" : "";
        return (
          <Column
            fixed={props.fieldType == "checkbox"}
            flexGrow={1}
            key={props.label}
            align={align}
          >
            <HeaderCell>{props.label}</HeaderCell>
            {createProperField(props)}
          </Column>
        );
      })}
    </Table>
  );
}
