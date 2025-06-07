import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout component provides the main structural layout for the application.
 * - Renders a persistent Header at the top.
 * - Displays a Sidebar for navigation on the left.
 * - Main content area is rendered to the right of the Sidebar.
 * - Uses flexbox for responsive and adaptive layout.
 *
 * Props:
 * - children: ReactNode - The page content to be displayed within the layout.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    // Root container: vertical flex, fills viewport height
    <div className="min-h-screen flex flex-col">
      {/* Top navigation/header bar */}
      <Header />
      {/* Main content area: horizontal flex */}
      <div className="flex-1 flex">
        {/* Sidebar navigation */}
        <Sidebar />
        {/* Main page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}