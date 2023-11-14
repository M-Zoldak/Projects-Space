import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Button,
  FlexboxGrid,
  Message,
  MessageProps,
} from 'rsuite';
import { PropsWithChildren, useEffect, useState } from 'react';
import NavToggle from './components/NavToggle';
import { Link, useNavigate } from 'react-router-dom';
import SideNav, {
  PageLinksListInterface,
  defaultPageLinks,
} from './components/SideNav';
import { redirect } from 'react-router-dom';
import useToken from '../components/App/useToken';
import { TypeAttributes } from 'rsuite/esm/@types/common';

export function ErrorMessagesFunctionSignature(
  param: Array<MessageInterface>
) {}

export type MessageInterface = {
  messageProps?: MessageProps;
  text: string;
};

type StandardLayout = PropsWithChildren<{
  title: string;
  activePage: string;
  messages?: Array<MessageInterface>;
}>;

const StandardLayout = ({
  children,
  title,
  activePage,
  messages,
}: StandardLayout) => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState(true);
  const [userPageLinks, setUserPageLinks] =
    useState<PageLinksListInterface>(null);
  const { token, setToken } = useToken();

  const handleLogout = async () => {
    let loggedOut = await fetch('/api/logout', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((res) => res.json())
      .then((data) => data.logged_out);

    if (loggedOut) {
      setToken('');
    }

    return navigate('/home');
  };

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
                  <SideNav
                    activePage={activePage}
                    menuItems={defaultPageLinks}
                  />
                  <SideNav activePage={activePage} menuItems={userPageLinks} />
                </Nav>
              }
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
        </Sidebar>

        <Container>
          <Header className="site_header">
            <h2>{title}</h2>
            <FlexboxGrid justify="space-between" align="middle">
              <Button onClick={handleLogout}>Logout</Button>
            </FlexboxGrid>
          </Header>
          <Container>
            <>
              {messages &&
                messages.map((message, index) => {
                  return (
                    <Message
                      key={index}
                      closable={true}
                      type={message.messageProps?.type ?? 'error'}
                    >
                      {message.text}
                    </Message>
                  );
                })}
            </>
            <Content className="content_container">{children}</Content>
          </Container>
        </Container>
      </Container>
    </div>
  );
};

export default StandardLayout;
