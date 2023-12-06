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
import TopNav from "./components/TopNav";
import { Link, useNavigate } from "react-router-dom";
import SideNav from "./components/SideNav";
import { useNotificationsContext } from "../contexts/NotificationsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { useAppDataContext } from "../contexts/AppDataContext";

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
  const { notifications, removeNotification } = useNotificationsContext();
  const { appData } = useAppDataContext();

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
              <FontAwesomeIcon
                icon={faRocket}
                style={{
                  marginRight: "1rem",
                  fontSize: ".8em",
                  border: "2px solid currentColor",
                  padding: ".5rem",
                  borderRadius: "50%",
                }}
              />
              {/* <FontAwesomeIcon icon={} */}
              <span>Projects Space</span>
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
                </Nav>
              }
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>

        <Container>
          <Header className="site_header">
            <h2>{title}</h2>
            <h5>Logged in as: {appData.currentUser.name}</h5>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <TopNav expand={expand} onChange={() => setExpand(!expand)} />
            </div>
          </Header>
          <Container>
            {notifications &&
              notifications.map((notification, index) => {
                return (
                  <Message
                    key={index}
                    closable={true}
                    onClose={() => removeNotification(notification)}
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
