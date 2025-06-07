/**
 * Represents a single cryptocurrency with detailed market data.
 */
export interface Cryptocurrency {
    /** Unique identifier for the cryptocurrency (e.g., 'bitcoin') */
    id: string;
    /** Ticker symbol (e.g., 'btc') */
    symbol: string;
    /** Full name of the cryptocurrency (e.g., 'Bitcoin') */
    name: string;
    /** URL to the cryptocurrency's logo image */
    image: string;
    /** Current price in USD */
    current_price: number;
    /** Current market capitalization in USD */
    market_cap: number;
    /** Rank of the cryptocurrency by market cap */
    market_cap_rank: number;
    /** Total trading volume in the last 24 hours (USD) */
    total_volume: number;
    /** Highest price in the last 24 hours (USD) */
    high_24h: number;
    /** Lowest price in the last 24 hours (USD) */
    low_24h: number;
    /** Absolute price change in the last 24 hours (USD) */
    price_change_24h: number;
    /** Percentage price change in the last 24 hours */
    price_change_percentage_24h: number;
    /** Absolute market cap change in the last 24 hours (USD) */
    market_cap_change_24h: number;
    /** Percentage market cap change in the last 24 hours */
    market_cap_change_percentage_24h: number;
    /** Number of coins currently in circulation */
    circulating_supply: number;
    /** Total number of coins in existence (may be null if unknown) */
    total_supply: number;
    /** Maximum number of coins that will ever exist (may be null if unlimited) */
    max_supply: number;
    /** ISO 8601 timestamp of the last update */
    last_updated: string;
}

/**
 * Represents global cryptocurrency market statistics.
 */
export interface MarketStats {
    /** Number of active cryptocurrencies tracked */
    active_cryptocurrencies: number;
    /** Number of active markets/exchanges */
    markets: number;
    /** Mapping of currency codes to total market cap values */
    total_market_cap: { [key: string]: number };
    /** Mapping of currency codes to total 24h trading volume */
    total_volume: { [key: string]: number };
    /** Mapping of cryptocurrency symbols to their market cap dominance percentage */
    market_cap_percentage: { [key: string]: number };
    /** 24-hour market cap change percentage in USD */
    market_cap_change_percentage_24h_usd: number;
    /** (Optional) BTC market dominance percentage */
    btc_dominance?: number;
    /** (Optional) ETH market dominance percentage */
    eth_dominance?: number;
}

/**
 * Represents historical chart data for a cryptocurrency.
 */
export interface ChartData {
    /** Array of [timestamp, price] pairs */
    prices: [number, number][];
    /** Array of [timestamp, market cap] pairs */
    market_caps: [number, number][];
    /** Array of [timestamp, total volume] pairs */
    total_volumes: [number, number][];
}

/**
 * Supported time frames for chart data.
 * - '24h': Last 24 hours
 * - '7d': Last 7 days
 * - '30d': Last 30 days
 * - '90d': Last 90 days
 * - '1y': Last 1 year
 */
export type TimeFrame = '24h' | '7d' | '30d' | '90d' | '1y';

/**
 * Represents the application's theme state and toggle function.
 */
export interface Theme {
    /** Whether the dark theme is enabled */
    isDark: boolean;
    /** Function to toggle between dark and light themes */
    toggle: () => void;
}