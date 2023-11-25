import { Container, Header, Content, Footer, Navbar } from "rsuite";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

const LoginLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="login-page">
      <Container>
        <Header>
          <Navbar appearance="inverse">
            <Navbar.Brand as={Link} to={"/"} className="navbar-brand">
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
              <span>Projects-space</span>
            </Navbar.Brand>
          </Navbar>
        </Header>
        <Content>{children}</Content>
        <Footer>Footer</Footer>
      </Container>
    </div>
  );
};

export default LoginLayout;
