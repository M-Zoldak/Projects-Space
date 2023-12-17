import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FluidText from "../../components/Text/FluidText";
import PortalLayout from "../../layouts/PortalLayout";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Contact() {
  return (
    <PortalLayout activePage="Contact" title="Contact Page">
      <FluidText>
        <Link to="https://www.github.com/M-Zoldak">
          <FontAwesomeIcon icon={faGithub} />
          Github
        </Link>
      </FluidText>
    </PortalLayout>
  );
}

export default Contact;
