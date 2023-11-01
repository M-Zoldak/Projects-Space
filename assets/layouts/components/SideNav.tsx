import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Divider,
} from 'rsuite';
import { IconProps } from '@rsuite/icons/lib/Icon';
import DashboardIcon from '@rsuite/icons/Dashboard';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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
  new PageLink(
    'Dashboard',
    '/dashboard',
    <i className="fa-solid fa-globe"></i>
  ),
  new PageLink('Sites', '/sites'),
  new PageLink('About', '/about'),
  new PageLink('Contact', '/contact'),
  new MenuDivider(),
  new PageLink('My Apps', '/apps'),
  new PageLink('App Settings', '/settings/user'),
  new MenuDivider(),
  new PageLink('Settings', '/settings'),
  new PageLink('Profile', '/profile'),
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
