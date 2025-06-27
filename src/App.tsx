import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "./pages/HomePage";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import { CryptoDetailPage } from "./pages/CryptoDetailPage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { WatchlistProvider } from "./context/WatchlistContext";
import { SnackbarProvider } from "notistack";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <WatchlistProvider>
              {/* App layout: wraps all routes with common layout components like header, footer, etc. */}
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/crypto/:id" element={<CryptoDetailPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </AppLayout>
            </WatchlistProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default App;
