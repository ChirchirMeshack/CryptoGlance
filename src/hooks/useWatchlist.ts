import { useContext } from 'react';
import { WatchlistContext } from '../context/WatchlistContext';

/**
 * Custom React hook to access the current value of the Watchlist context.
 *
 * This hook provides access to the watchlist state and any associated actions
 * defined within the `WatchlistContext`. It must be used within a component
 * that is a descendant of a `WatchlistProvider`, otherwise it will throw an error.
 *
 * @throws {Error} Throws an error if used outside of a `WatchlistProvider`.
 * @returns {WatchlistContextType} The current context value for the watchlist, including state and actions.
 *
 * @example
 * const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
 */
export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}