import { Home, Star, TrendingUp, X, Github } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGlobalStats } from '../services/api';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import { Skeleton } from '../components/ui/skeleton';
import { useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar component provides the main navigation and market statistics.
 * Features:
 * - Responsive design with mobile support
 * - Accessible navigation
 * - Keyboard navigation support
 * - Market statistics display
 * - Loading states
 * - Proper semantic HTML structure
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['globalStats'],
    queryFn: getGlobalStats,
    staleTime: 30000, // 30 seconds
  });

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Star, label: 'Watchlist', path: '/watchlist' },
    { icon: TrendingUp, label: 'Markets', path: '/markets' },
  ];

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile close button */}
      <button
        className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={onClose}
        aria-label="Close menu"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      <nav className="p-4 pt-16 md:pt-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
          Market Statistics
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </>
          ) : stats ? (
            <>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Market Cap</p>
                <p className="font-medium">
                  {formatCurrency(stats.total_market_cap.usd)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  24h Change:{' '}
                  <span
                    className={
                      stats.market_cap_change_percentage_24h_usd >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    {formatPercentage(stats.market_cap_change_percentage_24h_usd)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">24h Volume</p>
                <p className="font-medium">
                  {formatCurrency(stats.total_volume.usd)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Cryptocurrencies</p>
                <p className="font-medium">{formatLargeNumber(stats.active_cryptocurrencies)}</p>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} CryptoGlance
          </p>
          <a
            href="https://github.com/ChirchirMeshack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >

            Made with ❤️ by ChirchirMeshack
            <Github className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </aside>
  );
}