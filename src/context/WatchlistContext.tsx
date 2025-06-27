// import { createContext, useEffect, useState } from 'react';
// import type { ReactNode } from 'react';

// /**
//  * The shape of the Watchlist context, including:
//  * - watchlist: Array of cryptocurrency IDs currently in the user's watchlist.
//  * - addToWatchlist: Function to add a cryptocurrency ID to the watchlist.
//  * - removeFromWatchlist: Function to remove a cryptocurrency ID from the watchlist.
//  * - isInWatchlist: Function to check if a cryptocurrency ID is in the watchlist.
//  */
// interface WatchlistContextType {
//     watchlist: string[];
//     addToWatchlist: (id: string) => void;
//     removeFromWatchlist: (id: string) => void;
//     isInWatchlist: (id: string) => boolean;
// }

// /**
//  * React context for the watchlist feature.
//  * Provides default no-op implementations for actions and an empty watchlist.
//  */
// export const WatchlistContext = createContext<WatchlistContextType>({
//     watchlist: [],
//     addToWatchlist: () => {},
//     removeFromWatchlist: () => {},
//     isInWatchlist: () => false,
// });

// interface WatchlistProviderProps {
//     children: ReactNode;
// }

// /**
//  * WatchlistProvider component wraps its children with WatchlistContext.
//  * - Loads the watchlist from localStorage on initial mount.
//  * - Persists the watchlist to localStorage whenever it changes.
//  * - Provides functions to add, remove, and check cryptocurrencies in the watchlist.
//  *
//  * @param children React children to be rendered within the provider.
//  */
// export function WatchlistProvider({ children }: WatchlistProviderProps) {
//     // State for the list of cryptocurrency IDs in the watchlist.
//     const [watchlist, setWatchlist] = useState<string[]>(() => {
//         // On initial mount, try to load the watchlist from localStorage.
//         const saved = localStorage.getItem('watchlist');
//         try {
//             return saved ? JSON.parse(saved) : [];
//         } catch (e) {
//             console.error("Error parsing watchlist from localStorage", e);
//             return [];
//         }
//     });

//     // Whenever the watchlist changes, persist it to localStorage.
//     useEffect(() => {
//         localStorage.setItem('watchlist', JSON.stringify(watchlist));
//     }, [watchlist]);

//     /**
//      * Adds a cryptocurrency ID to the watchlist.
//      * If the ID is already present, it will be added again (duplicates allowed).
//      * @param id The cryptocurrency ID to add.
//      */
//     const addToWatchlist = (id: string) => {
//         setWatchlist((prev) => [...prev, id]);
//     };

//     /**
//      * Removes a cryptocurrency ID from the watchlist.
//      * If the ID is not present, nothing happens.
//      * @param id The cryptocurrency ID to remove.
//      */
//     const removeFromWatchlist = (id: string) => {
//         setWatchlist((prev) => prev.filter((item) => item !== id));
//     };

//     /**
//      * Checks if a cryptocurrency ID is currently in the watchlist.
//      * @param id The cryptocurrency ID to check.
//      * @returns True if the ID is in the watchlist, false otherwise.
//      */
//     const isInWatchlist = (id: string) => watchlist.includes(id);

//     return (
//         <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
//             {children}
//         </WatchlistContext.Provider>
//     );
// }
import { createContext, useContext, useState, useEffect } from "react";
import {
  addToWatchList,
  getWatchList,
  removeFromWatchList,
} from "../services/watchlist";
import { useAuth } from "./AuthContext";

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (
    id: string
  ) => Promise<{ message: string; success: boolean }>;
  isInWatchlist: (id: string) => boolean;
  removeFromWatchlist: (
    id: string
  ) => Promise<{ message: string; success: boolean }>;
}
export const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const { currentUser } = useAuth();

  const fetchWatchlist = async (userId: string) => {
    const data = await getWatchList(userId);

    if (Array.isArray(data)) {
      setWatchlist(data);
    } else {
      setWatchlist([]);
    }
  };
  useEffect(() => {
    if (currentUser?.uid) {
      fetchWatchlist(currentUser.uid);
    } else {
      setWatchlist([]);
    }
  }, [currentUser]);

  const addToWatchlist = async (id: string) => {
    if (watchlist.includes(id)) {
      return {
        message: `${id} is already in watchlist`,
        success: false,
      };
    } else {
      setWatchlist((prev) => [...prev, id]);
      const res = await addToWatchList(id, currentUser?.uid);
      return {
        message: res?.message || `${id} added to watchlist successfully.`,
        success: true,
      };
    }
  };
  const removeFromWatchlist = async (id: string) => {
    const res = await removeFromWatchList(id, currentUser?.uid);
    if (res?.success) {
      setWatchlist((prev) => prev.filter((item) => item !== id));
      return {
        message: res.message || `${id} removed from watchlist successfully.`,
        success: true,
      };
    }
    return {
      message: res?.message || `Failed to remove ${id} from watchlist.`,
      success: false,
    };
  };
  const isInWatchlist = (id: string) => {
    return watchlist.includes(id);
  };
  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, isInWatchlist, removeFromWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
