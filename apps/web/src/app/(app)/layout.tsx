import { Suspense } from 'react';
import { ClientOnly } from '@/components/client-only';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <a
        href='#main-content'
        className='bg-background ring-ring sr-only rounded-md px-3 py-2 text-sm font-medium shadow focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:ring-2'
      >
        Skip to content
      </a>
      {/* usePathname() is dynamic on [id] routes, so the nav parts sit in Suspense. */}
      <Suspense>
        {/* Phone vs desktop sidebar differs from the prerendered HTML, so render it after mount. */}
        <ClientOnly>
          <AppSidebar />
        </ClientOnly>
      </Suspense>
      <SidebarInset id='main-content' tabIndex={-1} className='scroll-mt-16'>
        <Suspense>
          <Header />
        </Suspense>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
