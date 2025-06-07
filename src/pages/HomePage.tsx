import { MarketStats } from '../components/Dashboard/MarketStats';
import { CryptoList } from '../components/Dashboard/CryptoList';

/**
 * HomePage component serves as the main dashboard page.
 * It displays overall market statistics and a list of top cryptocurrencies.
 */
export function HomePage() {
  return (
    // Main container with vertical spacing between sections
    <div className="space-y-8">
      {/* Header section with page title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Market statistics section */}
      <MarketStats />

      {/* Top cryptocurrencies section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Top Cryptocurrencies</h2>
        <CryptoList />
      </div>
    </div>
  );
}