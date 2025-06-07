import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Cryptocurrency } from '../../types';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../../utils/formatters';

interface CryptoCardProps {
    /** The cryptocurrency data to display in the card */
    crypto: Cryptocurrency;
}

/**
 * CryptoCard component displays summary information for a single cryptocurrency.
 * It shows the logo, name, symbol, current price, 24h price change (with icon),
 * market cap, and 24h trading volume. The card links to the detailed crypto page.
 */
export function CryptoCard({ crypto }: CryptoCardProps) {
    // 24h price change percentage
    const priceChange = crypto.price_change_percentage_24h;
    // Determine if the price has increased or decreased in the last 24h
    const isPriceUp = priceChange >= 0;

    return (
        // Card links to the detailed page for this cryptocurrency
        <Link
            to={`/crypto/${crypto.id}`}
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
        >
            <div className="p-6">
                {/* Header: Logo, Name, Symbol */}
                <div className="flex items-center space-x-3 mb-4">
                    {/* Cryptocurrency logo */}
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                    <div>
                        {/* Cryptocurrency name */}
                        <h3 className="font-medium">{crypto.name}</h3>
                        {/* Cryptocurrency symbol (uppercase) */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol.toUpperCase()}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Current price and 24h price change */}
                    <div>
                        {/* Current price formatted as currency */}
                        <p className="text-2xl font-semibold">{formatCurrency(crypto.current_price)}</p>
                        <div className="flex items-center space-x-1">
                            {/* Up or down icon based on price change */}
                            {isPriceUp ? (
                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                            {/* 24h price change percentage, colored by direction */}
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

                    {/* Market cap and 24h volume */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                            {/* Market capitalization */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                            <p className="font-medium">{formatLargeNumber(crypto.market_cap)}</p>
                        </div>
                        <div>
                            {/* 24-hour trading volume */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">Volume (24h)</p>
                            <p className="font-medium">{formatLargeNumber(crypto.total_volume)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}