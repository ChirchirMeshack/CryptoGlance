import { Link } from 'react-router-dom';
import { LineChart } from 'lucide-react';
import { ModeToggle } from '../components/mode-toggle';
import { SearchBar } from '../components/ui/SearchBar';

/**
 * Header component renders the top navigation bar of the application.
 * - Displays the app logo and name, which links to the home page.
 * - Shows a search bar for quick cryptocurrency lookup.
 * - Provides a theme toggle button for switching between light and dark modes.
 * - Stays fixed at the top of the viewport and adapts to light/dark themes.
 */
export function Header() {
  return (
    // Sticky header: remains at the top, with high z-index and theme-aware background/border
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Container: centers content, sets horizontal padding, and aligns items */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and app name: links to home page */}
        <Link to="/" className="flex items-center space-x-2">
          {/* App icon */}
          <LineChart className="h-8 w-8 text-primary-600" />
          {/* App name */}
          <span className="text-xl font-bold">CryptoGlance</span>
        </Link>

        {/* Search bar: centered, with max width */}
        <div className="flex-1 max-w-2xl mx-4">
          <SearchBar />
        </div>

        {/* Right-side controls: theme toggle button */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}