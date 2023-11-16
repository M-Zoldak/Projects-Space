import React from 'react';
import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Button,
  FlexboxGrid,
  Notification,
  NotificationProps,
  Message,
} from 'rsuite';
import { PropsWithChildren, useState } from 'react';
import NavToggle from './components/NavToggle';
import { Link, useNavigate } from 'react-router-dom';
import SideNav from './components/SideNav';
import useToken from '../components/App/useToken';
import NotificationsProvider, {
  useNotificationsContext,
} from '../contexts/NotificationsContext';

export function NotificationsFunctionSignature(
  param: Array<NotificationInterface>
) {}

export type NotificationInterface = {
  notificationProps?: NotificationProps;
  text: string;
};

type StandardLayout = PropsWithChildren<{
  title: string;
  activePage: string;
  // notifications?: Array<NotificationInterface>;
}>;

const StandardLayout = ({
  children,
  title,
  activePage, // notifications,
}: StandardLayout) => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(true);
  // const [userPageLinks, setUserPageLinks] =
  //   useState<PageLinksListInterface>(null);
  const { token, setToken } = useToken();
  // const { notifications } = useContext();
  const { notifications } = useNotificationsContext();

  async function handleLogout() {
    await fetch('/api/logout', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((res) => setToken(''))
      .catch((err) => setToken(''));

    return navigate('/home');
  }

  console.log(notifications);

  return (
    <div className="sidebar-page">
      <Container>
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column' }}
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
            defaultOpenKeys={['3']}
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
          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
          .tsx
        </Sidebar>

        <Container>
          <Header className="site_header">
            <h2>{title}</h2>
            {token ? (
              <FlexboxGrid justify="space-between" align="middle">
                <Button onClick={handleLogout}>Logout</Button>
              </FlexboxGrid>
            ) : (
              <FlexboxGrid justify="space-between" align="middle">
                <Button as={Link} to={'/login'}>
                  Login
                </Button>
              </FlexboxGrid>
            )}
          </Header>
          <Container>
            {notifications &&
              notifications.map((notification, index) => {
                return (
                  <Message
                    key={index}
                    closable={true}
                    type={notification.notificationProps?.type ?? 'error'}
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
