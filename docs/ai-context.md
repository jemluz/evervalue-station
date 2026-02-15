# 🤖 AI Context - EVA Tokenomics Dashboard

Este documento fornece contexto completo para agentes de IA auxiliarem no desenvolvimento do projeto.

## 📋 Visão Geral do Projeto

**Nome:** EVA Tokenomics Dashboard
**Tipo:** Web Application (DApp Analytics)
**Objetivo:** Dashboard centralizado para análise on-chain do token EVA (Ever Value Coin)
**Usuário:** Investidor retail que compra EVA frequentemente na rede Arbitrum

## 🎯 Problema que Resolve

O usuário atualmente precisa:

1. Acessar Arbiscan manualmente
2. Fazer cálculos de conversão entre moedas
3. Consultar múltiplas fontes para entender métricas do token
4. Repetir esse processo toda vez que quer analisar o token

**Solução:** Centralizar tudo em um único dashboard com atualizações em tempo real.

## 🔧 Stack Técnica

```json
{
  "framework": "Next.js 14",
  "router": "App Router",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "blockchain": "Ethers.js ou Viem",
  "deployment": "Vercel",
  "apis": ["Arbitrum RPC", "CoinGecko API", "AwesomeAPI (BRL)", "Arbiscan API"]
}
```

## 📊 Informações do Token EVA

```typescript
const EVA_TOKEN = {
  name: "Ever Value Coin",
  symbol: "EVA",
  address: "0x45D9831d8751B2325f3DBf48db748723726e1C8c",
  network: "Arbitrum One",
  chainId: 42161,
  decimals: 18, // Verificar via contrato
  type: "ERC-20",
};
```

## 🎨 Funcionalidades (Prioridade)

### **P0 - Essenciais (MVP)**

1. **Conversor Universal**
   - Input: qualquer moeda (BTC, USD, BRL, EVA, Satoshi)
   - Output: conversão para todas as outras
   - Atualização em tempo real

2. **Painel de Preço**
   - Preço EVA em USD
   - Preço EVA em BRL
   - Valor em Satoshis
   - Valor em BTC

### **P1 - Extras (V1)**

3. **Métricas de Supply**
   - Total Supply
   - Tokens Queimados
   - Circulating Supply
4. **Holder Metrics**
   - Número total de holders
   - Growth rate (opcional)

### **P2 - Futuro (V2)**

5. **Market Data**
   - Market Cap
   - Volume 24h
   - Liquidez
6. **Calculadora de Investimento**
   - "Investir R$ X → recebo Y EVA"
   - "Se EVA chegar a $X, meu investimento vale Y"

## 🏗️ Arquitetura de Componentes

```
Dashboard (página principal)
├── Header (logo, título, preço atual)
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

## 🔌 Integrações de API

### **1. Arbitrum RPC (Blockchain)**

```typescript
// Dados que vêm do contrato
interface ContractData {
  totalSupply: bigint;
  decimals: number;
  name: string;
  symbol: string;
}
```

### **2. CoinGecko API**

```typescript
// Preço e market data
interface CoinGeckoResponse {
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
}
```

### **3. AwesomeAPI (Cotação BRL)**

```typescript
interface ExchangeRate {
  USD: {
    bid: string; // Preço de compra
    ask: string; // Preço de venda
  };
}
```

### **4. Arbiscan API**

```typescript
// Número de holders
interface ArbiscanTokenInfo {
  result: string; // número de holders em string
}
```

## 📁 Estrutura de Dados (State Management)

```typescript
// Global state (pode usar Context API ou Zustand)
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

## 🎓 Nível de Conhecimento do Desenvolvedor

**Frontend:**

- ✅ React (experiente)
- ✅ Next.js (experiente)
- ✅ TypeScript (confortável)

**Backend/APIs:**

- ⚠️ Básico (precisa de orientação)
- ⚠️ Primeira experiência com Web3/Blockchain

**Necessidades:**

- Passo a passo detalhado para integrações
- Explicações sobre conceitos Web3
- Boas práticas de organização de código backend

## 🚦 Roadmap de Implementação

### **Fase 1: Documentação** ✅

- Criar todos os arquivos .md
- Definir arquitetura
- Mapear integrações

### **Fase 2: Backend (APIs e Blockchain)**

1. Setup do projeto Next.js
2. Configurar providers (Ethers/Viem)
3. Criar client do contrato EVA
4. Implementar fetchers de API
5. Criar hooks de dados
6. Testar todas as integrações

### **Fase 3: Frontend (UI/UX)**

1. Setup Tailwind
2. Criar layout base
3. Implementar componentes P0
4. Implementar componentes P1
5. Adicionar loading states
6. Polish e responsividade

### **Fase 4: Deploy**

1. Configurar variáveis de ambiente na Vercel
2. Deploy
3. Testar em produção

## 💡 Dicas para AI Agents

### **Ao sugerir código:**

- Sempre use TypeScript
- Prefira hooks customizados para lógica reutilizável
- Use Tailwind para estilos
- Adicione tratamento de erros
- Inclua loading states
- Comente código complexo

### **Ao ajudar com Web3:**

- Explique conceitos antes de mostrar código
- Use exemplos práticos
- Referencie documentação oficial
- Mostre alternativas (Ethers vs Viem)

### **Ao estruturar código:**

- Separe concerns (UI vs lógica)
- Um arquivo = uma responsabilidade
- Tipos TypeScript em arquivo separado
- Constantes em arquivos dedicados

## 🔗 Links Úteis

- **Contrato EVA:** https://arbiscan.io/token/0x45D9831d8751B2325f3DBf48db748723726e1C8c
- **Arbitrum RPC:** https://docs.arbitrum.io/build-decentralized-apps/reference/node-providers
- **CoinGecko API:** https://www.coingecko.com/en/api/documentation
- **Arbiscan API:** https://docs.arbiscan.io/
- **AwesomeAPI:** https://docs.awesomeapi.com.br/

## 📞 Quando o Desenvolvedor Precisa de Ajuda

**Backend/APIs:**

- Como estruturar fetchers
- Como lidar com rate limits
- Como cachear dados
- Como tratar erros de rede

**Web3:**

- Como conectar com blockchain
- Como ler dados de contrato
- Como formatar BigInt
- Como calcular valores com decimais

**Arquitetura:**

- Onde colocar cada lógica
- Como organizar state
- Quando usar Server vs Client Components
- Como otimizar performance

---

**Última atualização:** 2026-02-14
