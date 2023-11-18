import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Message,
} from "rsuite";
import { PropsWithChildren, useState } from "react";
import NavToggle from "./components/NavToggle";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "./components/SideNav";
import { useNotificationsContext } from "../contexts/NotificationsContext";

type StandardLayout = PropsWithChildren<{
  title: string;
  activePage: string;
}>;

const StandardLayout = ({
  children,
  title,
  activePage, // notifications,
}: StandardLayout) => {
  const [expand, setExpand] = useState(true);
  const { notifications } = useNotificationsContext();

  return (
    <div className="sidebar-page">
      <Container>
        <Sidebar
          style={{ display: "flex", flexDirection: "column" }}
          width={expand ? 260 : 56}
          collapsible
        >
          <Sidenav.Header>
            <Link to="/" className="navbar-brand">
              <>My-Projects-Lib</>
            </Link>
          </Sidenav.Header>
          <Sidenav
            expanded={expand}
            defaultOpenKeys={["3"]}
            appearance="default"
          >
            <Sidenav.Body>
              {
                <Nav>
                  <SideNav activePage={activePage} />
                  {/* <SideNav activePage={activePage} /> */}
                </Nav>
              }
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>

        <Container>
          <Header className="site_header">
            <h2>{title}</h2>

            <div>
              <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
            </div>
          </Header>
          <Container>
            {notifications &&
              notifications.map((notification, index) => {
                return (
                  <Message
                    key={index}
                    closable={true}
                    type={notification.notificationProps?.type ?? "error"}
                  >
                    {notification.text}
                  </Message>
                );
              })}

            <Content className="content_container">{children}</Content>
          </Container>
        </Container>
      </Container>
    </div>
  );
};

export default StandardLayout;
