import type { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      { title: 'This week', url: '/this-week', icon: 'dashboard', items: [] },
      { title: 'Targets', url: '/targets', icon: 'check', items: [] },
      { title: 'Settings', url: '/settings', icon: 'settings', items: [] }
    ]
  }
];
