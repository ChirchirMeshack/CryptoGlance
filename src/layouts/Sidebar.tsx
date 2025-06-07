import { Home, LineChart, Star, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGlobalStats } from '../services/api';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import { Skeleton } from '../components/ui/skeleton';

export function Sidebar() {
  const location = useLocation();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['globalStats'],
    queryFn: getGlobalStats,
  });

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Star, label: 'Watchlist', path: '/watchlist' },
    { icon: TrendingUp, label: 'Markets', path: '/markets' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
      <nav className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
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
    </aside>
  );
}