import { createContext } from 'react';

/**
 * The shape of the Watchlist context, including:
 * - watchlist: Array of cryptocurrency IDs currently in the user's watchlist.
 * - addToWatchlist: Function to add a cryptocurrency ID to the watchlist.
 * - removeFromWatchlist: Function to remove a cryptocurrency ID from the watchlist.
 * - isInWatchlist: Function to check if a cryptocurrency ID is in the watchlist.
 */
export interface WatchlistContextType {
    watchlist: string[];
    addToWatchlist: (id: string) => void;
    removeFromWatchlist: (id: string) => void;
    isInWatchlist: (id: string) => boolean;
}

/**
 * React context for the watchlist feature.
 * Provides default no-op implementations for actions and an empty watchlist.
 */
export const WatchlistContext = createContext<WatchlistContextType>({
    watchlist: [],
    addToWatchlist: () => {},
    removeFromWatchlist: () => {},
    isInWatchlist: () => false,
}); 