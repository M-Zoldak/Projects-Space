import { Nav, Divider, SelectPicker } from "rsuite";
import { IconProps } from "@rsuite/icons/lib/Icon";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookAtlas,
  faGaugeHigh,
  faGear,
  faGlobe,
  faPeopleGroup,
  faProjectDiagram,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDataContext } from "../../contexts/AppDataContext";
import { AppType } from "../../interfaces/EntityTypes/AppType";

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

function compare(a: string, b: string) {
  let nameA = a.toUpperCase();
  let nameB = b.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

function AppChooser(index: number) {
  const { appData, setAppId } = useAppDataContext();

  const handleChange = (appId: string) => {
    setAppId(appId);
  };

  const provideSelectData = (apps: Array<AppType>) => {
    return apps.map((app) => {
      return { label: app.name, value: app.id.toString() };
    });
  };

  return appData.apps && appData.apps.length ? (
    <SelectPicker
      key={index}
      data={provideSelectData(appData.apps)}
      searchable={false}
      defaultValue={appData?.currentAppId}
      onChange={handleChange}
      style={{
        width: "calc(100% - 40px)",
        marginInline: "20px",
        marginBottom: "10px",
      }}
      label={"App"}
    />
  ) : (
    <p
      style={{
        width: "calc(100% - 40px)",
        marginInline: "20px",
        marginBottom: "10px",
      }}
      key={index}
    >
      Create your first App!
    </p>
  );
}

export default function SideNav({ activePage }: { activePage: string }) {
  const { appData } = useAppDataContext();

  const defaultPageLinks: PageLinksListInterface = [
    new PageLink(
      "Dashboard",
      "/dashboard",
      <FontAwesomeIcon icon={faGaugeHigh} />
    ),
    appData.currentAppId &&
      new PageLink(
        "Projects",
        "/projects",
        <FontAwesomeIcon icon={faProjectDiagram} />
      ),
    new MenuDivider(),
    new PageLink("Sites", "/sites", <FontAwesomeIcon icon={faGlobe} />),
    new PageLink(
      "Customers",
      "/customers",
      <FontAwesomeIcon icon={faPeopleGroup} />
    ),
    // new PageLink('About', '/about'),
    // new PageLink('Contact', '/contact'),
    new MenuDivider(),
    "AppChooser",
    new PageLink("My Apps", "/apps", <FontAwesomeIcon icon={faBookAtlas} />),
    // new PageLink(
    //   'App Settings',
    //   '/settings/user',
    //   <FontAwesomeIcon icon={faGears} />
    // ),
    new MenuDivider(),
    new PageLink("Profile", "/profile", <FontAwesomeIcon icon={faUserGear} />),
    new PageLink("Settings", "/settings", <FontAwesomeIcon icon={faGear} />),
  ];

  const renderMenu = () => {
    if (!defaultPageLinks) return <></>;
    console.log(defaultPageLinks);
    return defaultPageLinks.map((menuItem, index) => {
      if (menuItem == undefined) return;
      if (menuItem == "AppChooser") {
        return AppChooser(index);
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
