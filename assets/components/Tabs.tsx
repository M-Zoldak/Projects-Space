import { ReactNode, useState } from "react";
import { Nav } from "rsuite";

export type TabNavItem = {
  label: string;
  view: ReactNode;
};

export default function TabsNavbar({
  items,
  ...props
}: {
  items: TabNavItem[];
}) {
  const [active, setActive] = useState(items[0].label.toLowerCase());

  const currentView = () => {
    return items.find((i) => i.label.toLowerCase() == active)?.view;
  };

  return (
    <>
      <Nav
        appearance="subtle"
        {...props}
        activeKey={active}
        onSelect={(v) => {
          setActive(v);
        }}
        style={{ marginBottom: 10 }}
      >
        {items.map((i, index) => (
          <Nav.Item key={index} eventKey={i.label.toLowerCase()}>
            {i.label}
          </Nav.Item>
        ))}
      </Nav>
      {currentView() ?? "None"}
    </>
  );
}
