# 🪙 EVA Tokenomics Dashboard

Dashboard de análise on-chain para o token **EVA (Ever Value Coin)** na rede Arbitrum.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 🎯 Objetivo

Centralizar métricas e cálculos do token EVA em um único painel, eliminando a necessidade de consultar múltiplas fontes e fazer cálculos manuais.

## ✨ Funcionalidades

### **Essenciais**

- ✅ Painel de conversão universal: BTC ↔ Satoshi ↔ USD ↔ BRL ↔ EVA
- ✅ Preço EVA em tempo real (USD e BRL)
- ✅ Conversão EVA para Satoshis e BTC

### **Extras**

- 📊 Total Supply, Tokens Queimados e Circulantes
- 👥 Número de Holders
- 💰 Market Cap e Volume 24h
- 💧 Liquidez nos principais pools
- 🧮 Calculadora de investimento

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router) + React 18
- **Styling:** Tailwind CSS
- **Blockchain:** Ethers.js / Viem
- **APIs:**
  - Arbitrum RPC (dados on-chain)
  - CoinGecko (preços)
  - AwesomeAPI (cotação BRL)
  - Arbiscan API (holders e transações)

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- npm/yarn/pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/jemluz/eva-tokenomics-dashboard.git
cd eva-tokenomics-dashboard

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas API keys

# Rode em desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

## 🔑 Variáveis de Ambiente

```env
# RPC Arbitrum (pode usar público ou Alchemy/Infura)
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Arbiscan API Key (obtenha em https://arbiscan.io/apis)
NEXT_PUBLIC_ARBISCAN_API_KEY=your_api_key_here

# Opcional: CoinGecko API Key (para rate limits maiores)
COINGECKO_API_KEY=your_api_key_here
```

## 📚 Documentação

- [Arquitetura](./docs/ARCHITECTURE.md)
- [Integração de APIs](./docs/API_INTEGRATION.md)
- [Roadmap Backend](./docs/ROADMAP_BACKEND.md)
- [Roadmap Frontend](./docs/ROADMAP_FRONTEND.md)
- [Contexto para AI](./docs/AI_CONTEXT.md)

## 📊 Contrato EVA

- **Endereço:** `0x45D9831d8751B2325f3DBf48db748723726e1C8c`
- **Rede:** Arbitrum One
- **Explorer:** [Arbiscan](https://arbiscan.io/token/0x45D9831d8751B2325f3DBf48db748723726e1C8c)

## 🤝 Contribuindo

Este é um projeto pessoal de portfólio, mas sugestões são bem-vindas!

## 📝 Licença

MIT

---

**Desenvolvido por [@jemluz](https://github.com/jemluz)**
