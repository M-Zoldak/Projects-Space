import { List } from "rsuite";
import InputButtonGroup, {
  InputButtonGroupProps,
} from "../Forms/InputButtonGroup";

export default function EasyAddRemoveList<T>({
  inputButtonGroup,
  itemsList,
  label,
  emptyCollectiontext,
}: {
  inputButtonGroup: InputButtonGroupProps;
  itemsList: T[];
  label: (item: T) => string;
  emptyCollectiontext: string;
}) {
  return (
    <>
      {itemsList.length > 0 ? (
        <List bordered>
          {itemsList.map((item, index) => (
            <List.Item key={index}>{label(item)}</List.Item>
          ))}
        </List>
      ) : (
        <p>{emptyCollectiontext}</p>
      )}
      <InputButtonGroup {...inputButtonGroup} />
    </>
  );
}
