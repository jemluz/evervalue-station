# 🔌 Integração de APIs - EVA Tokenomics Dashboard

Este documento detalha todas as APIs usadas no projeto, como obter acesso, limites e exemplos de uso.

## 📋 Resumo das APIs

| API              | Propósito      | Rate Limit (Free) | Autenticação |
| ---------------- | -------------- | ----------------- | ------------ |
| **Arbitrum RPC** | Dados on-chain | Ilimitado\*       | Não          |
| **CoinGecko**    | Preços crypto  | 10-50 req/min     | Opcional     |
| **AwesomeAPI**   | Cotação BRL    | Ilimitado         | Não          |
| **Arbiscan**     | Holders, txs   | 5 req/seg         | API Key      |

\*Depende do provider (público pode ter throttling)

---

## 1️⃣ Arbitrum RPC

### **O que é?**

Endpoint para comunicação direta com a blockchain Arbitrum. Permite ler dados de contratos inteligentes.

### **Endpoints Disponíveis**

#### **Opção 1: RPC Público (Grátis, pode ser lento)**

```
https://arb1.arbitrum.io/rpc
```

#### **Opção 2: Alchemy (Recomendado)**

```
https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

- **Sign up:** https://www.alchemy.com/
- **Free tier:** 300M compute units/mês

#### **Opção 3: Infura**

```
https://arbitrum-mainnet.infura.io/v3/YOUR_API_KEY
```

- **Sign up:** https://infura.io/
- **Free tier:** 100k requests/dia

### **Como Usar no Projeto**

```typescript
// src/lib/blockchain/provider.ts
import { ethers } from "ethers";

const RPC_URL = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL!;

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}
```

### **Métodos do Contrato EVA**

```typescript
// src/lib/blockchain/evaContract.ts
import { ethers } from "ethers";
import { getProvider } from "./provider";

const EVA_ADDRESS = "0x45D9831d8751B2325f3DBf48db748723726e1C8c";

// ABI mínimo necessário (ERC-20 padrão)
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

### **Exemplo de Resposta**

```typescript
await getTotalSupply();
// "1000000000.0" (1 bilhão de tokens)

await getDecimals();
// 18
```

---

## 2️⃣ CoinGecko API

### **O que é?**

API de dados de mercado crypto (preços, volume, market cap).

### **Endpoints**

**Base URL:** `https://api.coingecko.com/api/v3`

#### **Preço do EVA**

```
GET /simple/token_price/{platform}
    ?contract_addresses={address}
    &vs_currencies={currencies}
```

#### **Preço do Bitcoin**

```
GET /simple/price
    ?ids=bitcoin
    &vs_currencies=usd
```

### **Rate Limits**

| Tier           | Requests  | Custo    |
| -------------- | --------- | -------- |
| Demo (sem key) | 10-50/min | Grátis   |
| Analyst        | 500/min   | $129/mês |

Para este projeto, o **free tier é suficiente**.

### **Como Usar no Projeto**

