# 🏗️ Arquitetura - EVA Tokenomics Dashboard

## 📐 Visão Geral

Este projeto segue uma arquitetura em camadas, separando claramente responsabilidades entre UI, lógica de negócio e integração com serviços externos.

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

## 🗂️ Estrutura de Diretórios Detalhada

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout global
│   ├── page.tsx                 # Página principal (Dashboard)
│   ├── api/                     # API Routes (opcional)
│   │   └── refresh/route.ts    # Endpoint para refresh de dados
│   └── globals.css              # Estilos globais
│
├── components/                   # Componentes React
│   ├── Dashboard/
│   │   └── Dashboard.tsx        # Container principal
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
│   └── ui/                      # Componentes base (shadcn/ui)
│       ├── card.tsx
│       ├── button.tsx
│       └── input.tsx
│
├── lib/                          # Lógica de negócio e integrações
│   ├── blockchain/              # Integração blockchain
│   │   ├── provider.ts          # Setup do provider (Ethers/Viem)
│   │   ├── evaContract.ts       # Funções do contrato EVA
│   │   └── constants.ts         # Endereços, ABIs, etc
│   ├── api/                     # Clients de APIs externas
│   │   ├── coingecko.ts         # Client CoinGecko
│   │   ├── arbiscan.ts          # Client Arbiscan
│   │   └── exchange.ts          # Client AwesomeAPI (cotação)
│   └── utils/                   # Utilitários
│       ├── formatters.ts        # Formatação de números/moedas
│       ├── calculations.ts      # Cálculos de conversão
│       └── cache.ts             # Sistema de cache simples
│
├── hooks/                        # Custom React Hooks
│   ├── useEVAPrice.ts           # Preço EVA em todas as moedas
│   ├── useTokenMetrics.ts       # Supply, burned, holders
│   ├── useMarketData.ts         # Market cap, volume, etc
│   └── useConverter.ts          # Lógica do conversor universal
│
├── types/                        # TypeScript Types
│   ├── index.ts                 # Exports centralizados
│   ├── token.ts                 # Tipos relacionados ao token
│   ├── api.ts                   # Tipos de respostas de API
│   └── market.ts                # Tipos de dados de mercado
│
└── config/                       # Configurações
    ├── constants.ts             # Constantes globais
    └── env.ts                   # Validação de env vars
```

## 🔄 Fluxo de Dados

### **1. Carregamento Inicial**

```
User acessa /
    ↓
page.tsx renderiza
    ↓
Dashboard.tsx monta
    ↓
Hooks iniciam fetching paralelo:
    ├─→ useEVAPrice() → CoinGecko + AwesomeAPI
    ├─→ useTokenMetrics() → Blockchain + Arbiscan
    └─→ useMarketData() → CoinGecko
    ↓
Estado atualiza
    ↓
UI re-renderiza com dados
```

### **2. Atualização Periódica**

```typescript
// Hooks usam polling ou SWR para auto-refresh
useEVAPrice({
  refreshInterval: 30000, // 30 segundos
  revalidateOnFocus: true,
});
```

### **3. Interação do Usuário (Conversor)**

```
User digita valor em campo
    ↓
onChange dispara
    ↓
useConverter() recalcula todas conversões
    ↓
Estado local atualiza
    ↓
Todos os campos atualizam instantaneamente
```

## 🧩 Componentes Principais

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

## 🎨 Design Patterns Utilizados

### **1. Custom Hooks Pattern**

Encapsula lógica de fetching e state management

### **2. Client Pattern**

API clients isolam lógica de comunicação externa

### **3. Presenter Pattern**

Componentes apenas apresentam dados, hooks gerenciam estado

### **4. Container/Presentational Pattern**

Dashboard (container) gerencia estado, componentes filhos apresentam

## 🔐 Segurança

### **API Keys**

```typescript
// src/config/env.ts
export const env = {
  arbitrumRpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL!,
  arbiscanKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY!,
  coingeckoKey: process.env.COINGECKO_API_KEY, // Opcional
};

// Validação na inicialização
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

## 🚀 Performance

### **1. Data Fetching Paralelo**

Todas as chamadas de API são feitas em paralelo com `Promise.all`

### **2. Caching**

Sistema de cache simples para evitar requests desnecessários

### **3. Debouncing no Conversor**

Input do usuário é debounced para evitar cálculos excessivos

### **4. React Optimization**

- `useMemo` para cálculos pesados
- `useCallback` para funções passadas como props
- `React.memo` para componentes que re-renderizam muito

## 📱 Responsividade

```typescript
// Breakpoints Tailwind
const screens = {
  sm: "640px", // Mobile grande
  md: "768px", // Tablet
  lg: "1024px", // Desktop pequeno
  xl: "1280px", // Desktop grande
};
```

Layout adapta de:

- **Mobile:** 1 coluna
- **Tablet:** 2 colunas
- **Desktop:** 3-4 colunas (grid)

## 🧪 Testabilidade

Arquitetura permite testar cada camada isoladamente:

```typescript
// Testar hook sem UI
const { result } = renderHook(() => useEVAPrice())

// Testar API client sem hook
const price = await coingecko.getEVAPrice()

// Testar componente com dados mockados
render(<PricePanel price={mockPrice} loading={false} />)
```

---

**Próximos passos:** Ver [ROADMAP_BACKEND.md](./ROADMAP_BACKEND.md) para implementação
