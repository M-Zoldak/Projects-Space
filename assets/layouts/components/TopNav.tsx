import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Divider,
  Nav,
  Navbar,
  Notification,
  Popover,
  Whisper,
} from "rsuite";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { UserNotificationType } from "../../interfaces/EntityTypes/UserNotificationType";

type TopNav = {
  expand: boolean;
  onChange: () => void;
};

const TopNav = ({ expand, onChange }: TopNav) => {
  const { appData, clear } = useAppDataContext();
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("/api/logout", {
      headers: { Authorization: "Bearer " + appData.token },
    })
      .then((res) => clear())
      .catch((err) => clear());

    return navigate("/login");
  }

  function showNotifications() {
    const renderActionButtons = (note: UserNotificationType) => {
      note.actions.map((action) => {
        switch (action) {
          case "Decline":
            return <Button></Button>;
          case "Accept":
            return <Button></Button>;
          case "Redirect":
            return (
              <Button as={Link} to={"/apps"}>
                Go to apps
              </Button>
            );
        }
      });
    };

    return (
      <Popover>
        {appData?.currentUser?.notifications?.length ? (
          appData?.currentUser?.notifications?.map((note, index) => (
            <>
              {index > 0 ? <Divider /> : ""}
              <p>{note.message}</p>
              {note.actions && renderActionButtons(note)}
            </>
          ))
        ) : (
          <p>You don't have any notifications.</p>
        )}
      </Popover>
    );
  }

  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav>
        {/* <Nav.Menu
          noCaret
          placement="bottomEnd"
          trigger="click"
          title={<i className="fa-solid fa-gear"></i>}
        > */}
        {/* <Nav.Item>Help</Nav.Item> */}
        {/* <Nav.Item>Settings</Nav.Item> */}

        <Whisper
          trigger="click"
          placement={"bottomEnd"}
          speaker={showNotifications()}
        >
          <Nav.Item>
            <FontAwesomeIcon icon={faBell} title="Notifications" />
          </Nav.Item>
        </Whisper>
        <Nav.Item onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightToBracket} title="Logout" />
        </Nav.Item>
        {/* </Nav.Menu> */}
      </Nav>
      {/* 
      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
          {expand ? (
            <i className="fa-solid fa-angle-left"></i>
          ) : (
            <i className="fa-solid fa-angle-right"></i>
          )}
        </Nav.Item>
      </Nav> */}
    </Navbar>
  );
};

export default TopNav;
