import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Button,
} from 'rsuite';
import { PropsWithChildren, useEffect, useState } from 'react';
import NavToggle from './components/NavToggle';
import { Link } from 'react-router-dom';
import SideNav, {
  PageLinksListInterface,
  defaultPageLinks,
} from './components/SideNav';
import useToken from '../components/App/useToken';

type StandardLayout = PropsWithChildren<{
  title: string;
  activePage: string;
}>;

const StandardLayout = ({ children, title, activePage }: StandardLayout) => {
  const [expand, setExpand] = useState(true);
  const [userPageLinks, setUserPageLinks] =
    useState<PageLinksListInterface>(null);
  const { token, setToken } = useToken();
  useEffect(() => {}, null);

  const handleLogout = async () => {
    let loggedOut = await fetch('/api/logout', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((res) => res.json())
      .then((data) => data.success);
    setToken('');
  };

  return (
    <div className="show-fake-browser sidebar-page">
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
          <Header>
            <h2>{title}</h2>
            <div>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </Header>
          <Container>
            <Content>{children}</Content>
          </Container>
        </Container>
      </Container>
    </div>
  );
};

export default StandardLayout;
