import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonToolbar } from "rsuite";

export default function Backlink({
  children,
  link,
}: PropsWithChildren<{ link?: string }>) {
  return link ? (
    <ButtonToolbar className="buttons_container">
      <Button appearance="ghost" as={Link} to={link}>
        {children ?? "Back"}
      </Button>
    </ButtonToolbar>
  ) : (
    ""
  );
}
