import { Nav, Divider } from "rsuite";
import { IconProps } from "@rsuite/icons/lib/Icon";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faGaugeHigh,
  faGear,
  faGlobeEurope,
  faHome,
  faLightbulb,
  faPhone,
  faRoad,
  faTasks,
  faUserGear,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { useCookies } from "react-cookie";

export interface PageLinkInterface {
  name: string;
  url: string;
  subsites?: Array<PageLinkInterface> | null;
  icon: React.ReactElement<IconProps>;
}

export type PageLinksListInterface = Array<
  PageLink | MenuDivider | "AppChooser"
> | null;

class MenuDivider {
  render = (key: number | string) => <Divider key={key} />;
}

class PageLink implements PageLinkInterface {
  name: string;
  url: string;
  subsites: Array<PageLinkInterface>;
  icon: React.ReactElement<IconProps>;

  constructor(
    name: string,
    url: string,
    icon?: React.ReactElement<IconProps>,
    subsites?: Array<PageLinkInterface>
  ) {
    this.name = name;
    this.url = url;
    this.icon = icon || null;
    if (subsites) this.subsites = subsites;
  }
}

export default function PortalSideNav({ activePage }: { activePage: string }) {
  const { appData } = useAppDataContext();
  const [cookies] = useCookies();

  useEffect(() => {}, [appData]);

  let token = cookies.token;
  const defaultPageLinks: PageLinksListInterface = [
    new PageLink("Home", "/", <FontAwesomeIcon icon={faHome} />),
    new PageLink("About", "/about", <FontAwesomeIcon icon={faLightbulb} />),
    new PageLink("Roadmap", "/roadmap", <FontAwesomeIcon icon={faTasks} />),
    new PageLink("Contact", "/contact", <FontAwesomeIcon icon={faPhone} />),
    new MenuDivider(),
    !token &&
      new PageLink(
        "Login",
        "/login",
        <FontAwesomeIcon icon={faArrowRightToBracket} />
      ),
    !token &&
      new PageLink(
        "Register",
        "/register",
        <FontAwesomeIcon icon={faUserPlus} />
      ),
    token &&
      new PageLink(
        "To projects space",
        "/dashboard",
        <FontAwesomeIcon icon={faGlobeEurope} />
      ),

    // new PageLink("Profile", "/profile", <FontAwesomeIcon icon={faUserGear} />),
    // new PageLink("Settings", "/settings", <FontAwesomeIcon icon={faGear} />),
  ];

  const renderMenu = () => {
    if (!defaultPageLinks) return <></>;
    return defaultPageLinks
      .filter((e) => !!e)
      .map((menuItem, index) => {
        if (menuItem == undefined) return;
        if (menuItem == "AppChooser") {
        } else if (menuItem instanceof MenuDivider) {
          return menuItem.render(index);
        } else if (menuItem.subsites) {
          return renderSubsites(menuItem, index);
        } else {
          return renderSingleLink(menuItem, index);
        }
      });
  };

  const renderSubsites = (
    { name, url, subsites, icon }: PageLinkInterface,
    key: number | string
  ) => {
    return (
      <Nav.Menu
        title={name}
        key={key}
        active={subsites.some((page) => page.name == name)}
        eventKey={key.toString()}
        icon={icon}
      >
        {subsites.map((menuItem, index) =>
          menuItem.subsites instanceof Array
            ? renderSubsites(menuItem, key + "-" + index)
            : renderSingleLink(menuItem, key + "-" + index)
        )}
      </Nav.Menu>
    );
  };

  const renderSingleLink = (
    { name, url, subsites, icon }: PageLinkInterface,
    key: number | string
  ) => {
    return (
      <Nav.Item
        as={Link}
        to={url}
        key={key}
        eventKey={key.toString()}
        active={activePage == name}
        icon={icon}
      >
        {name}
      </Nav.Item>
    );
  };

  return <>{renderMenu()}</>;
}
