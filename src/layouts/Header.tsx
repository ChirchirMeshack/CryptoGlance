import { Link } from 'react-router-dom';
import { RefreshCw, Menu, Sun, Moon } from 'lucide-react';
import { SearchBar } from '../components/ui/SearchBar';
import { TickerBar } from '../components/Dashboard/TickerBar';
import { useTheme } from '../components/theme-provider';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Header component provides the top navigation bar for the application.
 * Features:
 * - Responsive design for all screen sizes
 * - Accessible navigation elements
 * - Mobile-friendly search bar
 * - Live data indicator
 * - Refresh functionality with loading state
 * - Theme toggle (light/dark mode)
 * - Proper semantic HTML structure
 */
export function Header({ onMenuClick }: HeaderProps) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme, setTheme } = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate and refetch all queries
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries();
      enqueueSnackbar('Data refreshed successfully', { 
        variant: 'success',
        autoHideDuration: 2000,
      });
    } catch (error: unknown) {
      console.error('Refresh failed:', error);
      enqueueSnackbar('Failed to refresh data', { 
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      // Add a small delay to show the loading animation
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    enqueueSnackbar(`Switched to ${newTheme} mode`, { 
      variant: 'info',
      autoHideDuration: 2000,
    });
  };

  return (
    <header 
      className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand section */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
              aria-label="CryptoGlance Home"
            >
              CryptoGlance
            </Link>
            <span 
              className="text-xs md:text-sm text-gray-400 px-2 md:px-3 py-1 rounded-full bg-green-800"
              aria-label="Live market data"
            >
              Live Data
            </span>
          </div>

          {/* Search section - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Actions section */}
          <div className="flex items-center space-x-4">
            <button 
              className={`p-2 text-gray-400 hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh data"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar - shown only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar />
      </div>

      {/* Price ticker */}
      <TickerBar />
    </header>
  );
}