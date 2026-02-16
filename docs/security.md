## 🔐 Security

### 🔑 Environment Variables

```env
# Arbitrum RPC (public or Alchemy/Infura)
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Arbiscan API Key (get it at https://arbiscan.io/apis)
NEXT_PUBLIC_ARBISCAN_API_KEY=your_api_key_here

# Optional: CoinGecko API Key (for higher rate limits)
COINGECKO_API_KEY=your_api_key_here
```

### **API Keys**

```typescript
// src/config/env.ts
export const env = {
  arbitrumRpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL!,
  arbiscanKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY!,
  coingeckoKey: process.env.COINGECKO_API_KEY, // Optional
};

// Validation on startup
if (!env.arbitrumRpc) throw new Error("Missing ARBITRUM_RPC_URL");
```

### **Rate Limiting**

```typescript
// src/lib/utils/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCached<T>(key: string, ttl: number): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > ttl) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}
```
