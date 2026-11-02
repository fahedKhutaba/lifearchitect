'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/this-week': [{ title: 'This week', link: '/this-week' }],
  '/targets': [{ title: 'Targets', link: '/targets' }],
  '/settings': [{ title: 'Settings', link: '/settings' }]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    // Prototype: a deeper path such as /targets/<id> becomes Targets > Details
    if (pathname.startsWith('/targets/')) {
      return [
        { title: 'Targets', link: '/targets' },
        { title: 'Details', link: pathname }
      ];
    }
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
