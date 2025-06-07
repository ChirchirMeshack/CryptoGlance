import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { getTopCryptos } from '../../services/api';
import { useWatchlist } from '../../hooks/useWatchlist';
import { CryptoCard } from './CryptoCard';
import { Skeleton } from '../ui/skeleton';

/**
 * Watchlist component displays the user's selected cryptocurrencies.
 * - Fetches the top cryptocurrencies and filters them by the user's watchlist.
 * - Shows loading skeletons while data is being fetched.
 * - If the watchlist is empty, displays an empty state message.
 * - Otherwise, renders a grid of CryptoCard components for each watched crypto.
 */
export function Watchlist() {
    // Access the current watchlist (array of crypto IDs) from context
    const { watchlist } = useWatchlist();
    
    // Fetch the list of top cryptocurrencies using react-query
    const { data: cryptos, isLoading } = useQuery({
        queryKey: ['cryptos'],
        queryFn: () => getTopCryptos(),
    });

    // Filter the fetched cryptos to only those in the user's watchlist
    const watchlistCryptos = cryptos?.filter((crypto) => watchlist.includes(crypto.id));

    // Show loading skeletons while the crypto data is being fetched
    if (isLoading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[200px] rounded-xl" />
                ))}
            </div>
        );
    }

    // If the watchlist is empty, show an empty state with instructions
    if (!watchlistCryptos?.length) {
        return (
            <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Your watchlist is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Add cryptocurrencies to your watchlist to track them here
                </p>
            </div>
        );
    }

    // Render the grid of CryptoCard components for each crypto in the watchlist
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistCryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
        </div>
    );
}