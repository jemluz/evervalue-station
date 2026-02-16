## 📁 Data Structure (State Management)

```typescript
// Global state (can use Context API or Zustand)
interface AppState {
  evaPrice: {
    usd: number;
    brl: number;
    btc: number;
    satoshi: number;
  };
  tokenMetrics: {
    totalSupply: number;
    burned: number;
    circulating: number;
    holders: number;
  };
  marketData: {
    marketCap: number;
    volume24h: number;
    liquidity: number;
  };
  loading: boolean;
  lastUpdate: Date;
}
```
