export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a large number into a human-readable string with appropriate suffixes.
 *
 * Converts the input number into a string representation using the following rules:
 * - Numbers greater than or equal to 1 trillion (1e12) are formatted with a "T" suffix (trillions).
 * - Numbers greater than or equal to 1 billion (1e9) are formatted with a "B" suffix (billions).
 * - Numbers greater than or equal to 1 million (1e6) are formatted with an "M" suffix (millions).
 * - Numbers greater than or equal to 1 thousand (1e3) are formatted with a "K" suffix (thousands).
 * - Numbers less than 1 thousand are formatted with two decimal places and no suffix.
 *
 * All formatted numbers are rounded to two decimal places.
 *
 * @param value - The numeric value to format.
 * @returns A string representing the formatted number with the appropriate suffix.
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
};

export const formatPercentage = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};