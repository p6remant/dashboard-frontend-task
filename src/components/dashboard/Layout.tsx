import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden shrink-0 lg:block">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} variant="desktop" />
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden',
          mobileDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!mobileDrawerOpen}
        onClick={closeMobileDrawer}
      />

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 max-w-sm border-r border-border shadow-lg transition-transform duration-300 ease-out lg:hidden',
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
        )}
      >
        <Sidebar
          variant="drawer"
          isOpen
          onToggle={closeMobileDrawer}
          onNavigate={closeMobileDrawer}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={toggleMobileDrawer} />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1600px] px-2 py-4 sm:px-3 sm:py-5 md:px-5 md:py-6 lg:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