```typescript
// src/lib/api/coingecko.ts

const BASE_URL = "https://api.coingecko.com/api/v3";
const EVA_ADDRESS = "0x45D9831d8751B2325f3DBf48db748723726e1C8c";

export const coingecko = {
  /**
   * Busca preço do EVA em USD
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
   * Busca preço do Bitcoin em USD
   */
  async getBTCPrice(): Promise<number> {
    const url = `${BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch BTC price");

    const data = await response.json();
    return data.bitcoin.usd;
  },

  /**
   * Busca market data completo do EVA
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

### **Exemplo de Resposta**

```json
// GET /simple/token_price/arbitrum-one?contract_addresses=0x45...&vs_currencies=usd
{
  "0x45d9831d8751b2325f3dbf48db748723726e1c8c": {
    "usd": 0.00123456
  }
}
```

### **Tratamento de Erros**

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

// Uso
const price = await fetchWithRetry(() => coingecko.getEVAPrice());
```

---

## 3️⃣ AwesomeAPI (Cotação BRL)

### **O que é?**

API brasileira gratuita para cotações de moedas.

### **Endpoint**

```
GET https://economia.awesomeapi.com.br/json/last/USD-BRL,BTC-BRL
```

### **Como Usar no Projeto**

```typescript
// src/lib/api/exchange.ts

const BASE_URL = "https://economia.awesomeapi.com.br/json/last";

export const exchange = {
  /**
   * Busca cotação USD → BRL
   */
  async getBRLRate(): Promise<number> {
    const response = await fetch(`${BASE_URL}/USD-BRL`);
    if (!response.ok) throw new Error("Failed to fetch BRL rate");

    const data = await response.json();
    return parseFloat(data.USDBRL.bid);
  },

  /**
   * Busca preço do BTC em BRL (alternativa ao CoinGecko)
   */
  async getBTCinBRL(): Promise<number> {
    const response = await fetch(`${BASE_URL}/BTC-BRL`);
    if (!response.ok) throw new Error("Failed to fetch BTC price");

    const data = await response.json();
    return parseFloat(data.BTCBRL.bid);
  },
};
```

### **Exemplo de Resposta**

```json
{
  "USDBRL": {
    "code": "USD",
    "codein": "BRL",
    "name": "Dólar Americano/Real Brasileiro",
    "high": "5.1234",
    "low": "5.0987",
    "varBid": "0.0123",
    "pctChange": "0.24",
    "bid": "5.1150", // ← Preço de COMPRA (usar este)
    "ask": "5.1200", // Preço de VENDA
    "timestamp": "1708012345",
    "create_date": "2026-02-14 10:30:00"
  }
}
```

### **Sem Rate Limit!**

Esta API não tem limite de requisições documentado. Mas use bom senso (não faça 1000 req/seg).

---

## 4️⃣ Arbiscan API

### **O que é?**

API oficial do explorer Arbiscan. Fornece dados de transações, holders, etc.

### **Como Obter API Key**

1. Acesse https://arbiscan.io/
2. Crie uma conta (grátis)
3. Vá em **Account → API Keys**
4. Clique em **Add** e copie sua key

### **Rate Limit**

- **Free:** 5 requests/segundo
- **Suficiente** para este projeto

### **Endpoints Úteis**

#### **Número de Holders**

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

### **Como Usar no Projeto**

```typescript
// src/lib/api/arbiscan.ts

const BASE_URL = "https://api.arbiscan.io/api";
const API_KEY = process.env.NEXT_PUBLIC_ARBISCAN_API_KEY!;
const EVA_ADDRESS = "0x45D9831d8751B2325f3DBf48db748723726e1C8c";

export const arbiscan = {
  /**
   * Busca número de holders
   * Nota: API retorna lista, mas total vem no metadata
   */
  async getHolderCount(): Promise<number> {
    const url =
      `${BASE_URL}?module=token&action=tokenholderlist` +
      `&contractaddress=${EVA_ADDRESS}&page=1&offset=1&apikey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch holders");

    const data = await response.json();
    if (data.status !== "1") throw new Error(data.message);

    // Arbiscan retorna total no resultado
    return parseInt(data.result[0]?.totalHolders || "0");
  },

  /**
   * Busca transações recentes (para análise de atividade)
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

### **Exemplo de Resposta (Holders)**

```json
{
  "status": "1",
  "message": "OK",
  "result": [
    {
      "TokenHolderAddress": "0xabc...",
      "TokenHolderQuantity": "1000000000000000000000",
      "totalHolders": "1234" // ← Total de holders
    }
  ]
}
```

### **Tratamento de Rate Limit**

```typescript
// src/lib/utils/rateLimiter.ts

class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private interval = 200; // 5 req/seg = 200ms entre requests

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

// Uso
const holders = await arbiscanLimiter.add(() => arbiscan.getHolderCount());
```

---

## 🔄 Orquestração de Múltiplas APIs

### **Fetching Paralelo**

```typescript
// src/hooks/useEVAPrice.ts

export function useEVAPrice() {
  const [data, setData] = useState<EVAPriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPrices() {
      try {
        // Buscar tudo em paralelo
        const [evaUsd, btcUsd, brlRate] = await Promise.all([
          coingecko.getEVAPrice(),
          coingecko.getBTCPrice(),
          exchange.getBRLRate(),
        ]);

        // Calcular conversões
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

## 📊 Resumo de Variáveis de Ambiente

```env
# .env.local

# Arbitrum RPC (obrigatório)
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Arbiscan API Key (obrigatório)
NEXT_PUBLIC_ARBISCAN_API_KEY=your_api_key_here

# CoinGecko API Key (opcional, para rate limits maiores)
COINGECKO_API_KEY=your_api_key_here
```

---

## ✅ Checklist de Setup

- [ ] Criar conta na Arbiscan e obter API key
- [ ] Decidir RPC provider (público vs Alchemy/Infura)
- [ ] Configurar `.env.local`
- [ ] Testar cada API client individualmente
- [ ] Implementar rate limiting para Arbiscan
- [ ] Adicionar error handling em todos os fetchers
- [ ] Implementar sistema de cache (opcional)

---

**Próximo passo:** [ROADMAP_BACKEND.md](./ROADMAP_BACKEND.md)
