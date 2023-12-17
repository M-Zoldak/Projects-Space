import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonToolbar } from "rsuite";

export default function Backlink({
  children,
  link,
}: PropsWithChildren<{ link?: string }>) {
  return (
    <ButtonToolbar className="buttons_container">
      <Button appearance="ghost" as={Link} to={link ?? document.referrer}>
        {children ?? "Back"}
      </Button>
    </ButtonToolbar>
  );
}
