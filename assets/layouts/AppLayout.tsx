import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Message,
} from "rsuite";
import { PropsWithChildren, useEffect, useState } from "react";
import TopNav from "./components/TopNav";
import { Link } from "react-router-dom";
import SideNav from "./components/SideNav";
import { useNotificationsContext } from "../contexts/NotificationsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { useAppDataContext } from "../contexts/AppDataContext";
import TabsNavbar from "../components/Tabs";

type AppLayout = PropsWithChildren<{
  title: string;
  activePage: string;
  className?: string;
  Tabs?: typeof TabsNavbar;
}>;

const AppLayout = ({
  children,
  title,
  activePage,
  className,
  Tabs,
}: AppLayout) => {
  const { notifications, removeNotification } = useNotificationsContext();
  const { appData } = useAppDataContext();

  return (
    <div className={"sidebar-page" + " " + className}>
      <Container>
        <Sidebar style={{ display: "flex", flexDirection: "column" }}>
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
              <span>Projects Space</span>
            </Link>
          </Sidenav.Header>
          <Sidenav defaultOpenKeys={["3"]} appearance="default">
            <Sidenav.Body>
              <Nav>
                <SideNav activePage={activePage} />
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>

        <Container>
          <Header className="site_header">
            <h2>{title}</h2>
            <h5>Logged in as: {appData?.currentUser?.name}</h5>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <TopNav />
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

export default AppLayout;
