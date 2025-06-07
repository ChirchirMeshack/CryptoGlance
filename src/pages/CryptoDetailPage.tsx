import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTopCryptos } from '../services/api';
import { PriceChart } from '../components/Dashboard/PriceChart';
import { Skeleton } from '../components/ui/skeleton';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import { useWatchlist } from '../hooks/useWatchlist';

/**
 * CryptoDetailPage displays detailed information for a single cryptocurrency.
 * Features:
 * - Responsive layout for all screen sizes
 * - Optimized loading states
 * - Touch-friendly interactions
 * - Accessible navigation
 * - Clear visual hierarchy
 * - Interactive price chart
 */
export function CryptoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['cryptos'],
    queryFn: () => getTopCryptos(),
    staleTime: 30000, // 30 seconds
  });

  const crypto = cryptos?.find((c) => c.id === id);
  const isWatched = id ? isInWatchlist(id) : false;

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Back button skeleton */}
        <Skeleton className="h-6 w-24" />
        
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
            <div>
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 mb-2" />
              <Skeleton className="h-4 sm:h-6 w-24 sm:w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 mb-2" />
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-40 mb-1" />
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <Skeleton className="h-[300px] sm:h-[400px] rounded-xl" />
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Cryptocurrency not found</h2>
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700
                   focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg
                   active:scale-95 transform"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const priceChange = crypto.price_change_percentage_24h;
  const isPriceUp = priceChange >= 0;

  const handleWatchlistToggle = () => {
    if (isWatched) {
      removeFromWatchlist(crypto.id);
    } else {
      addToWatchlist(crypto.id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back to dashboard link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 
                   hover:text-gray-900 dark:hover:text-gray-100 mb-4 sm:mb-6
                   focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg
                   active:scale-95 transform"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
          Back to Dashboard
        </Link>

        {/* Header: logo, name, symbol, price, price change, watchlist button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center">
                {crypto.name}
                <span className="text-gray-500 dark:text-gray-400 ml-2 text-base sm:text-lg">
                  {crypto.symbol.toUpperCase()}
                </span>
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-semibold">
                  {formatCurrency(crypto.current_price)}
                </span>
                <div className="flex items-center space-x-1">
                  {isPriceUp ? (
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={`text-sm sm:text-base ${
                      isPriceUp
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPercentage(priceChange)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
                     active:scale-95 transform ${
                       isWatched
                         ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                         : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                     }`}
            aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Star className={`h-5 w-5 sm:h-6 sm:w-6 ${isWatched ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Market stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Market Cap */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2">Market Cap</h3>
          <p className="text-xl sm:text-2xl font-semibold">{formatCurrency(crypto.market_cap)}</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Rank #{crypto.market_cap_rank}
          </p>
        </div>
        {/* 24h Trading Volume */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2">24h Trading Volume</h3>
          <p className="text-xl sm:text-2xl font-semibold">{formatCurrency(crypto.total_volume)}</p>
        </div>
        {/* Circulating Supply */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2">Circulating Supply</h3>
          <p className="text-xl sm:text-2xl font-semibold">
            {formatLargeNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
          </p>
          {crypto.max_supply && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Max: {formatLargeNumber(crypto.max_supply)} {crypto.symbol.toUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* Price chart */}
      <PriceChart cryptoId={crypto.id} />
    </div>
  );
}