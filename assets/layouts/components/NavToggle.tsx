import { useNavigate } from 'react-router-dom';
import { Nav, Navbar } from 'rsuite';
import useToken from '../../components/App/useToken';

type PopupMenu = {
  expand: boolean;
  onChange: () => void;
};

const PopupMenu = ({ expand, onChange }: PopupMenu) => {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch('/api/logout', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then((res) => setToken(''))
      .catch((err) => setToken(''));

    return navigate('/home');
  }

  return (
    <Navbar appearance="subtle" className="nav-toggle">
      <Nav>
        <Nav.Menu
          noCaret
          placement="bottomEnd"
          trigger="click"
          title={<i className="fa-solid fa-gear"></i>}
        >
          <Nav.Item>Help</Nav.Item>
          <Nav.Item>Settings</Nav.Item>
          <Nav.Item onClick={handleLogout}>Sign out</Nav.Item>
        </Nav.Menu>
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

export default PopupMenu;
