import { Nav, Divider } from 'rsuite';
import { IconProps } from '@rsuite/icons/lib/Icon';
import DashboardIcon from '@rsuite/icons/Dashboard';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookAtlas,
  faGear,
  faGears,
  faGlobe,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';

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
      <Nav.Item
        as={Link}
        key={key}
        to={url}
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
