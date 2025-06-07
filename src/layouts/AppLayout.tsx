import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout component provides the main structural layout for the application.
 * Features:
 * - Responsive layout that adapts to all screen sizes
 * - Mobile-first design with collapsible sidebar
 * - Accessible navigation structure
 * - Keyboard navigation support
 * - Proper semantic HTML structure
 * - Performance optimized with useCallback
 *
 * Props:
 * - children: ReactNode - The page content to be displayed within the layout.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    // Root container: vertical flex, fills viewport height
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top navigation/header bar */}
      <Header onMenuClick={toggleSidebar} />

      {/* Main content area: horizontal flex */}
      <div className="flex-1 flex relative">
        {/* Mobile menu button */}
        <button
          className="fixed bottom-4 right-4 z-50 md:hidden bg-primary-600 text-white p-3 rounded-full shadow-lg"
          onClick={toggleSidebar}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>

        {/* Sidebar navigation with overlay */}
        <div
          className={`
            fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            md:hidden
          `}
          onClick={closeSidebar}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main page content */}
        <main 
          className="flex-1 p-4 md:p-6 overflow-x-hidden"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}