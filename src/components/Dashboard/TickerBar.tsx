import { useQuery } from '@tanstack/react-query';
import { getTopCryptos } from '../../services/api';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { useState, useCallback } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * TickerBar Component
 * 
 * A horizontally scrolling ticker that displays cryptocurrency prices and their 24h changes.
 * Features:
 * - Real-time data fetching using React Query
 * - Infinite scrolling animation
 * - Pause on hover/touch functionality
 * - Visual indicators for price changes (trending up/down icons)
 * - Seamless looping effect using duplicated content
 * - Responsive design for all screen sizes
 * - Accessibility features for screen readers
 */
export function TickerBar() {
  // State to control animation pause on hover/touch
  const [isPaused, setIsPaused] = useState(false);

  // Memoize the pause handlers to prevent unnecessary re-renders
  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);

  // Fetch top cryptocurrencies using React Query
  // This will automatically handle caching and revalidation
  const { data: cryptos } = useQuery({
    queryKey: ['cryptos'],
    queryFn: () => getTopCryptos(1, 10),
    // Add stale time to reduce unnecessary refetches
    staleTime: 30000, // 30 seconds
  });

  // Return null if data is not yet available
  if (!cryptos) return null;

  return (
    <div 
      className="bg-gray-800/50 border-t border-gray-700/50 py-1.5 sm:py-2 md:py-3 w-full overflow-hidden"
      role="marquee"
      aria-label="Cryptocurrency price ticker"
    >
      {/* 
        Main scrolling container
        - Uses CSS animation for smooth scrolling
        - Pauses on hover/touch using animation-play-state
        - Animation duration is calculated based on number of items
        - Responsive padding and spacing
      */}
      <div
        className={`
          flex space-x-3 sm:space-x-4 md:space-x-8 animate-scroll
          ${isPaused ? 'animation-paused' : ''}
          touch-manipulation
        `}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
        style={{
          animationDuration: `${cryptos.length * 2.5}s`,
        }}
      >
        {/* 
          Duplicate the content array to create a seamless loop
          - First array: original items
          - Second array: duplicate items
          - Combined length ensures smooth transition
        */}
        {[...cryptos.slice(0, 7), ...cryptos.slice(0, 7)].map((crypto, index) => (
          <div 
            key={`${crypto.id}-${index}`} 
            className="flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap px-1.5 sm:px-2"
            role="listitem"
            aria-label={`${crypto.symbol} price ${formatCurrency(crypto.current_price)}`}
          >
            {/* Cryptocurrency symbol */}
            <span 
              className="text-gray-300 font-medium text-xs sm:text-sm md:text-base"
              aria-label={`${crypto.symbol} symbol`}
            >
              {crypto.symbol.toUpperCase()}
            </span>
            
            {/* Current price with proper formatting */}
            <span 
              className="text-gray-100 text-xs sm:text-sm md:text-base"
              aria-label={`Current price: ${formatCurrency(crypto.current_price)}`}
            >
              {formatCurrency(crypto.current_price)}
            </span>
            
            {/* 
              Price change percentage with visual indicators
              - Green for positive changes
              - Red for negative changes
              - TrendingUp/Down icons for visual feedback
              - Accessible color contrast
            */}
            <span 
              className={`
                flex items-center text-xs sm:text-sm md:text-base
                ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}
              `}
              aria-label={`24h change: ${formatPercentage(crypto.price_change_percentage_24h)}`}
            >
              {crypto.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" aria-hidden="true" />
              )}
              <span className="sr-only">
                {crypto.price_change_percentage_24h >= 0 ? 'increased' : 'decreased'} by
              </span>
              {formatPercentage(crypto.price_change_percentage_24h)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}