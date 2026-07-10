import { NavInterface } from '../types/navigation.type';

export const NavItems: NavInterface[] = [
  {
    title: 'Links',
    route: '/dashboard/links',
    icon: 'fa-solid fa-link',
  },

  {
    title: 'Appearance',
    route: '/dashboard/appearance',
    icon: 'fa-solid fa-palette',
  },

  {
    title: 'Settings',
    route: '/dashboard/settings',
    icon: 'fa-solid fa-phabricator',
  },

  {
    title: 'Preview',
    route: 'p',
    icon: 'fa-solid fa-phabricator',
  },
];
