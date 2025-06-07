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
 * - Fetches the list of top cryptocurrencies and finds the one matching the route param.
 * - Shows loading skeletons while fetching.
 * - Displays price, market stats, and a price chart.
 * - Allows adding/removing the crypto to/from the user's watchlist.
 */
export function CryptoDetailPage() {
  // Get the crypto ID from the URL params
  const { id } = useParams<{ id: string }>();

  // Custom hook for watchlist management
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Fetch the list of top cryptocurrencies using React Query
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['cryptos'],
    queryFn: () => getTopCryptos(),
  });

  // Find the crypto matching the current ID
  const crypto = cryptos?.find((c) => c.id === id);

  // Check if the crypto is in the user's watchlist
  const isWatched = id ? isInWatchlist(id) : false;

  // Show loading skeletons while data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  // If the crypto is not found, show a not found message and a back link
  if (!crypto) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Cryptocurrency not found</h2>
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Extract price change and determine if price is up or down
  const priceChange = crypto.price_change_percentage_24h;
  const isPriceUp = priceChange >= 0;

  // Handler for toggling the crypto in the watchlist
  const handleWatchlistToggle = () => {
    if (isWatched) {
      removeFromWatchlist(crypto.id);
    } else {
      addToWatchlist(crypto.id);
    }
  };

  // Main render: crypto details, stats, and chart
  return (
    <div className="space-y-8">
      {/* Back to dashboard link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header: logo, name, symbol, price, price change, watchlist button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Crypto logo */}
            <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
            <div>
              {/* Name and symbol */}
              <h1 className="text-2xl font-bold flex items-center">
                {crypto.name}
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  {crypto.symbol.toUpperCase()}
                </span>
              </h1>
              {/* Price and 24h change */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold">
                  {formatCurrency(crypto.current_price)}
                </span>
                <div className="flex items-center space-x-1">
                  {isPriceUp ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={
                      isPriceUp
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    {formatPercentage(priceChange)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Watchlist toggle button */}
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-lg transition-colors ${
              isWatched
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Star className={`h-6 w-6 ${isWatched ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Market stats: Market Cap, 24h Volume, Circulating Supply */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Cap */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">Market Cap</h3>
          <p className="text-2xl font-semibold">{formatCurrency(crypto.market_cap)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Rank #{crypto.market_cap_rank}
          </p>
        </div>
        {/* 24h Trading Volume */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">24h Trading Volume</h3>
          <p className="text-2xl font-semibold">{formatCurrency(crypto.total_volume)}</p>
        </div>
        {/* Circulating Supply */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 mb-2">Circulating Supply</h3>
          <p className="text-2xl font-semibold">
            {formatLargeNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
          </p>
          {/* Show max supply if available */}
          {crypto.max_supply && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Max: {formatLargeNumber(crypto.max_supply)} {crypto.symbol.toUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* Price chart for the selected crypto */}
      <PriceChart cryptoId={crypto.id} />
    </div>
  );
}