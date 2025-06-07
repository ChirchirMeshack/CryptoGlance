import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, DollarSign, Coins } from 'lucide-react';
import { getGlobalStats } from '../../services/api';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../../utils/formatters';
import { Skeleton } from '../../components/ui/skeleton';

/**
 * MarketStats component fetches and displays global cryptocurrency market statistics.
 * It shows total market cap, 24h volume, and active cryptocurrencies, with loading skeletons.
 */
export function MarketStats() {
  // Fetch global stats using react-query for caching and async state management
  const { data: stats, isLoading } = useQuery({
    queryKey: ['globalStats'],
    queryFn: getGlobalStats,
  });

  // Prepare the data for each stat card if stats are available
  // Assume you fetch 'cryptocurrencies' data elsewhere and pass it as a prop or fetch here.
  // For demonstration, add logic here (ideally, fetch with react-query and handle loading/errors).
  // Example: const { data: cryptocurrencies = [] } = useQuery(...);

  // Placeholder: Replace with actual data fetching logic
  // const cryptocurrencies = stats?.cryptocurrencies || []; // Adjust according to your API response

  // Calculate gainers and average change
  // const gainers =
  //   cryptocurrencies.filter((crypto: any) => crypto.price_change_percentage_24h > 0).length;
  // const averageChange =
  //   cryptocurrencies.length > 0
  //     ? cryptocurrencies.reduce(
  //         (sum: number, crypto: any) => sum + crypto.price_change_percentage_24h,
  //         0
  //       ) / cryptocurrencies.length
  //     : 0;

  const statCards = stats
    ? [
        {
          title: 'Total Market Cap',
          value: formatCurrency(stats.total_market_cap.usd),
          change: stats.market_cap_change_percentage_24h_usd,
          icon: DollarSign,
        },
        {
          title: '24h Volume',
          value: formatCurrency(stats.total_volume.usd),
          icon: TrendingUp,
        },
        {
          title: 'Active Cryptocurrencies',
          value: formatLargeNumber(stats.active_cryptocurrencies),
          icon: Coins,
        },
        {
          title: 'Market Dominance',
          value: `BTC ${stats.market_cap_percentage?.btc?.toFixed(1) ?? '--'}%`,
          change: `ETH ${stats.market_cap_percentage?.eth?.toFixed(1) ?? '--'}%`,
          isPositive: true,
          icon: TrendingUp,
        },
        // {
        //   title: 'Gainers/Losers',
        //   value: `${gainers}/${cryptocurrencies.length - gainers}`,
        //   change:
        //     cryptocurrencies.length > 0
        //       ? `${((gainers / cryptocurrencies.length) * 100).toFixed(1)}% up`
        //       : '--',
        //   isPositive: gainers > cryptocurrencies.length / 2,
        //   icon: gainers > cryptocurrencies.length / 2 ? TrendingUp : TrendingDown,
        // },
      ]
    : [];

  // Show loading skeletons while data is being fetched
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {/* Skeleton for title */}
            <Skeleton className="h-6 w-32 mb-4" />
            {/* Skeleton for value */}
            <Skeleton className="h-8 w-40 mb-2" />
            {/* Skeleton for change */}
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  // Render the stat cards with actual data
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {/* Stat title and icon */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400">{stat.title}</h3>
              <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            {/* Stat value */}
            <p className="text-2xl font-semibold mb-2">{stat.value}</p>
            {/* Show change indicator if 'change' property exists */}
            {typeof stat.change === 'number' && (
              <div className="flex items-center space-x-1">
                {/* Up or down arrow based on change value */}
                {stat.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                {/* Percentage change, colored by positive/negative */}
                <span
                  className={
                    stat.change >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }
                >
                  {formatPercentage(stat.change)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}