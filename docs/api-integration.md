# 🔌 API Integration - EVA Tokenomics Dashboard

This document details all APIs used in the project, how to get access, limits, and usage examples.

## 📋 API Summary

| API              | Purpose       | Rate Limit (Free) | Auth     |
| ---------------- | ------------- | ----------------- | -------- |
| **Arbitrum RPC** | On-chain data | Unlimited\*       | No       |
| **CoinGecko**    | Crypto prices | 10-50 req/min     | Optional |
| **AwesomeAPI**   | BRL exchange  | Unlimited         | No       |
| **Arbiscan**     | Holders, txs  | 5 req/sec         | API Key  |

\*Depends on the provider (public RPC can throttle)

---

## 1️⃣ Arbitrum RPC

### **What is it?**

Endpoint for direct communication with the Arbitrum blockchain. Allows reading smart contract data.

### **Available Endpoints**

#### **Option 1: Public RPC (Free, can be slow)**

```
https://arb1.arbitrum.io/rpc
```

#### **Option 2: Alchemy (Recommended)**

```
https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

- **Sign up:** https://www.alchemy.com/
- **Free tier:** 300M compute units/month

#### **Option 3: Infura**

```
https://arbitrum-mainnet.infura.io/v3/YOUR_API_KEY
```

- **Sign up:** https://infura.io/
- **Free tier:** 100k requests/day

### **How to Use in the Project**

```typescript
// src/lib/blockchain/provider.ts
import { ethers } from "ethers";

const RPC_URL = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL!;

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}
```

### Data that comes from the contract

```typescript
interface ContractData {
  totalSupply: bigint;
  decimals: number;
  name: string;
  symbol: string;
}
```

### **EVA Contract Methods**

```typescript
// src/lib/blockchain/evaContract.ts
import { ethers } from "ethers";
import { getProvider } from "./provider";

const EVA_ADDRESS = "0x45D9831d8751B2325f3DBf48db748723726e1C8c";

// Minimal ABI needed (ERC-20 standard)
const EVA_ABI = [
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
];

export async function getTotalSupply(): Promise<string> {
  const provider = getProvider();
  const contract = new ethers.Contract(EVA_ADDRESS, EVA_ABI, provider);
  const supply = await contract.totalSupply();
  const decimals = await contract.decimals();
  return ethers.formatUnits(supply, decimals);
}

export async function getDecimals(): Promise<number> {
  const provider = getProvider();
  const contract = new ethers.Contract(EVA_ADDRESS, EVA_ABI, provider);
  return await contract.decimals();
}
```

### **Example Response**

```typescript
await getTotalSupply();
// "1000000000.0" (1 billion tokens)

await getDecimals();
// 18
```

---

## 2️⃣ CoinGecko API

### **What is it?**

Crypto market data API (prices, volume, market cap).

### **Endpoints**

**Base URL:** `https://api.coingecko.com/api/v3`

#### **EVA Price**

```
GET /simple/token_price/{platform}
    ?contract_addresses={address}
    &vs_currencies={currencies}
```

#### **Bitcoin Price**

```
GET /simple/price
    ?ids=bitcoin
    &vs_currencies=usd
```

### **Rate Limits**

| Tier          | Requests  | Cost    |
| ------------- | --------- | ------- |
| Demo (no key) | 10-50/min | Free    |
| Analyst       | 500/min   | $129/mo |

For this project, the **free tier is enough**.

### Data model

```typescript
// Price and market data
interface CoinGeckoResponse {
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
}
```

### **How to Use in the Project**

