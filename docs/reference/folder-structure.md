## Directory Structure Overview

```
src/
├── app/                       # Next.js App Router
├── components/                # React components (Dashboard, Converter, etc)
├── hooks/                     # Data hooks (useEVAPrice, useTokenMetrics, etc)
├── lib/
│   ├── api/                    # API clients (coingecko, exchange, arbiscan)
│   ├── blockchain/             # Provider + contract helpers
│   └── utils/                  # Formatters, calculations, cache
├── types/                      # Shared TypeScript types
└── config/                     # Constants and env validation
```

---

## Directory Structure Detailed

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Global layout
│   ├── page.tsx                 # Main page (Dashboard)
│   ├── api/                     # API Routes (optional)
│   │   └── refresh/route.ts    # Endpoint for data refresh
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── Dashboard/
│   │   └── Dashboard.tsx        # Main container
│   ├── Converter/
│   │   ├── UniversalConverter.tsx
│   │   └── CurrencyInput.tsx
│   ├── PricePanel/
│   │   ├── PricePanel.tsx
│   │   └── PriceCard.tsx
│   ├── SupplyMetrics/
│   │   ├── SupplyMetrics.tsx
│   │   └── MetricCard.tsx
│   ├── MarketData/
│   │   └── MarketData.tsx
│   ├── Calculator/
│   │   └── InvestmentCalculator.tsx
│   └── ui/                      # Base components (shadcn/ui)
│       ├── card.tsx
│       ├── button.tsx
│       └── input.tsx
│
├── lib/                          # Business logic and integrations
│   ├── blockchain/              # Blockchain integration
│   │   ├── provider.ts          # Provider setup (Ethers/Viem)
│   │   ├── evaContract.ts       # EVA contract helpers
│   │   └── constants.ts         # Addresses, ABIs, etc
│   ├── api/                     # External API clients
│   │   ├── coingecko.ts         # CoinGecko client
│   │   ├── arbiscan.ts          # Arbiscan client
│   │   └── exchange.ts          # AwesomeAPI client (exchange rate)
│   └── utils/                   # Utilities
│       ├── formatters.ts        # Number/currency formatting
│       ├── calculations.ts      # Conversion calculations
│       └── cache.ts             # Simple cache system
│
├── hooks/                        # Custom React Hooks
│   ├── useEVAPrice.ts           # EVA price in all currencies
│   ├── useTokenMetrics.ts       # Supply, burned, holders
│   ├── useMarketData.ts         # Market cap, volume, etc
│   └── useConverter.ts          # Universal converter logic
│
├── types/                        # TypeScript Types
│   ├── index.ts                 # Centralized exports
│   ├── token.ts                 # Token-related types
│   ├── api.ts                   # API response types
│   └── market.ts                # Market data types
│
└── config/                       # Configuration
    ├── constants.ts             # Global constants
    └── env.ts                   # Env var validation
```
