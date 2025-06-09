import axios from 'axios';
import type { Cryptocurrency, MarketStats, ChartData } from '../types';
import { API_CONFIG, API_ENDPOINTS, API_PARAMS } from '../config';

// Create an Axios instance with default configuration
export const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add API key to requests if available
api.interceptors.request.use((config) => {
    if (API_CONFIG.API_KEY) {
        config.params = {
            ...config.params,
            [API_PARAMS.API_KEY]: API_CONFIG.API_KEY,
        };
    }
    return config;
});

/**
 * Fetches a paginated list of top cryptocurrencies by market cap.
 * @param page - The page number to fetch (default: 1)
 * @param perPage - Number of cryptocurrencies per page (default: 40)
 * @returns Promise resolving to an array of Cryptocurrency objects
 */
export const getTopCryptos = async (page = 1, perPage: number = API_CONFIG.DEFAULT_PER_PAGE): Promise<Cryptocurrency[]> => {
    try {
        const { data } = await api.get(API_ENDPOINTS.MARKETS, {
            params: {
                [API_PARAMS.VS_CURRENCY]: API_CONFIG.DEFAULT_CURRENCY,
                [API_PARAMS.ORDER]: 'market_cap_desc',
                [API_PARAMS.PER_PAGE]: perPage,
                [API_PARAMS.PAGE]: page,
                [API_PARAMS.SPARKLINE]: false,
                price_change_percentage: '24h',
            },
        });
        return data;
    } catch (error) {
        console.error('Error fetching top cryptocurrencies:', error);
        throw error;
    }
};

/**
 * Fetches global cryptocurrency market statistics.
 * @returns Promise resolving to a MarketStats object containing global stats
 */
export const getGlobalStats = async (): Promise<MarketStats> => {
    try {
        const { data } = await api.get(API_ENDPOINTS.GLOBAL);
        return data.data;
    } catch (error) {
        console.error('Error fetching global stats:', error);
        throw error;
    }
};

/**
 * Fetches historical chart data for a specific cryptocurrency.
 * @param id - The CoinGecko ID of the cryptocurrency
 * @param days - Number of days of data to fetch (default: '1')
 * @returns Promise resolving to a ChartData object with price, market cap, and volume arrays
 */
export const getCryptoChart = async (
    id: string,
    days: string = API_CONFIG.DEFAULT_CHART_DAYS,
): Promise<ChartData> => {
    try {
        const { data } = await api.get(API_ENDPOINTS.MARKET_CHART(id), {
            params: {
                [API_PARAMS.VS_CURRENCY]: API_CONFIG.DEFAULT_CURRENCY,
                [API_PARAMS.DAYS]: days,
            },
        });
        return data;
    } catch (error) {
        console.error(`Error fetching chart data for ${id}:`, error);
        throw error;
    }
};