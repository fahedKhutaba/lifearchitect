'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

const noop = () => () => {};

/**
 * Renders children only in the browser. The prototype's mock data depends on the
 * current date, so it must not run during prerender.
 */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return mounted ? children : fallback;
}