```typescript
// src/lib/api/coingecko.ts

const BASE_URL = "https://api.coingecko.com/api/v3";
const EVA_ADDRESS = "0x45D9831d8751B2325f3DBf48db748723726e1C8c";

export const coingecko = {
  /**
   * Fetches EVA price in USD
   */
  async getEVAPrice(): Promise<number> {
    const url =
      `${BASE_URL}/simple/token_price/arbitrum-one?` +
      `contract_addresses=${EVA_ADDRESS}&vs_currencies=usd`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch EVA price");

    const data = await response.json();
    return data[EVA_ADDRESS.toLowerCase()].usd;
  },

  /**
   * Fetches Bitcoin price in USD
   */
  async getBTCPrice(): Promise<number> {
    const url = `${BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch BTC price");

    const data = await response.json();
    return data.bitcoin.usd;
  },

  /**
   * Fetches full EVA market data
   */
  async getMarketData() {
    const url = `${BASE_URL}/coins/arbitrum-one/contract/${EVA_ADDRESS}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch market data");

    const data = await response.json();
    return {
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      priceChange24h: data.market_data.price_change_percentage_24h,
    };
  },
};
```

### **Example Response**

```json
// GET /simple/token_price/arbitrum-one?contract_addresses=0x45...&vs_currencies=usd
{
  "0x45d9831d8751b2325f3dbf48db748723726e1c8c": {
    "usd": 0.00123456
  }
}
```

### **Error Handling**

```typescript
async function fetchWithRetry(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Usage
const price = await fetchWithRetry(() => coingecko.getEVAPrice());
```

---

## 3️⃣ AwesomeAPI (BRL Exchange Rate)

### **What is it?**

Free Brazilian API for currency exchange rates.

### **Endpoint**

```
GET https://economia.awesomeapi.com.br/json/last/USD-BRL,BTC-BRL
```

### Data model

```typescript
interface ExchangeRate {
  USD: {
    bid: string; // Buy price
    ask: string; // Sell price
  };
}
```

### **How to Use in the Project**

```typescript
// src/lib/api/exchange.ts

const BASE_URL = "https://economia.awesomeapi.com.br/json/last";

export const exchange = {
  /**
   * Fetches USD -> BRL rate
   */
  async getBRLRate(): Promise<number> {
    const response = await fetch(`${BASE_URL}/USD-BRL`);
    if (!response.ok) throw new Error("Failed to fetch BRL rate");

    const data = await response.json();
    return parseFloat(data.USDBRL.bid);
  },

  /**
   * Fetches BTC price in BRL (alternative to CoinGecko)
   */
  async getBTCinBRL(): Promise<number> {
    const response = await fetch(`${BASE_URL}/BTC-BRL`);
    if (!response.ok) throw new Error("Failed to fetch BTC price");

    const data = await response.json();
    return parseFloat(data.BTCBRL.bid);
  },
};
```

### **Example Response**

```json
{
  "USDBRL": {
    "code": "USD",
    "codein": "BRL",
    "name": "US Dollar/BRL",
    "high": "5.1234",
    "low": "5.0987",
    "varBid": "0.0123",
    "pctChange": "0.24",
    "bid": "5.1150", // <- Buy price (use this)
    "ask": "5.1200", // Sell price
    "timestamp": "1708012345",
    "create_date": "2026-02-14 10:30:00"
  }
}
```

### **No Rate Limit**

This API does not document a request limit. Use common sense (do not do 1000 req/sec).

---

## 4️⃣ Arbiscan API

### **What is it?**

Official Arbiscan explorer API. Provides transactions, holders, and more.

### **How to Get an API Key**

1. Visit https://arbiscan.io/
2. Create an account (free)
3. Go to **Account -> API Keys**
4. Click **Add** and copy your key

### **Rate Limit**

- **Free:** 5 requests/second
- **Enough** for this project

### **Useful Endpoints**

#### **Holder Count**

```
GET https://api.arbiscan.io/api
    ?module=token
    &action=tokenholderlist
    &contractaddress={address}
    &page=1
    &offset=1
    &apikey={YOUR_API_KEY}
```

#### **Total Supply**

```
GET https://api.arbiscan.io/api
    ?module=stats
    &action=tokensupply
    &contractaddress={address}
    &apikey={YOUR_API_KEY}
```

### Data model

```typescript
// Holder count
interface ArbiscanTokenInfo {
  result: string; // holder count as a string
}
```

### **How to Use in the Project**

```typescript
// src/lib/api/arbiscan.ts

const BASE_URL = "https://api.arbiscan.io/api";
const API_KEY = process.env.NEXT_PUBLIC_ARBISCAN_API_KEY!;
const EVA_ADDRESS = "0x45D9831d8751B2325f3DBf48db748723726e1C8c";

export const arbiscan = {
  /**
   * Fetches holder count
   * Note: API returns a list, but total comes in metadata
   */
  async getHolderCount(): Promise<number> {
    const url =
      `${BASE_URL}?module=token&action=tokenholderlist` +
      `&contractaddress=${EVA_ADDRESS}&page=1&offset=1&apikey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch holders");

    const data = await response.json();
    if (data.status !== "1") throw new Error(data.message);

    // Arbiscan returns the total in the result
    return parseInt(data.result[0]?.totalHolders || "0");
  },

  /**
   * Fetches recent transactions (for activity analysis)
   */
  async getRecentTransactions(page = 1, limit = 10) {
    const url =
      `${BASE_URL}?module=account&action=tokentx` +
      `&contractaddress=${EVA_ADDRESS}&page=${page}&offset=${limit}` +
      `&sort=desc&apikey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch transactions");

    const data = await response.json();
    if (data.status !== "1") return [];

    return data.result;
  },
};
```

### **Example Response (Holders)**

```json
{
  "status": "1",
  "message": "OK",
  "result": [
    {
      "TokenHolderAddress": "0xabc...",
      "TokenHolderQuantity": "1000000000000000000000",
      "totalHolders": "1234" // <- Total holders
    }
  ]
}
```

### **Rate Limit Handling**

```typescript
// src/lib/utils/rateLimiter.ts

class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private interval = 200; // 5 req/sec = 200ms between requests

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      await new Promise((resolve) => setTimeout(resolve, this.interval));
    }

    this.processing = false;
  }
}

export const arbiscanLimiter = new RateLimiter();

// Usage
const holders = await arbiscanLimiter.add(() => arbiscan.getHolderCount());
```

---

## 🔄 Multi-API Orchestration

### **Parallel Fetching**

```typescript
// src/hooks/useEVAPrice.ts

export function useEVAPrice() {
  const [data, setData] = useState<EVAPriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPrices() {
      try {
        // Fetch everything in parallel
        const [evaUsd, btcUsd, brlRate] = await Promise.all([
          coingecko.getEVAPrice(),
          coingecko.getBTCPrice(),
          exchange.getBRLRate(),
        ]);

        // Calculate conversions
        const evaBrl = evaUsd * brlRate;
        const evaBtc = evaUsd / btcUsd;
        const evaSat = evaBtc * 100_000_000;

        setData({
          usd: evaUsd,
          brl: evaBrl,
          btc: evaBtc,
          satoshi: evaSat,
        });
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllPrices();
  }, []);

  return { data, loading };
}
```

---

## 📊 Environment Variables Summary

```env
# .env.local

# Arbitrum RPC (required)
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Arbiscan API Key (required)
NEXT_PUBLIC_ARBISCAN_API_KEY=your_api_key_here

# CoinGecko API Key (optional, for higher rate limits)
COINGECKO_API_KEY=your_api_key_here
```

---

## ✅ Setup Checklist

- [ ] Create an Arbiscan account and get an API key
- [ ] Decide on an RPC provider (public vs Alchemy/Infura)
- [ ] Configure `.env.local`
- [ ] Test each API client individually
- [ ] Implement rate limiting for Arbiscan
- [ ] Add error handling to all fetchers
- [ ] Implement a cache system (optional)

---

**Next step:** [ROADMAP_BACKEND.md](./ROADMAP_BACKEND.md)
