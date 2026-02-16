# Architecture

## Overview

This project follows a layered architecture to separate UI, business logic, and data access for the EVA dashboard.

The goal is to keep data sources isolated, reuse conversion logic, and keep UI components focused on presentation.

---

## Layers

1. **UI Layer (React Components)**
   - Presents data: converter, price panels, metrics, market data.

2. **Business Logic Layer (Hooks + Utils)**
   - Fetching, conversion calculations, formatting, and local state orchestration.

3. **Data Access Layer (API Clients + Blockchain)**
   - API clients for CoinGecko, AwesomeAPI, Arbiscan.
   - Blockchain reads via Arbitrum RPC.

4. **External Services**
   - Arbitrum RPC, CoinGecko, AwesomeAPI, Arbiscan.

```
┌─────────────────────────────────────────────────┐
│                   UI Layer                       │
│            (React Components)                    │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Business Logic Layer                │
│           (Custom Hooks + Utils)                 │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Data Access Layer                   │
│         (API Clients + Blockchain)               │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              External Services                   │
│    (Arbitrum, CoinGecko, Arbiscan, etc)         │
└─────────────────────────────────────────────────┘
```

---

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

More details in (reference `folder-structure.md`)

---

## Data Flow

### 1) Initial load

```
User opens /
	-> Dashboard mounts
	-> Hooks fetch in parallel:
		 - useEVAPrice: CoinGecko + AwesomeAPI
		 - useTokenMetrics: Arbitrum RPC + Arbiscan
		 - useMarketData: CoinGecko
	-> State updates
	-> UI renders
```

### 2) Periodic refresh

- Price: every 30s
- Metrics: every 60s
- Holders: every 5 min

Use polling or SWR-style revalidation with caching to reduce API load.

```typescript
// Hooks use polling or SWR for auto-refresh
useEVAPrice({
  refreshInterval: 30000, // 30 seconds
  revalidateOnFocus: true,
});
```

### 3) Converter interaction

```
User edits one currency
  -> onChange runs
	-> useConverter() recalculates all values
	-> Local state updates
	-> All inputs sync instantly
```

---

## Design Patterns

- **Custom Hooks** for data fetching, state management and refresh logic.
- **Client Pattern** to isolate external API calls.
- **Container/Presentational or Smart/Dumb components** for clearer UI responsibilities. Components to show data, hooks to manage it.

---

## Constraints and Invariants

- Data sources remain isolated behind clients.
- Conversion logic remains centralized and reusable.
- UI components do not perform direct network calls.
