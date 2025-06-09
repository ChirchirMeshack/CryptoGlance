export const API_CONFIG = {
    BASE_URL: 'https://api.coingecko.com/api/v3',
    TIMEOUT: 10000, // 10 seconds
    API_KEY: import.meta.env.VITE_COINGECKO_API_KEY,
    DEFAULT_CURRENCY: 'usd',
    DEFAULT_PER_PAGE: 40,
    DEFAULT_CHART_DAYS: '1',
} as const;

// API endpoints
export const API_ENDPOINTS = {
    MARKETS: '/coins/markets',
    GLOBAL: '/global',
    MARKET_CHART: (id: string) => `/coins/${id}/market_chart`,
    SIMPLE_PRICE: '/simple/price',
} as const;

// API parameters
export const API_PARAMS = {
    VS_CURRENCY: 'vs_currency',
    ORDER: 'order',
    PER_PAGE: 'per_page',
    PAGE: 'page',
    SPARKLINE: 'sparkline',
    DAYS: 'days',
    API_KEY: 'x_cg_demo_api_key',
} as const;
