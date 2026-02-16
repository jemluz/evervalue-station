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

## 📊 EVA contract

- **Explorer:** [Arbiscan](https://arbiscan.io/token/0x45D9831d8751B2325f3DBf48db748723726e1C8c)

```typescript
const EVA_TOKEN = {
  name: "Ever Value Coin",
  symbol: "EVA",
  address: "0x45D9831d8751B2325f3DBf48db748723726e1C8c",
  network: "Arbitrum One",
  chainId: 42161,
  decimals: 18, // Verify via contract
  type: "ERC-20",
};
```
