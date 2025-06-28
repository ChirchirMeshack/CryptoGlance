# CryptoGlance

A modern, responsive cryptocurrency dashboard built with React, TypeScript, and Vite. Track real-time cryptocurrency prices, market statistics, and manage your watchlist with a beautiful, mobile-first interface.

## Features

### Real-time Data

- Live cryptocurrency price updates
- Market statistics and trends
- 24-hour price changes
- Trading volume and market cap information

### Interactive Components

- Responsive price charts with multiple timeframes
- Animated price ticker with pause on hover
- Interactive cryptocurrency cards
- Customizable watchlist

### User Experience

- Mobile-first, responsive design
- Dark mode support
- Smooth animations and transitions
- Touch-friendly interactions
- Keyboard navigation support

### Performance

- Optimized data fetching with React Query
- Efficient state management
- Lazy loading and code splitting
- Responsive image loading

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **Charts:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router
- **Type Checking:** TypeScript
- **Code Quality:** ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ChirchirMeshack/CryptoGlance.git
   cd CryptoGlance
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
│   ├── Dashboard/  # Dashboard-specific components
│   └── ui/         # UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── lib/           # Third-party library configurations
├── pages/         # Page components
├── services/      # API services
├── styles/        # Global styles
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Key Components

### Dashboard

- `TickerBar`: Real-time price ticker with animation
- `CryptoList`: Grid of cryptocurrency cards
- `MarketStats`: Global market statistics
- `PriceChart`: Interactive price charts
- `Watchlist`: User's saved cryptocurrencies

### Layout

- `AppLayout`: Main application layout
- `Header`: Navigation and search
- `Sidebar`: Mobile-friendly navigation

## Development

### Code Style

This project uses ESLint and Prettier for code formatting. The configuration extends the recommended TypeScript rules:

```js
// eslint.config.js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for charts
- [Lucide Icons](https://lucide.dev/) for icons

## Recent Contributions

### Authentication & Watchlist Feature
  - **User Authentication:** Implemented signup and login functionality using Firebase Authentication.
  - **Persistent Watchlist:** Restricted watchlist feature to ***logged-in users***. Migrated storage of watchlisted cryptocurrencies from localStorage to Firebase Firestore, ensuring persistence across devices.
