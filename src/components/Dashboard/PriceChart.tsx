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
 * Features:
 * - Responsive design for all screen sizes
 * - Touch-friendly interactions
 * - Optimized chart display
 * - Accessible controls
 * - Loading states
 * - Time frame selection
 */
export function PriceChart({ cryptoId }: PriceChartProps) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('7d');

    const { data: chartData, isLoading } = useQuery({
        queryKey: ['chart', cryptoId, timeFrame],
        queryFn: () => getCryptoChart(cryptoId, timeFrameDays[timeFrame]),
        staleTime: 30000, // 30 seconds
    });

    const formattedData = useMemo(() => {
        if (!chartData) return [];
        return chartData.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp),
            price,
        }));
    }, [chartData]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex space-x-1 sm:space-x-2">
                        {timeFrames.map((_, i) => (
                            <Skeleton key={i} className="h-8 w-12 sm:w-14" />
                        ))}
                    </div>
                </div>
                <Skeleton className="w-full h-[300px] sm:h-[400px] rounded-lg" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Header with title and time frame selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold">Price Chart</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                    {timeFrames.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setTimeFrame(value)}
                            className={`
                                px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium
                                transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
                                active:scale-95 transform
                                ${timeFrame === value
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                            aria-pressed={timeFrame === value}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart container with responsive height */}
            <div className="h-[300px] sm:h-[400px] touch-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#374151" 
                            opacity={0.1}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) =>
                                timeFrame === '24h'
                                    ? format(date, 'HH:mm')
                                    : format(date, 'MMM dd')
                            }
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickMargin={8}
                            minTickGap={30}
                        />
                        <YAxis
                            tickFormatter={(value) => formatCurrency(value)}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickMargin={8}
                            domain={['dataMin', 'dataMax']}
                            width={80}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {timeFrame === '24h'
                                                ? format(data.date, 'MMM dd, HH:mm')
                                                : format(data.date, 'MMM dd, yyyy')}
                                        </p>
                                        <p className="font-semibold">{formatCurrency(data.price)}</p>
                                    </div>
                                );
                            }}
                            cursor={{ stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}