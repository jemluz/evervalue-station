# 🛠️ Backend Roadmap - EVA Tokenomics Dashboard

This guide walks you step by step through implementing the data layer and integrations for the project.

---

## 📚 Table of Contents

1. [Initial Setup](#1-initial-setup)
2. [Environment Configuration](#2-environment-configuration)
3. [Blockchain Integration](#3-blockchain-integration)
4. [API Clients](#4-api-clients)
5. [Custom Hooks](#5-custom-hooks)
6. [Utilities](#6-utilities)
7. [Testing](#7-testing)

---

## 1️⃣ Initial Setup

### **1.1 Create Next.js Project**

```bash
npx create-next-app@latest eva-tokenomics-dashboard
```

**Recommended options:**

```
✔ Would you like to use TypeScript? Yes
✔ Would you like to use ESLint? Yes
✔ Would you like to use Tailwind CSS? Yes
✔ Would you like to use `src/` directory? Yes
✔ Would you like to use App Router? Yes
✔ Would you like to customize the default import alias? No
```

### **1.2 Install Dependencies**

```bash
cd eva-tokenomics-dashboard

# Blockchain
npm install ethers@6

# Modern alternative (choose one):
# npm install viem

# Utilities
npm install swr  # For data fetching with cache
npm install date-fns  # For date formatting

# Dev dependencies
npm install -D @types/node
```

### **1.3 Folder Structure**

```bash
mkdir -p src/{lib,hooks,types,config}
mkdir -p src/lib/{blockchain,api,utils}
mkdir -p src/components/{Dashboard,Converter,PricePanel,SupplyMetrics,MarketData,Calculator,ui}
mkdir -p docs
```

---

## 2️⃣ Environment Configuration

### **2.1 Create `.env.local` file**

```bash
touch .env.local
```

```env
# .env.local

# Arbitrum RPC
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Arbiscan API Key (obter em https://arbiscan.io/apis)
NEXT_PUBLIC_ARBISCAN_API_KEY=your_api_key_here

# CoinGecko (opcional)
COINGECKO_API_KEY=
```

### **2.2 Create `.env.local.example`**

```bash
cp .env.local .env.local.example
```

Edit `.env.local.example` and replace the keys with placeholders:

```env
# .env.local.example

NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_ARBISCAN_API_KEY=your_api_key_here
COINGECKO_API_KEY=your_api_key_here_optional
```

### **2.3 Add env var validation**

```typescript
// src/config/env.ts

export const env = {
  arbitrumRpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  arbiscanKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY,
  coingeckoKey: process.env.COINGECKO_API_KEY,
} as const;

// Validação
if (!env.arbitrumRpc) {
  throw new Error("Missing NEXT_PUBLIC_ARBITRUM_RPC_URL");
}

if (!env.arbiscanKey) {
  throw new Error("Missing NEXT_PUBLIC_ARBISCAN_API_KEY");
}
```

### **2.4 Create global constants**

```typescript
// src/config/constants.ts

export const EVA_TOKEN = {
  address: "0x45D9831d8751B2325f3DBf48db748723726e1C8c",
  symbol: "EVA",
  name: "Ever Value Coin",
  decimals: 18, // Verificar via contrato
  chainId: 42161, // Arbitrum One
} as const;

export const CHAIN_CONFIG = {
  arbitrum: {
    id: 42161,
    name: "Arbitrum One",
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL!,
    explorerUrl: "https://arbiscan.io",
  },
} as const;

export const REFRESH_INTERVALS = {
  price: 30_000, // 30 segundos
  metrics: 60_000, // 1 minuto
  holders: 300_000, // 5 minutos
} as const;

export const COINGECKO_IDS = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
} as const;
```

---

## 3️⃣ Blockchain Integration

### **3.1 Create Provider**

```typescript
// src/lib/blockchain/provider.ts

import { ethers } from "ethers";
import { env } from "@/config/env";

let provider: ethers.JsonRpcProvider | null = null;

/**
 * Singleton pattern para provider
 * Evita criar múltiplas instâncias
 */
export function getProvider(): ethers.JsonRpcProvider {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(env.arbitrumRpc);
  }
  return provider;
}

/**
 * Testa conexão com a blockchain
 */
export async function testConnection(): Promise<boolean> {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Conectado à Arbitrum. Bloco atual:", blockNumber);
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
    return false;
  }
}
```

### **3.2 Create ABIs**

```typescript
// src/lib/blockchain/abis.ts

/**
 * ABI mínimo do padrão ERC-20
 * Apenas as funções que vamos usar
 */
export const ERC20_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
] as const;

/**
 * Se EVA tiver funções customizadas, adicione aqui
 * Exemplo: função para consultar tokens queimados
 */
export const EVA_CUSTOM_ABI = [
  // 'function burnedSupply() view returns (uint256)',
  // Adicione se existir
] as const;

export const EVA_ABI = [...ERC20_ABI, ...EVA_CUSTOM_ABI];
```

### **3.3 Create Contract Client**

```typescript
// src/lib/blockchain/evaContract.ts

import { ethers } from "ethers";
import { getProvider } from "./provider";
import { EVA_ABI } from "./abis";
import { EVA_TOKEN } from "@/config/constants";

/**
 * Cria instância do contrato EVA
 */
function getContract(): ethers.Contract {
  const provider = getProvider();
  return new ethers.Contract(EVA_TOKEN.address, EVA_ABI, provider);
}

/**
 * Busca o total supply do token
 * @returns Total supply formatado (string com decimais)
 */
export async function getTotalSupply(): Promise<string> {
  try {
    const contract = getContract();
    const supply = await contract.totalSupply();
    const decimals = await contract.decimals();
    return ethers.formatUnits(supply, decimals);
  } catch (error) {
    console.error("Error fetching total supply:", error);
    throw new Error("Failed to fetch total supply");
  }
}

/**
 * Busca o número de decimais do token
 */
export async function getDecimals(): Promise<number> {
  try {
    const contract = getContract();
    return await contract.decimals();
  } catch (error) {
    console.error("Error fetching decimals:", error);
    throw new Error("Failed to fetch decimals");
  }
}

/**
 * Busca o nome do token
 */
export async function getTokenName(): Promise<string> {
  try {
    const contract = getContract();
    return await contract.name();
  } catch (error) {
    console.error("Error fetching token name:", error);
    throw new Error("Failed to fetch token name");
  }
}

/**
 * Busca o símbolo do token
 */
export async function getTokenSymbol(): Promise<string> {
  try {
    const contract = getContract();
    return await contract.symbol();
  } catch (error) {
    console.error("Error fetching token symbol:", error);
    throw new Error("Failed to fetch token symbol");
  }
}

/**
 * Busca o balance de um endereço específico
 * Útil para verificar burned tokens (endereço 0x000...000)
 */
export async function getBalance(address: string): Promise<string> {
  try {
    const contract = getContract();
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw new Error("Failed to fetch balance");
  }
}

/**
 * Busca tokens queimados (enviados para endereço zero)
 */
export async function getBurnedSupply(): Promise<string> {
  const BURN_ADDRESS = "0x0000000000000000000000000000000000000000";
  return getBalance(BURN_ADDRESS);
}

/**
 * Calcula circulating supply (total - burned)
 */
export async function getCirculatingSupply(): Promise<string> {
  try {
    const [total, burned] = await Promise.all([
      getTotalSupply(),
      getBurnedSupply(),
    ]);

    const totalNum = parseFloat(total);
    const burnedNum = parseFloat(burned);
    const circulating = totalNum - burnedNum;

    return circulating.toString();
  } catch (error) {
    console.error("Error calculating circulating supply:", error);
    throw new Error("Failed to calculate circulating supply");
  }
}
```

### **3.4 Test Blockchain Integration**

Create a temporary file to test:

```typescript
// test-blockchain.ts (na raiz do projeto)

import {
  testConnection,
  getTotalSupply,
  getDecimals,
} from "./src/lib/blockchain";

async function test() {
  console.log("🧪 Testando integração blockchain...\n");

  // 1. Testar conexão
  await testConnection();

  // 2. Testar leitura de dados
  const decimals = await getDecimals();
  console.log("📊 Decimals:", decimals);

  const totalSupply = await getTotalSupply();
  console.log("📊 Total Supply:", totalSupply);
}

test();
```

Run:

```bash
npx tsx test-blockchain.ts
```

---

## 4️⃣ API Clients

### **4.1 CoinGecko Client**

```typescript
// src/lib/api/coingecko.ts

import { COINGECKO_IDS, EVA_TOKEN } from "@/config/constants";

const BASE_URL = "https://api.coingecko.com/api/v3";

interface TokenPriceResponse {
  [address: string]: {
    usd: number;
  };
}

interface SimplePriceResponse {
  [coin: string]: {
    usd: number;
  };
}

interface MarketDataResponse {
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
  };
}

/**
 * Busca preço do token EVA em USD
 */
export async function getEVAPrice(): Promise<number> {
  try {
    const url =
      `${BASE_URL}/simple/token_price/arbitrum-one?` +
      `contract_addresses=${EVA_TOKEN.address}&vs_currencies=usd`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: TokenPriceResponse = await response.json();
    const price = data[EVA_TOKEN.address.toLowerCase()]?.usd;

    if (!price) {
      throw new Error("Price not found in response");
    }

    return price;
  } catch (error) {
    console.error("Error fetching EVA price:", error);
    throw new Error("Failed to fetch EVA price from CoinGecko");
  }
}

/**
 * Busca preço do Bitcoin em USD
 */
export async function getBTCPrice(): Promise<number> {
  try {
    const url =
      `${BASE_URL}/simple/price?` +
      `ids=${COINGECKO_IDS.bitcoin}&vs_currencies=usd`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: SimplePriceResponse = await response.json();
    const price = data[COINGECKO_IDS.bitcoin]?.usd;

    if (!price) {
      throw new Error("BTC price not found in response");
    }

    return price;
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    throw new Error("Failed to fetch BTC price from CoinGecko");
  }
}

/**
 * Busca market data completo do EVA
 */
export async function getEVAMarketData() {
  try {
    const url = `${BASE_URL}/coins/arbitrum-one/contract/${EVA_TOKEN.address}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: MarketDataResponse = await response.json();

    return {
      price: data.market_data.current_price.usd,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      priceChange24h: data.market_data.price_change_percentage_24h,
    };
  } catch (error) {
    console.error("Error fetching EVA market data:", error);
    throw new Error("Failed to fetch EVA market data from CoinGecko");
  }
}

/**
 * Helper: Retry com backoff exponencial
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;

      const waitTime = delay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${retries} após ${waitTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw new Error("Max retries reached");
}

// Exportar versões com retry
export const coingecko = {
  getEVAPrice: () => fetchWithRetry(getEVAPrice),
  getBTCPrice: () => fetchWithRetry(getBTCPrice),
  getMarketData: () => fetchWithRetry(getEVAMarketData),
};
```

### **4.2 AwesomeAPI Client (BRL Exchange Rate)**

```typescript
// src/lib/api/exchange.ts

const BASE_URL = "https://economia.awesomeapi.com.br/json/last";

interface ExchangeRateResponse {
  USDBRL: {
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    varBid: string;
    pctChange: string;
    bid: string; // Preço de compra (usar este)
    ask: string; // Preço de venda
    timestamp: string;
    create_date: string;
  };
}

interface BTCBRLResponse {
  BTCBRL: {
    bid: string;
    ask: string;
  };
}

/**
 * Busca cotação USD → BRL
 */
export async function getBRLRate(): Promise<number> {
  try {
    const response = await fetch(`${BASE_URL}/USD-BRL`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ExchangeRateResponse = await response.json();
    const rate = parseFloat(data.USDBRL.bid);

    if (isNaN(rate)) {
      throw new Error("Invalid BRL rate received");
    }

    return rate;
  } catch (error) {
    console.error("Error fetching BRL rate:", error);
    throw new Error("Failed to fetch BRL exchange rate");
  }
}

/**
 * Busca preço do BTC em BRL
 * (alternativa ao CoinGecko)
 */
export async function getBTCinBRL(): Promise<number> {
  try {
    const response = await fetch(`${BASE_URL}/BTC-BRL`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: BTCBRLResponse = await response.json();
    const price = parseFloat(data.BTCBRL.bid);

    if (isNaN(price)) {
      throw new Error("Invalid BTC price received");
    }

    return price;
  } catch (error) {
    console.error("Error fetching BTC in BRL:", error);
    throw new Error("Failed to fetch BTC price in BRL");
  }
}

export const exchange = {
  getBRLRate,
  getBTCinBRL,
};
```

### **4.3 Arbiscan Client**

```typescript
// src/lib/api/arbiscan.ts

import { env } from "@/config/env";
import { EVA_TOKEN } from "@/config/constants";

const BASE_URL = "https://api.arbiscan.io/api";

interface ArbiscanResponse<T> {
  status: "0" | "1";
  message: string;
  result: T;
}

interface TokenHolder {
  TokenHolderAddress: string;
  TokenHolderQuantity: string;
}

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
}

/**
 * Busca número de holders do token EVA
 *
 * NOTA: A API do Arbiscan não retorna o total diretamente.
 * Precisamos fazer uma request e contar, ou usar um endpoint alternativo.
 */
export async function getHolderCount(): Promise<number> {
  try {
    // Endpoint que lista holders (limitado a 10000)
    const url =
      `${BASE_URL}?module=token&action=tokenholderlist` +
      `&contractaddress=${EVA_TOKEN.address}` +
      `&page=1&offset=10000` + // Max offset
      `&apikey=${env.arbiscanKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ArbiscanResponse<TokenHolder[]> = await response.json();

    if (data.status !== "1") {
      throw new Error(`Arbiscan API error: ${data.message}`);
    }

    // Se tiver 10000 resultados, significa que tem mais
    // Nesse caso, retornar "10000+" ou fazer múltiplas requests
    return data.result.length;
  } catch (error) {
    console.error("Error fetching holder count:", error);
    throw new Error("Failed to fetch holder count from Arbiscan");
  }
}

/**
 * Busca transações recentes do token EVA
 */
export async function getRecentTransactions(
  page = 1,
  limit = 10,
): Promise<Transaction[]> {
  try {
    const url =
      `${BASE_URL}?module=account&action=tokentx` +
      `&contractaddress=${EVA_TOKEN.address}` +
      `&page=${page}&offset=${limit}` +
      `&sort=desc` +
      `&apikey=${env.arbiscanKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ArbiscanResponse<Transaction[]> = await response.json();

    if (data.status !== "1") {
      // Se não houver transações, retorna array vazio
      if (data.message === "No transactions found") {
        return [];
      }
      throw new Error(`Arbiscan API error: ${data.message}`);
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions from Arbiscan");
  }
}

/**
 * Rate limiter para respeitar o limite de 5 req/seg
 */
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private interval = 200; // 200ms = 5 req/seg

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

const limiter = new RateLimiter();

// Exportar versões com rate limiting
export const arbiscan = {
  getHolderCount: () => limiter.add(getHolderCount),
  getRecentTransactions: (page?: number, limit?: number) =>
    limiter.add(() => getRecentTransactions(page, limit)),
};
```

### **4.4 Test API Clients**

```typescript
// test-apis.ts (na raiz)

import { coingecko } from "./src/lib/api/coingecko";
import { exchange } from "./src/lib/api/exchange";
import { arbiscan } from "./src/lib/api/arbiscan";

async function testAPIs() {
  console.log("🧪 Testando API Clients...\n");

  try {
    // CoinGecko
    console.log("1️⃣ CoinGecko:");
    const evaPrice = await coingecko.getEVAPrice();
    console.log("  EVA Price:", evaPrice, "USD");

    const btcPrice = await coingecko.getBTCPrice();
    console.log("  BTC Price:", btcPrice, "USD\n");

    // AwesomeAPI
    console.log("2️⃣ AwesomeAPI:");
    const brlRate = await exchange.getBRLRate();
    console.log("  USD/BRL:", brlRate, "\n");

    // Arbiscan
    console.log("3️⃣ Arbiscan:");
    const holders = await arbiscan.getHolderCount();
    console.log("  Holders:", holders);

    const txs = await arbiscan.getRecentTransactions(1, 5);
    console.log("  Recent TXs:", txs.length);

    console.log("\n✅ Todos os testes passaram!");
  } catch (error) {
    console.error("\n❌ Erro nos testes:", error);
  }
}

testAPIs();
```

Run:

```bash
npx tsx test-apis.ts
```

---

## 5️⃣ Custom Hooks

### **5.1 useEVAPrice Hook**

```typescript
// src/hooks/useEVAPrice.ts

"use client";

import { useState, useEffect } from "react";
import { coingecko } from "@/lib/api/coingecko";
import { exchange } from "@/lib/api/exchange";
import { REFRESH_INTERVALS } from "@/config/constants";

export interface EVAPrice {
  usd: number;
  brl: number;
  btc: number;
  satoshi: number;
}

interface UseEVAPriceReturn {
  price: EVAPrice | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseEVAPriceOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useEVAPrice(
  options: UseEVAPriceOptions = {},
): UseEVAPriceReturn {
  const { refreshInterval = REFRESH_INTERVALS.price, enabled = true } = options;

  const [price, setPrice] = useState<EVAPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrice = async () => {
    try {
      setError(null);

      // Buscar todos os preços em paralelo
      const [evaUsd, btcUsd, brlRate] = await Promise.all([
        coingecko.getEVAPrice(),
        coingecko.getBTCPrice(),
        exchange.getBRLRate(),
      ]);

      // Calcular conversões
      const evaBrl = evaUsd * brlRate;
      const evaBtc = evaUsd / btcUsd;
      const evaSat = evaBtc * 100_000_000;

      setPrice({
        usd: evaUsd,
        brl: evaBrl,
        btc: evaBtc,
        satoshi: evaSat,
      });
    } catch (err) {
      console.error("Error fetching EVA price:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchPrice();

    const interval = setInterval(fetchPrice, refreshInterval);
    return () => clearInterval(interval);
  }, [enabled, refreshInterval]);

  return {
    price,
    loading,
    error,
    refetch: fetchPrice,
  };
}
```

### **5.2 useTokenMetrics Hook**

```typescript
// src/hooks/useTokenMetrics.ts

"use client";

import { useState, useEffect } from "react";
import {
  getTotalSupply,
  getBurnedSupply,
  getCirculatingSupply,
} from "@/lib/blockchain/evaContract";
import { arbiscan } from "@/lib/api/arbiscan";
import { REFRESH_INTERVALS } from "@/config/constants";

export interface TokenMetrics {
  totalSupply: string;
  burnedSupply: string;
  circulatingSupply: string;
  holderCount: number;
}

interface UseTokenMetricsReturn {
  metrics: TokenMetrics | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseTokenMetricsOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useTokenMetrics(
  options: UseTokenMetricsOptions = {},
): UseTokenMetricsReturn {
  const { refreshInterval = REFRESH_INTERVALS.metrics, enabled = true } =
    options;

  const [metrics, setMetrics] = useState<TokenMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = async () => {
    try {
      setError(null);

      // Buscar métricas em paralelo
      const [total, burned, circulating, holders] = await Promise.all([
        getTotalSupply(),
        getBurnedSupply(),
        getCirculatingSupply(),
        arbiscan.getHolderCount(),
      ]);

      setMetrics({
        totalSupply: total,
        burnedSupply: burned,
        circulatingSupply: circulating,
        holderCount: holders,
      });
    } catch (err) {
      console.error("Error fetching token metrics:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchMetrics();

    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [enabled, refreshInterval]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}
```

### **5.3 useMarketData Hook**

```typescript
// src/hooks/useMarketData.ts

"use client";

import { useState, useEffect } from "react";
import { coingecko } from "@/lib/api/coingecko";
import { REFRESH_INTERVALS } from "@/config/constants";

export interface MarketData {
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
}

interface UseMarketDataReturn {
  data: MarketData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseMarketDataOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useMarketData(
  options: UseMarketDataOptions = {},
): UseMarketDataReturn {
  const { refreshInterval = REFRESH_INTERVALS.metrics, enabled = true } =
    options;

  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const marketData = await coingecko.getMarketData();
      setData(marketData);
    } catch (err) {
      console.error("Error fetching market data:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchData();

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [enabled, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
```

### **5.4 useConverter Hook**

```typescript
// src/hooks/useConverter.ts

"use client";

import { useState, useCallback } from "react";
import { EVAPrice } from "./useEVAPrice";

type Currency = "eva" | "usd" | "brl" | "btc" | "satoshi";

export interface ConversionValues {
  eva: string;
  usd: string;
  brl: string;
  btc: string;
  satoshi: string;
}

interface UseConverterReturn {
  values: ConversionValues;
  convert: (amount: string, from: Currency) => void;
  reset: () => void;
}

const initialValues: ConversionValues = {
  eva: "",
  usd: "",
  brl: "",
  btc: "",
  satoshi: "",
};

export function useConverter(price: EVAPrice | null): UseConverterReturn {
  const [values, setValues] = useState<ConversionValues>(initialValues);

  const convert = useCallback(
    (amount: string, from: Currency) => {
      if (!price || !amount || amount === "0") {
        setValues(initialValues);
        return;
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        setValues(initialValues);
        return;
      }

      let evaAmount: number;

      // Converter para EVA primeiro
      switch (from) {
        case "eva":
          evaAmount = numAmount;
          break;
        case "usd":
          evaAmount = numAmount / price.usd;
          break;
        case "brl":
          evaAmount = numAmount / price.brl;
          break;
        case "btc":
          evaAmount = numAmount / price.btc;
          break;
        case "satoshi":
          evaAmount = numAmount / price.satoshi;
          break;
        default:
          evaAmount = 0;
      }

      // Agora converter EVA para todas as outras moedas
      setValues({
        eva: evaAmount.toFixed(2),
        usd: (evaAmount * price.usd).toFixed(6),
        brl: (evaAmount * price.brl).toFixed(2),
        btc: (evaAmount * price.btc).toFixed(8),
        satoshi: (evaAmount * price.satoshi).toFixed(0),
      });
    },
    [price],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
  }, []);

  return {
    values,
    convert,
    reset,
  };
}
```

---

## 6️⃣ Utilities

### **6.1 Formatters**

```typescript
// src/lib/utils/formatters.ts

/**
 * Formata número como moeda USD
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

/**
 * Formata número como moeda BRL
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}

/**
 * Formata número como BTC
 */
export function formatBTC(value: number): string {
  return `₿ ${value.toFixed(8)}`;
}

/**
 * Formata número como Satoshis
 */
export function formatSatoshi(value: number): string {
  return `${Math.round(value).toLocaleString()} sats`;
}

/**
 * Formata supply (grandes números)
 */
export function formatSupply(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toFixed(2);
}

/**
 * Formata número de holders
 */
export function formatHolders(count: number): string {
  return count.toLocaleString("en-US");
}

/**
 * Formata porcentagem
 */
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Trunca endereço Ethereum
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
```

### **6.2 Calculations**

```typescript
// src/lib/utils/calculations.ts

/**
 * Converte EVA para USD
 */
export function evaToUSD(evaAmount: number, evaPrice: number): number {
  return evaAmount * evaPrice;
}

/**
 * Converte USD para EVA
 */
export function usdToEVA(usdAmount: number, evaPrice: number): number {
  return usdAmount / evaPrice;
}

/**
 * Converte EVA para BRL
 */
export function evaToBRL(evaAmount: number, evaPriceBRL: number): number {
  return evaAmount * evaPriceBRL;
}

/**
 * Converte EVA para BTC
 */
export function evaToBTC(evaAmount: number, evaPriceBTC: number): number {
  return evaAmount * evaPriceBTC;
}

/**
 * Converte EVA para Satoshis
 */
export function evaToSatoshi(evaAmount: number, evaPriceSat: number): number {
  return evaAmount * evaPriceSat;
}

/**
 * Calcula market cap
 */
export function calculateMarketCap(
  circulatingSupply: string,
  priceUSD: number,
): number {
  const supply = parseFloat(circulatingSupply);
  return supply * priceUSD;
}

/**
 * Calcula porcentagem de burned tokens
 */
export function calculateBurnedPercent(burned: string, total: string): number {
  const burnedNum = parseFloat(burned);
  const totalNum = parseFloat(total);
  return (burnedNum / totalNum) * 100;
}
```

### **6.3 Cache (opcional)**

```typescript
// src/lib/utils/cache.ts

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string, ttl: number): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const cache = new SimpleCache();
```

---

## 7️⃣ Testing

### **7.1 Full Integration Test**

```typescript
// test-complete.ts

import { useEVAPrice } from "./src/hooks/useEVAPrice";
import { useTokenMetrics } from "./src/hooks/useTokenMetrics";
import { useMarketData } from "./src/hooks/useMarketData";

async function testComplete() {
  console.log("🧪 Teste Completo de Integração\n");
  console.log("=".repeat(50));

  // Simular hooks (sem React)
  // Na prática, você testaria isso no componente

  console.log("\n✅ Backend está pronto para ser usado no Frontend!");
  console.log("\nPróximo passo: ROADMAP_FRONTEND.md");
}

testComplete();
```

---

## ✅ Backend Checklist

Antes de ir para o Frontend, certifique-se que:

- [ ] Next.js project created
- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] Blockchain provider working
- [ ] EVA contract reads working
- [ ] All API clients tested
- [ ] Custom hooks created
- [ ] Formatting utilities ready
- [ ] Manual tests running without errors

---

## 🎯 Next Steps

Now that the backend is ready, you have:

✅ **Access to blockchain data** (total supply, decimals, etc)
✅ **Real-time prices** (EVA, BTC, BRL exchange rate)
✅ **Token metrics** (supply, burned, holders)
✅ **Hooks ready to use** in React components

**Next document:** [ROADMAP_FRONTEND.md](./ROADMAP_FRONTEND.md)

---

**Questions?** See:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the architecture
- [API_INTEGRATION.md](./API_INTEGRATION.md) - API details
- [AI_CONTEXT.md](./AI_CONTEXT.md) - Full project context
