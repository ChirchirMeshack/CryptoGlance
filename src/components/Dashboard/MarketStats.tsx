import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, DollarSign, Coins } from 'lucide-react';
import { getGlobalStats } from '../../services/api';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../../utils/formatters';
import { Skeleton } from '../../components/ui/skeleton';

/**
 * MarketStats component displays global cryptocurrency market statistics.
 * Features:
 * - Responsive grid layout
 * - Optimized loading states
 * - Accessible stat cards
 * - Clear visual hierarchy
 * - Touch-friendly interactions
 */
export function MarketStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['globalStats'],
    queryFn: getGlobalStats,
    staleTime: 30000, // 30 seconds
  });

  const statCards = stats
    ? [
        {
          title: 'Total Market Cap',
          value: formatCurrency(stats.total_market_cap.usd),
          change: stats.market_cap_change_percentage_24h_usd,
          icon: DollarSign,
          description: 'Total value of all cryptocurrencies',
        },
        {
          title: '24h Volume',
          value: formatCurrency(stats.total_volume.usd),
          icon: TrendingUp,
          description: 'Total trading volume in the last 24 hours',
        },
        {
          title: 'Active Cryptocurrencies',
          value: formatLargeNumber(stats.active_cryptocurrencies),
          icon: Coins,
          description: 'Number of active cryptocurrencies',
        },
        {
          title: 'Market Dominance',
          value: `BTC ${stats.market_cap_percentage?.btc?.toFixed(1) ?? '--'}%`,
          change: `ETH ${stats.market_cap_percentage?.eth?.toFixed(1) ?? '--'}%`,
          isPositive: true,
          icon: TrendingUp,
          description: 'Market share of top cryptocurrencies',
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-6 sm:h-8 w-32 sm:w-40 mb-2" />
            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      role="list"
      aria-label="Market statistics"
    >
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
                     hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
            role="listitem"
            aria-label={`${stat.title}: ${stat.value}`}
          >
            {/* Stat title and icon */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.title}</h3>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            </div>

            {/* Stat value */}
            <p className="text-xl sm:text-2xl font-semibold mb-2">{stat.value}</p>

            {/* Show change indicator if 'change' property exists */}
            {typeof stat.change === 'number' ? (
              <div className="flex items-center space-x-1">
                {stat.change >= 0 ? (
                  <TrendingUp 
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" 
                    aria-hidden="true"
                  />
                ) : (
                  <TrendingDown 
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" 
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-sm sm:text-base ${
                    stat.change >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                  aria-label={`${stat.change >= 0 ? 'increased' : 'decreased'} by ${formatPercentage(stat.change)}`}
                >
                  {formatPercentage(stat.change)}
                </span>
              </div>
            ) : stat.change ? (
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">{stat.change}</p>
            ) : null}

            {/* Description for screen readers */}
            <p className="sr-only">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}