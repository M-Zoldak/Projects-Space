import { PropsWithChildren } from "react";
import { Button, ButtonToolbar } from "rsuite";

export default function Submit({
  children,
  onSubmit,
}: PropsWithChildren<{ onSubmit: Function }>) {
  return (
    <ButtonToolbar className="buttons_container">
      <Button
        appearance="ghost"
        color="green"
        onSubmit={() => onSubmit()}
        onClick={() => onSubmit()}
        type="submit"
      >
        {children ?? "Submit"}
      </Button>
    </ButtonToolbar>
  );
}
