import { Routes, Route } from 'react-router-dom';
import {AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { ThemeProvider } from "./components/theme-provider";
import { CryptoDetailPage } from './pages/CryptoDetailPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { WatchlistProvider } from './context/WatchlistContext';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
         <WatchlistProvider>
        {/* App layout: wraps all routes with common layout components like header, footer, etc. */}
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
             <Route path="/crypto/:id" element={<CryptoDetailPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Routes>
          </AppLayout>
           </WatchlistProvider>
          </ThemeProvider>
   
     </ErrorBoundary>
  );
}
export default App;