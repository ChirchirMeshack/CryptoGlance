import axios from 'axios';
import type { Cryptocurrency, MarketStats, ChartData } from '../types';

// Base URL for CoinGecko API
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Create an Axios instance with default configuration
export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout for requests
});

/**
 * Fetches a paginated list of top cryptocurrencies by market cap.
 * @param page - The page number to fetch (default: 1)
 * @param perPage - Number of cryptocurrencies per page (default: 100)
 * @returns Promise resolving to an array of Cryptocurrency objects
 */
export const getTopCryptos = async (page = 1, perPage = 100): Promise<Cryptocurrency[]> => {
    const { data } = await api.get('/coins/markets', {
        params: {
            vs_currency: 'usd',           // Return prices in USD
            order: 'market_cap_desc',     // Order by market cap descending
            per_page: perPage,            // Number of results per page
            page,                        // Page number
            sparkline: false,             // Exclude sparkline data
        },
    });
    return data;
};

/**
 * Fetches global cryptocurrency market statistics.
 * @returns Promise resolving to a MarketStats object containing global stats
 */
export const getGlobalStats = async (): Promise<MarketStats> => {
    const { data } = await api.get('/global');
    // The actual stats are nested under the 'data' property in the response
    return data.data;
};

/**
 * Fetches historical chart data for a specific cryptocurrency.
 * @param id - The CoinGecko ID of the cryptocurrency
 * @param days - Number of days of data to fetch (default: '1')
 * @returns Promise resolving to a ChartData object with price, market cap, and volume arrays
 */
export const getCryptoChart = async (
    id: string,
    days: string = '1',
): Promise<ChartData> => {
    const { data } = await api.get(`/coins/${id}/market_chart`, {
        params: {
            vs_currency: 'usd', // Return prices in USD
            days,               // Number of days to fetch
        },
    });
    return data;
};