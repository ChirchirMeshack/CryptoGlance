import { useQuery } from '@tanstack/react-query';
import { getTopCryptos } from '../../services/api';
import { CryptoCard } from './CryptoCard';
import { Skeleton } from '../../components/ui/skeleton';

/**
 * CryptoList component fetches and displays a grid of top cryptocurrencies.
 * Features:
 * - Responsive grid layout for all screen sizes
 * - Optimized loading states
 * - Smooth transitions
 * - Accessible loading indicators
 * - Error handling
 */
export function CryptoList() {
  // Fetch the top 12 cryptocurrencies using react-query
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['cryptos'],
    queryFn: () => getTopCryptos(1, 12),
    staleTime: 30000, // 30 seconds
  });

  // Show skeleton placeholders while loading data
  if (isLoading) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        role="status"
        aria-label="Loading cryptocurrencies"
      >
        {/* Render 12 skeleton cards to mimic the CryptoCard layout */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            {/* Header skeleton: logo, name, symbol */}
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" /> {/* Logo */}
              <div>
                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 mb-1" /> {/* Name */}
                <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" /> {/* Symbol */}
              </div>
            </div>
            {/* Price skeleton */}
            <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mb-2" />
            {/* 24h change skeleton */}
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-24 mb-3 sm:mb-4" />
            {/* Market cap and volume skeletons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-1" /> {/* Market Cap label */}
                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" /> {/* Market Cap value */}
              </div>
              <div>
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-1" /> {/* Volume label */}
                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" /> {/* Volume value */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If no data is available (e.g., error), render nothing
  if (!cryptos) {
    return null;
  }

  // Render the list of CryptoCard components for each cryptocurrency
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      role="list"
      aria-label="List of cryptocurrencies"
    >
      {cryptos.map((crypto) => (
        <CryptoCard key={crypto.id} crypto={crypto} />
      ))}
    </div>
  );
}