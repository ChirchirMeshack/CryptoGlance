import { useQuery } from '@tanstack/react-query';
import { Star, Plus } from 'lucide-react';
import { getTopCryptos } from '../../services/api';
import { useWatchlist } from '../../hooks/useWatchlist';
import { CryptoCard } from './CryptoCard';
import { Skeleton } from '../ui/skeleton';
import { Link } from 'react-router-dom';

/**
 * Watchlist component displays the user's selected cryptocurrencies.
 * Features:
 * - Responsive grid layout
 * - Optimized loading states
 * - Empty state with call-to-action
 * - Touch-friendly interactions
 * - Accessible navigation
 */
export function Watchlist() {
    const { watchlist } = useWatchlist();
    
    const { data: cryptos, isLoading } = useQuery({
        queryKey: ['cryptos'],
        queryFn: () => getTopCryptos(),
        staleTime: 30000, // 30 seconds
    });

    const watchlistCryptos = cryptos?.filter((crypto) => watchlist.includes(crypto.id));

    if (isLoading) {
        return (
            <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
                role="status"
                aria-label="Loading watchlist"
            >
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
                    >
                        <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                            <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
                            <div>
                                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 mb-1" />
                                <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mb-2" />
                        <Skeleton className="h-3 sm:h-4 w-16 sm:w-24 mb-3 sm:mb-4" />
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div>
                                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-1" />
                                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
                            </div>
                            <div>
                                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-1" />
                                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!watchlistCryptos?.length) {
        return (
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center"
                role="status"
                aria-label="Empty watchlist"
            >
                <Star className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Your watchlist is empty
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                    Add cryptocurrencies to your watchlist to track them here
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5
                             bg-primary-600 hover:bg-primary-700 text-white rounded-lg
                             transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
                             active:scale-95 transform"
                >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                    <span>Browse Cryptocurrencies</span>
                </Link>
            </div>
        );
    }

    return (
        <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            role="list"
            aria-label="Watchlist of cryptocurrencies"
        >
            {watchlistCryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
        </div>
    );
}