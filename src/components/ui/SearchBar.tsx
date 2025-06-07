import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTopCryptos } from '../../services/api';
import type { Cryptocurrency } from '../../types';

/**
 * SearchBar component provides a search input for quick cryptocurrency lookup.
 * - Fetches the list of top cryptocurrencies.
 * - Filters and displays matching results in a dropdown as the user types.
 * - Clicking a result navigates to the cryptocurrency's detail page.
 * - Dropdown closes when clicking outside or after selection.
 */
export function SearchBar() {
    // State to control dropdown visibility
    const [isOpen, setIsOpen] = useState(false);
    // State to store the current search input value
    const [search, setSearch] = useState('');
    // React Router navigation hook
    const navigate = useNavigate();
    // Ref to the wrapper div for detecting outside clicks
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch the list of top cryptocurrencies using react-query
    const { data: cryptos } = useQuery({
        queryKey: ['cryptos'],
        queryFn: () => getTopCryptos(),
    });

    // Filter cryptocurrencies based on search input (by name or symbol), limit to 5 results
    const filteredCryptos = cryptos?.filter(crypto =>
        crypto.name.toLowerCase().includes(search.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);

    // Effect to close dropdown when clicking outside the component
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative">
            {/* Search input with icon */}
            <div className="relative">
                {/* Search icon inside the input */}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value); // Update search input
                        setIsOpen(true); // Open dropdown on input change
                    }}
                    onFocus={() => setIsOpen(true)} // Open dropdown on focus
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            {/* Dropdown with filtered results */}
            {isOpen && search && filteredCryptos && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto">
                    {filteredCryptos.length > 0 ? (
                        filteredCryptos.map((crypto) => (
                            <button
                                key={crypto.id}
                                onClick={() => {
                                    navigate(`/crypto/${crypto.id}`); // Navigate to crypto detail page
                                    setIsOpen(false); // Close dropdown
                                    setSearch(''); // Clear search input
                                }}
                                className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {/* Crypto logo */}
                                <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                                {/* Crypto name and symbol */}
                                <div className="flex-1 text-left">
                                    <p className="font-medium">{crypto.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol.toUpperCase()}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        // Message when no results are found
                        <p className="px-4 py-2 text-gray-500 dark:text-gray-400">No results found</p>
                    )}
                </div>
            )}
        </div>
    );
}