import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import { getCryptoChart } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Skeleton } from '../../components/ui/skeleton';
import type { TimeFrame } from '../../types';

interface PriceChartProps {
  cryptoId: string;
}

const timeFrames: { label: string; value: TimeFrame }[] = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: '1y', value: '1y' },
];

const timeFrameDays = {
  '24h': '1',
  '7d': '7',
  '30d': '30',
  '90d': '90',
  '1y': '365',
};

/**
 * PriceChart component displays a historical price chart for a given cryptocurrency.
 * - Allows the user to select a time frame (24h, 7d, 30d, 90d, 1y).
 * - Fetches chart data for the selected time frame using React Query.
 * - Shows a loading skeleton while fetching.
 * - Renders an interactive area chart using recharts.
 * - Formats axes, tooltips, and buttons for a polished UI.
 */
export function PriceChart({ cryptoId }: PriceChartProps) {
    // State for the selected time frame (default: 7d)
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('7d');

    // Fetch chart data for the selected crypto and time frame using React Query
    const { data: chartData, isLoading } = useQuery({
        queryKey: ['chart', cryptoId, timeFrame],
        queryFn: () => getCryptoChart(cryptoId, timeFrameDays[timeFrame]),
    });

    // Memoize formatted chart data for recharts
    // Converts API data ([timestamp, price]) to { date: Date, price: number }
    const formattedData = useMemo(() => {
        if (!chartData) return [];
        return chartData.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp),
            price,
        }));
    }, [chartData]);

    // Show a skeleton loader while data is being fetched
    if (isLoading) {
        return <Skeleton className="w-full h-[400px] rounded-xl" />;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Header with title and time frame selection buttons */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Price Chart</h3>
                <div className="flex space-x-2">
                    {timeFrames.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setTimeFrame(value)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                timeFrame === value
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart container */}
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        {/* Gradient fill for the area under the curve */}
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {/* Grid lines for better readability */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        {/* X axis: shows time, formatted based on time frame */}
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) =>
                                timeFrame === '24h'
                                    ? format(date, 'HH:mm')
                                    : format(date, 'MMM dd')
                            }
                            tick={{ fill: '#6B7280' }}
                        />
                        {/* Y axis: shows price, formatted as currency */}
                        <YAxis
                            tickFormatter={(value) => formatCurrency(value)}
                            tick={{ fill: '#6B7280' }}
                            domain={['dataMin', 'dataMax']}
                        />
                        {/* Tooltip: shows date and price on hover */}
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {timeFrame === '24h'
                                                ? format(data.date, 'MMM dd, HH:mm')
                                                : format(data.date, 'MMM dd, yyyy')}
                                        </p>
                                        <p className="font-semibold">{formatCurrency(data.price)}</p>
                                    </div>
                                );
                            }}
                        />
                        {/* Area: the main price line and filled area */}
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#0ea5e9"
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}