import { Nav, Divider, SelectPicker } from 'rsuite';
import { IconProps } from '@rsuite/icons/lib/Icon';
import DashboardIcon from '@rsuite/icons/Dashboard';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookAtlas,
  faGear,
  faGears,
  faGlobe,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';
import useApp from '../../components/App/useApp';
import useAppsData, { updateAppData } from '../../components/App/useAppsData';

export interface PageLinkInterface {
  name: string;
  url: string;
  subsites?: Array<PageLinkInterface> | null;
  icon: React.ReactElement<IconProps>;
}

export type PageLinksListInterface = Array<PageLink | MenuDivider> | null;

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

function AppChooser() {
  const { appsData, setAppsData } = useAppsData();
  const { appId, setAppId } = useApp();

  useEffect(() => {
    if (appsData) {
      setAppId(appId.toString());
    } else {
      updateAppData();
    }
  }, []);

  const handleChange = (val: string) => {
    setAppId(val);
  };

  return appsData && appsData.length ? (
    <SelectPicker
      data={appsData}
      searchable={false}
      defaultValue={appId.toString()}
      onChange={handleChange}
      style={{
        width: 'calc(100% - 40px)',
        marginInline: '20px',
        marginBottom: '10px',
      }}
      label={'App'}
    />
  ) : (
    <></>
  );
}

export const defaultPageLinks: PageLinksListInterface = [
  new PageLink('Dashboard', '/dashboard', <DashboardIcon />),
  new PageLink('Sites', '/sites', <FontAwesomeIcon icon={faGlobe} />),
  new PageLink('About', '/about'),
  new PageLink('Contact', '/contact'),
  new MenuDivider(),
  new PageLink('My Apps', '/apps', <FontAwesomeIcon icon={faBookAtlas} />),
  // new PageLink(
  //   'App Settings',
  //   '/settings/user',
  //   <FontAwesomeIcon icon={faGears} />
  // ),
  new MenuDivider(),
  new PageLink('Profile', '/profile', <FontAwesomeIcon icon={faUserGear} />),
  new PageLink('Settings', '/settings', <FontAwesomeIcon icon={faGear} />),
];

export default function SideNav({
  activePage,
  menuItems,
}: {
  activePage: string;
  menuItems: PageLinksListInterface;
}) {
  const renderMenu = () => {
    if (!menuItems) return <></>;
    return menuItems.map((menuItem, index) => {
      if (menuItem instanceof MenuDivider) {
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
      <>
        <Nav.Menu
          title={name}
          key={key}
          active={subsites.some((page) => page.name == name)}
          eventKey={key.toString()}
          icon={icon}
        >
          {subsites.map((menuItem, index) =>
            menuItem.subsites instanceof Array
              ? renderSubsites(menuItem, key + '-' + index)
              : renderSingleLink(menuItem, key + '-' + index)
          )}
        </Nav.Menu>
      </>
    );
  };

  const renderSingleLink = (
    { name, url, subsites, icon }: PageLinkInterface,
    key: number | string
  ) => {
    return (
      <>
        {name == 'My Apps' && AppChooser()}
        <Nav.Item
          as={Link}
          to={url}
          eventKey={key.toString()}
          active={activePage == name}
          icon={icon}
        >
          {name}
        </Nav.Item>
      </>
    );
  };

  return <>{renderMenu()}</>;
}
