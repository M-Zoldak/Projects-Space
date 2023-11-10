import { Nav, Navbar } from 'rsuite';

type NavToggle = {
    expand: boolean;
    onChange: () => void;
};

const NavToggle = ({ expand, onChange }: NavToggle) => {
    return (
        <Navbar appearance="subtle" className="nav-toggle">
            <Nav>
                <Nav.Menu
                    noCaret
                    placement="topStart"
                    trigger="click"
                    title={<i className="fa-solid fa-gear"></i>}
                >
                    <Nav.Item>Help</Nav.Item>
                    <Nav.Item>Settings</Nav.Item>
                    <Nav.Item>Sign out</Nav.Item>
                </Nav.Menu>
            </Nav>

            <Nav pullRight>
                <Nav.Item
                    onClick={onChange}
                    style={{ width: 56, textAlign: 'center' }}
                >
                    {expand ? (
                        <i className="fa-solid fa-angle-left"></i>
                    ) : (
                        <i className="fa-solid fa-angle-right"></i>
                    )}
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default NavToggle;
