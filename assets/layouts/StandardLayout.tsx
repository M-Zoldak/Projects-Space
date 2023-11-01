import { Container, Header, Sidebar, Sidenav, Content, Nav } from 'rsuite';

import DashboardIcon from '@rsuite/icons/Dashboard';
import { CSSProperties, PropsWithChildren, useEffect, useState } from 'react';
import NavToggle from '../components/NavToggle';
import { Link } from 'react-router-dom';

const pageLinks = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Sites',
    url: '/sites',
  },
  {
    name: 'About',
    url: '/about',
  },
  {
    name: 'Contact',
    url: '/contact',
  },
];

type StandardLayout = PropsWithChildren<{
  title: string;
}>;

const StandardLayout = ({ children, title }: StandardLayout) => {
  const [expand, setExpand] = useState(true);

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
              <>MyProjectsLib</>
            </Link>
          </Sidenav.Header>
          <Sidenav
            expanded={expand}
            defaultOpenKeys={['3']}
            appearance="default"
          >
            <Sidenav.Body>
              <Nav>
                {pageLinks.map((page, key) => {
                  return (
                    <Nav.Item
                      as={Link}
                      key={key}
                      to={page.url}
                      eventKey={key.toString()}
                      active
                      icon={<DashboardIcon />}
                    >
                      {page.name}
                    </Nav.Item>
                  );
                })}

                {/* <Nav.Item eventKey="2">User Group</Nav.Item> */}
                {/* <Nav.Menu
                                    eventKey="3"
                                    trigger="hover"
                                    title="Advanced"
                                    placement="rightStart"
                                >
                                    <Nav.Item eventKey="3-1">Geo</Nav.Item>
                                    <Nav.Item eventKey="3-2">Devices</Nav.Item>
                                    <Nav.Item eventKey="3-3">Brand</Nav.Item>
                                    <Nav.Item eventKey="3-4">Loyalty</Nav.Item>
                                    <Nav.Item eventKey="3-5">
                                        Visit Depth
                                    </Nav.Item>
                                </Nav.Menu>
                                <Nav.Menu
                                    eventKey="4"
                                    trigger="hover"
                                    title="Settings"
                                    placement="rightStart"
                                >
                                    <Nav.Item eventKey="4-1">
                                        Applications
                                    </Nav.Item>
                                    <Nav.Item eventKey="4-2">Websites</Nav.Item>
                                    <Nav.Item eventKey="4-3">Channels</Nav.Item>
                                    <Nav.Item eventKey="4-4">Tags</Nav.Item>
                                    <Nav.Item eventKey="4-5">Versions</Nav.Item>
                                </Nav.Menu> */}
              </Nav>
            </Sidenav.Body>
          </Sidenav>
          <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
        </Sidebar>

        <Container>
          <Header>
            <h2>{title}</h2>
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
