import {
  Nav,
  Container,
  Header,
  Content,
  Footer,
  Navbar,
  Sidebar,
  Sidenav,
} from "rsuite";
import { PropsWithChildren, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import PortalSideNav from "./components/PortalSideNav";

type PortalLayoutProps = PropsWithChildren<{
  title: string;
  activePage: string;
  withContainer?: boolean;
}>;

export default function PortalLayout({
  children,
  activePage,
  withContainer = true,
}: PortalLayoutProps) {
  return (
    <div className="portal">
      {/* <Container> */}
      <Container>
        <Header>
          <div>
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
          </div>
        </Header>
        <Container>
          <Sidebar>
            <Sidenav>
              <Sidenav.Body>
                <Nav>
                  <PortalSideNav activePage={activePage} />
                </Nav>
              </Sidenav.Body>
            </Sidenav>
          </Sidebar>
          <Container>
            {withContainer ? (
              <Content className="content_container">{children}</Content>
            ) : (
              children
            )}
          </Container>
        </Container>
        <Footer>&copy; All rights reserved - Mateusz Żołdak</Footer>
      </Container>

      {/* <Header>
          <Navbar appearance="inverse">
            <div></div>
          </Navbar>
        </Header>
        <Content>{children}</Content>
        <Footer>Footer</Footer>
      </Container> */}
    </div>
  );
}
