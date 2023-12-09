import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
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
import { http_methods } from "../../Functions/Fetch";

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

  const showNotifications = () => {
    const changeIsSeenOnHover = (note: UserNotificationType) => {
      http_methods.post(
        `/user/${appData.currentUser.id}/changeIsSeen/${note.id}`,
        {},
        appData.token
      );
    };

    const renderActionButtons = (note: UserNotificationType) => {
      return note.actions.map((action) => {
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
            <div key={index} onBlur={() => changeIsSeenOnHover(note)}>
              {index > 0 ? <Divider /> : ""}
              <p>{note.message}</p>
              {note.actions && renderActionButtons(note)}
            </div>
          ))
        ) : (
          <p>You don't have any notifications.</p>
        )}
      </Popover>
    );
  };

  const userHasUnreadNotifications = () => {
    return appData.currentUser.notifications.filter((note) => !note.isSeen)
      .length;
  };

  console.log(userHasUnreadNotifications());

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
          {userHasUnreadNotifications() ? (
            <Badge>
              <Nav.Item>
                <FontAwesomeIcon icon={faBell} title="Notifications" />
              </Nav.Item>
            </Badge>
          ) : (
            <Nav.Item>
              <FontAwesomeIcon icon={faBell} title="Notifications" />
            </Nav.Item>
          )}
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
