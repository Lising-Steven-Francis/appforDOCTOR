import type { ComponentProps } from 'react';

import { cloneElement } from 'react';

import type { NavItemDataProps, NavItemOptionsProps } from '../types';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type BaseProps = {
  component?: typeof RouterLink | 'div';
  href?: string;
  target?: string;
  rel?: string;
} & Partial<ComponentProps<typeof RouterLink>>;

type CreateNavItemReturn = {
  baseProps: BaseProps;
  renderIcon: React.ReactNode;
  renderInfo: React.ReactNode;
};

type CreateNavItemProps = Pick<NavItemDataProps, 'path' | 'icon' | 'info'> & NavItemOptionsProps;

export function createNavItem({
  path,
  icon,
  info,
  render,
  hasChild,
  externalLink,
  enabledRootRedirect,
}: CreateNavItemProps): CreateNavItemReturn {
  const linkProps: BaseProps = externalLink
    ? { href: path, target: '_blank', rel: 'noopener' }
    : { component: RouterLink, href: path };

  const baseProps: BaseProps = hasChild && !enabledRootRedirect ? { component: 'div' } : linkProps;

  /**
   * Render @icon
   */
  let renderIcon = null;

  if (icon && render?.navIcon && typeof icon === 'string') {
    renderIcon = render?.navIcon[icon];
  } else {
    renderIcon = icon;
  }

  /**
   * Render @info
   */
  let renderInfo = null;

  if (info && render?.navInfo && Array.isArray(info)) {
    const [key, value] = info;
    const element = render.navInfo(value)[key];

    renderInfo = element ? cloneElement(element) : null;
  } else {
    renderInfo = info;
  }

  return {
    baseProps,
    renderIcon,
    renderInfo,
  };
}
