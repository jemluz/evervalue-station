## 🏗️ Component Architecture

```
Dashboard (main page)
├── Header (logo, title, current price)
├── UniversalConverter (P0)
│   └── CurrencyInput (multi-currency)
├── PricePanel (P0)
│   ├── PriceCard (USD)
│   ├── PriceCard (BRL)
│   ├── PriceCard (Satoshi)
│   └── PriceCard (BTC)
├── SupplyMetrics (P1)
│   ├── MetricCard (Total Supply)
│   ├── MetricCard (Burned)
│   └── MetricCard (Circulating)
├── HolderMetrics (P1)
│   └── MetricCard (Total Holders)
└── InvestmentCalculator (P2)
  ├── InputCalculator
  └── SimulatorCalculator
```

## Component Map (resumed)

```
Dashboard
├── Header
├── UniversalConverter
│   └── CurrencyInput
├── PricePanel
│   └── PriceCard (USD, BRL, Satoshi, BTC)
├── SupplyMetrics
│   └── MetricCard (Total, Burned, Circulating)
├── HolderMetrics
│   └── MetricCard (Total Holders)
└── InvestmentCalculator (future)
```

## 🧩 Main Components

### **Dashboard (Container)**

```typescript
// src/components/Dashboard/Dashboard.tsx
export default function Dashboard() {
  const { price, loading: priceLoading } = useEVAPrice()
  const { metrics, loading: metricsLoading } = useTokenMetrics()
  const { marketData, loading: marketLoading } = useMarketData()

  return (
    <div className="container mx-auto px-4 py-8">
      <Header price={price.usd} />
      <UniversalConverter initialPrice={price} />
      <PricePanel price={price} loading={priceLoading} />
      <SupplyMetrics metrics={metrics} loading={metricsLoading} />
      <MarketData data={marketData} loading={marketLoading} />
    </div>
  )
}
```

### **Custom Hooks (Data Fetching)**

```typescript
// src/hooks/useEVAPrice.ts
export function useEVAPrice(options?: UseEVAPriceOptions) {
  const [price, setPrice] = useState<EVAPrice>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const [evaUsd, btcPrice, brlRate] = await Promise.all([
          coingecko.getEVAPrice(),
          coingecko.getBTCPrice(),
          exchange.getBRLRate(),
        ]);

        const evaBrl = evaUsd * brlRate;
        const evaBtc = evaUsd / btcPrice;
        const evaSat = evaBtc * 100_000_000;

        setPrice({ usd: evaUsd, brl: evaBrl, btc: evaBtc, satoshi: evaSat });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, options?.refreshInterval ?? 30000);
    return () => clearInterval(interval);
  }, []);

  return { price, loading, error };
}
```

### **API Clients**

```typescript
// src/lib/api/coingecko.ts
export const coingecko = {
  async getEVAPrice(): Promise<number> {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/token_price/arbitrum-one?" +
        "contract_addresses=0x45D9831d8751B2325f3DBf48db748723726e1C8c" +
        "&vs_currencies=usd",
    );
    const data = await response.json();
    return data["0x45d9831d8751b2325f3dbf48db748723726e1c8c"].usd;
  },

  async getBTCPrice(): Promise<number> {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    );
    const data = await response.json();
    return data.bitcoin.usd;
  },
};
```

### **Blockchain Integration**

```typescript
// src/lib/blockchain/evaContract.ts
import { ethers } from "ethers";
import { getProvider } from "./provider";
import { EVA_ADDRESS, EVA_ABI } from "./constants";

export async function getTotalSupply(): Promise<bigint> {
  const provider = getProvider();
  const contract = new ethers.Contract(EVA_ADDRESS, EVA_ABI, provider);
  return await contract.totalSupply();
}

export async function getDecimals(): Promise<number> {
  const provider = getProvider();
  const contract = new ethers.Contract(EVA_ADDRESS, EVA_ABI, provider);
  return await contract.decimals();
}
```
