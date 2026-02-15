# 🎨 Roadmap Frontend - EVA Tokenomics Dashboard

Este guia te leva passo a passo pela implementação da interface do usuário e experiência visual do projeto.

---

## 📚 Índice

1. [Setup do Layout](#1-setup-do-layout)
2. [Sistema de Design](#2-sistema-de-design)
3. [Componentes Base (UI)](#3-componentes-base-ui)
4. [Componentes de Negócio](#4-componentes-de-negócio)
5. [Páginas](#5-páginas)
6. [Estados de Loading e Erro](#6-estados-de-loading-e-erro)
7. [Responsividade](#7-responsividade)
8. [Otimizações](#8-otimizações)

---

## 1️⃣ Setup do Layout

### **1.1 Configurar Tailwind CSS**

O Tailwind já foi instalado no setup inicial. Vamos customizar:

```typescript
// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do projeto (customize conforme preferência)
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        success: {
          light: "#10b981",
          DEFAULT: "#059669",
          dark: "#047857",
        },
        danger: {
          light: "#ef4444",
          DEFAULT: "#dc2626",
          dark: "#b91c1c",
        },
        warning: {
          light: "#f59e0b",
          DEFAULT: "#d97706",
          dark: "#b45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

### **1.2 Configurar Fontes**

```typescript
// src/app/layout.tsx

import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const metadata = {
  title: 'EVA Tokenomics Dashboard',
  description: 'Dashboard de análise on-chain para o token EVA (Ever Value Coin)',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {children}
      </body>
    </html>
  )
}
```

### **1.3 Estilos Globais**

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-slate-700;
  }

  body {
    @apply font-sans antialiased;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold;
  }
}

@layer components {
  /* Card padrão */
  .card {
    @apply bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-xl;
  }

  /* Card com hover */
  .card-hover {
    @apply card transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600 hover:shadow-2xl;
  }

  /* Input padrão */
  .input {
    @apply bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all;
  }

  /* Button padrão */
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900;
  }

  .btn-primary {
    @apply btn bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white;
  }

  .btn-secondary {
    @apply btn bg-slate-700 hover:bg-slate-600 focus:ring-slate-500 text-white;
  }

  /* Badge */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }

  .badge-success {
    @apply badge bg-success-light/10 text-success-light border border-success-light/20;
  }

  .badge-danger {
    @apply badge bg-danger-light/10 text-danger-light border border-danger-light/20;
  }
}

@layer utilities {
  /* Gradientes personalizados */
  .gradient-text {
    @apply bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent;
  }

  /* Animação de entrada */
  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Scrollbar customizada */
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    @apply bg-slate-800;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-slate-600 rounded-full;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-500;
  }
}
```

---

## 2️⃣ Sistema de Design

### **2.1 Criar Types UI**

```typescript
// src/types/ui.ts

export type Size = "sm" | "md" | "lg" | "xl";
export type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning";
export type Status = "idle" | "loading" | "success" | "error";

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
```

### **2.2 Criar Ícones (usando Lucide React)**

```bash
npm install lucide-react
```

```typescript
// src/components/ui/icons.tsx

export {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bitcoin,
  Users,
  Flame,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";
```

---

## 3️⃣ Componentes Base (UI)

### **3.1 Card Component**

```typescript
// src/components/ui/Card.tsx

import { BaseComponentProps } from '@/types/ui'
import { cn } from '@/lib/utils/cn'

interface CardProps extends BaseComponentProps {
  hover?: boolean
}

export function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        hover ? 'card-hover' : 'card',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends BaseComponentProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardBodyProps extends BaseComponentProps {}

export function CardBody({ className, children }: CardBodyProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {children}
    </div>
  )
}
```

### **3.2 Utility: cn (classnames)**

```typescript
// src/lib/utils/cn.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Instalar dependências:

```bash
npm install clsx tailwind-merge
```

### **3.3 Skeleton Loader**

```typescript
// src/components/ui/Skeleton.tsx

import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-700/50',
        className
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
```

### **3.4 Loading Spinner**

```typescript
// src/components/ui/Spinner.tsx

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin text-primary-500',
        sizeMap[size],
        className
      )}
    />
  )
}

export function LoadingOverlay({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Spinner size="lg" />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  )
}
```

### **3.5 Error State**

```typescript
// src/components/ui/ErrorState.tsx

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Erro ao carregar',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-danger-light/10">
        <AlertCircle className="w-8 h-8 text-danger-light" />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400 max-w-md">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </button>
      )}
    </div>
  )
}
```

### **3.6 Badge Component**

```typescript
// src/components/ui/Badge.tsx

import { cn } from '@/lib/utils/cn'
import { Variant } from '@/types/ui'

interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  secondary: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  success: 'bg-success-light/10 text-success-light border-success-light/20',
  danger: 'bg-danger-light/10 text-danger-light border-danger-light/20',
  warning: 'bg-warning-light/10 text-warning-light border-warning-light/20',
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
```

---

## 4️⃣ Componentes de Negócio

### **4.1 Header**

```typescript
// src/components/Dashboard/Header.tsx

import { Bitcoin, ExternalLink } from 'lucide-react'
import { EVA_TOKEN, CHAIN_CONFIG } from '@/config/constants'
import { formatUSD } from '@/lib/utils/formatters'

interface HeaderProps {
  currentPrice?: number
  loading?: boolean
}

export function Header({ currentPrice, loading }: HeaderProps) {
  const explorerUrl = `${CHAIN_CONFIG.arbitrum.explorerUrl}/token/${EVA_TOKEN.address}`

  return (
    <header className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/10 border border-primary-500/20">
              <Bitcoin className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {EVA_TOKEN.name}
              </h1>
              <p className="text-slate-400 text-sm">{EVA_TOKEN.symbol}</p>
            </div>
          </div>

          {currentPrice !== undefined && !loading && (
            <div className="mt-4">
              <p className="text-sm text-slate-400">Preço Atual</p>
              <p className="text-2xl font-bold text-white">
                {formatUSD(currentPrice)}
              </p>
            </div>
          )}
        </div>

        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          Ver no Arbiscan
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </header>
  )
}
```

### **4.2 PriceCard**

```typescript
// src/components/PricePanel/PriceCard.tsx

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PriceCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down'
  trendValue?: string
  loading?: boolean
}

export function PriceCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  loading,
}: PriceCardProps) {
  if (loading) {
    return (
      <Card>
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </Card>
    )
  }

  return (
    <Card hover>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-400">{title}</p>
        {icon && (
          <div className="text-primary-400">
            {icon}
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-white mb-1 font-mono">
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-slate-500">{subtitle}</p>
      )}

      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-success-light" />
          ) : (
            <TrendingDown className="w-4 h-4 text-danger-light" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              trend === 'up' ? 'text-success-light' : 'text-danger-light'
            )}
          >
            {trendValue}
          </span>
        </div>
      )}
    </Card>
  )
}
```

### **4.3 PricePanel**

```typescript
// src/components/PricePanel/PricePanel.tsx

import { PriceCard } from './PriceCard'
import { DollarSign, Bitcoin } from 'lucide-react'
import { EVAPrice } from '@/hooks/useEVAPrice'
import { formatUSD, formatBRL, formatBTC, formatSatoshi } from '@/lib/utils/formatters'

interface PricePanelProps {
  price: EVAPrice | null
  loading: boolean
}

export function PricePanel({ price, loading }: PricePanelProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Preços</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PriceCard
          title="Preço em USD"
          value={price ? formatUSD(price.usd) : '-'}
          subtitle="Dólar Americano"
          icon={<DollarSign className="w-5 h-5" />}
          loading={loading}
        />

        <PriceCard
          title="Preço em BRL"
          value={price ? formatBRL(price.brl) : '-'}
          subtitle="Real Brasileiro"
          icon={<span className="text-lg">R$</span>}
          loading={loading}
        />

        <PriceCard
          title="Preço em BTC"
          value={price ? formatBTC(price.btc) : '-'}
          subtitle="Bitcoin"
          icon={<Bitcoin className="w-5 h-5" />}
          loading={loading}
        />

        <PriceCard
          title="Preço em Satoshis"
          value={price ? formatSatoshi(price.satoshi) : '-'}
          subtitle="Satoshis"
          icon={<span className="text-sm">sats</span>}
          loading={loading}
        />
      </div>
    </div>
  )
}
```

### **4.4 UniversalConverter**

```typescript
// src/components/Converter/UniversalConverter.tsx

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { ArrowUpDown } from 'lucide-react'
import { EVAPrice } from '@/hooks/useEVAPrice'
import { useConverter } from '@/hooks/useConverter'

interface UniversalConverterProps {
  price: EVAPrice | null
}

type Currency = 'eva' | 'usd' | 'brl' | 'btc' | 'satoshi'

const currencies = [
  { value: 'eva' as Currency, label: 'EVA', symbol: 'EVA' },
  { value: 'usd' as Currency, label: 'USD', symbol: '$' },
  { value: 'brl' as Currency, label: 'BRL', symbol: 'R$' },
  { value: 'btc' as Currency, label: 'BTC', symbol: '₿' },
  { value: 'satoshi' as Currency, label: 'Satoshis', symbol: 'sats' },
]

export function UniversalConverter({ price }: UniversalConverterProps) {
  const { values, convert } = useConverter(price)
  const [activeCurrency, setActiveCurrency] = useState<Currency>('usd')

  const handleChange = (currency: Currency, value: string) => {
    setActiveCurrency(currency)
    convert(value, currency)
  }

  if (!price) {
    return (
      <Card className="mb-8">
        <CardHeader
          title="Conversor Universal"
          subtitle="Aguardando preços..."
        />
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader
        title="Conversor Universal"
        subtitle="Converta entre EVA, BTC, USD, BRL e Satoshis"
        action={<ArrowUpDown className="w-5 h-5 text-slate-400" />}
      />

      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {currencies.map(({ value, label, symbol }) => (
            <div key={value}>
              <label className="block text-xs text-slate-400 mb-2">
                {label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={values[value]}
                  onChange={(e) => handleChange(value, e.target.value)}
                  className="input w-full pr-16"
                  step="any"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  {symbol}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          Digite um valor em qualquer campo para converter
        </div>
      </CardBody>
    </Card>
  )
}
```

### **4.5 MetricCard**

```typescript
// src/components/SupplyMetrics/MetricCard.tsx

import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          {subtitle && <Skeleton className="h-3 w-20" />}
        </div>
      </Card>
    )
  }

  return (
    <Card hover>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/10 border border-primary-500/20">
            <Icon className="w-6 h-6 text-primary-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white truncate font-mono">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
```

### **4.6 SupplyMetrics**

```typescript
// src/components/SupplyMetrics/SupplyMetrics.tsx

import { MetricCard } from './MetricCard'
import { Coins, Flame, TrendingUp, Users } from 'lucide-react'
import { TokenMetrics } from '@/hooks/useTokenMetrics'
import { formatSupply, formatHolders, calculateBurnedPercent } from '@/lib/utils/formatters'

interface SupplyMetricsProps {
  metrics: TokenMetrics | null
  loading: boolean
}

export function SupplyMetrics({ metrics, loading }: SupplyMetricsProps) {
  const burnedPercent = metrics
    ? calculateBurnedPercent(metrics.burnedSupply, metrics.totalSupply)
    : 0

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Métricas do Token</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Supply"
          value={metrics ? formatSupply(metrics.totalSupply) : '-'}
          subtitle="Tokens totais criados"
          icon={Coins}
          loading={loading}
        />

        <MetricCard
          title="Tokens Queimados"
          value={metrics ? formatSupply(metrics.burnedSupply) : '-'}
          subtitle={metrics ? `${burnedPercent.toFixed(2)}% do total` : ''}
          icon={Flame}
          loading={loading}
        />

        <MetricCard
          title="Supply Circulante"
          value={metrics ? formatSupply(metrics.circulatingSupply) : '-'}
          subtitle="Tokens em circulação"
          icon={TrendingUp}
          loading={loading}
        />

        <MetricCard
          title="Total de Holders"
          value={metrics ? formatHolders(metrics.holderCount) : '-'}
          subtitle="Endereços únicos"
          icon={Users}
          loading={loading}
        />
      </div>
    </div>
  )
}
```

### **4.7 MarketData Component**

```typescript
// src/components/MarketData/MarketData.tsx

import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { MarketData as MarketDataType } from '@/hooks/useMarketData'
import { formatUSD, formatSupply, formatPercent } from '@/lib/utils/formatters'
import { Skeleton } from '@/components/ui/Skeleton'

interface MarketDataProps {
  data: MarketDataType | null
  loading: boolean
}

export function MarketData({ data, loading }: MarketDataProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Dados de Mercado" />
        <CardBody>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!data) return null

  const isPositive = data.priceChange24h >= 0

  return (
    <Card>
      <CardHeader
        title="Dados de Mercado"
        subtitle="Últimas 24 horas"
        action={
          <Badge variant={isPositive ? 'success' : 'danger'}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1 inline" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1 inline" />
            )}
            {formatPercent(data.priceChange24h)}
          </Badge>
        }
      />

      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Market Cap</span>
            <span className="text-lg font-semibold text-white font-mono">
              {formatUSD(data.marketCap)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <span className="text-sm text-slate-400">Volume 24h</span>
            <span className="text-lg font-semibold text-white font-mono">
              {formatUSD(data.volume24h)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-400">Preço Atual</span>
            <span className="text-lg font-semibold text-white font-mono">
              {formatUSD(data.price)}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
```

### **4.8 InvestmentCalculator**

```typescript
// src/components/Calculator/InvestmentCalculator.tsx

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Calculator } from 'lucide-react'
import { EVAPrice } from '@/hooks/useEVAPrice'
import { formatBRL, formatSupply } from '@/lib/utils/formatters'

interface InvestmentCalculatorProps {
  price: EVAPrice | null
}

export function InvestmentCalculator({ price }: InvestmentCalculatorProps) {
  const [investment, setInvestment] = useState('')
  const [targetPrice, setTargetPrice] = useState('')

  if (!price) return null

  const investmentValue = parseFloat(investment) || 0
  const evaAmount = investmentValue / price.brl

  const targetValue = parseFloat(targetPrice) || 0
  const futureValue = evaAmount * targetValue
  const profit = futureValue - investmentValue
  const profitPercent = investmentValue > 0 ? (profit / investmentValue) * 100 : 0

  return (
    <Card>
      <CardHeader
        title="Calculadora de Investimento"
        subtitle="Simule seu investimento em EVA"
        action={<Calculator className="w-5 h-5 text-slate-400" />}
      />

      <CardBody>
        <div className="space-y-6">
          {/* Input de investimento */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Quanto você quer investir? (BRL)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              className="input w-full"
              step="0.01"
            />
          </div>

          {/* Resultado do investimento */}
          {investmentValue > 0 && (
            <div className="p-4 rounded-lg bg-primary-500/5 border border-primary-500/20">
              <p className="text-sm text-slate-400 mb-1">Você receberá</p>
              <p className="text-2xl font-bold text-primary-400 font-mono">
                {formatSupply(evaAmount)} EVA
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Preço atual: {formatBRL(price.brl)} por EVA
              </p>
            </div>
          )}

          {/* Simulador de preço futuro */}
          {investmentValue > 0 && (
            <>
              <div className="border-t border-slate-700 pt-6">
                <label className="block text-sm text-slate-400 mb-2">
                  Se o preço do EVA chegar a (BRL)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="input w-full"
                  step="0.000001"
                />
              </div>

              {targetValue > 0 && (
                <div className="p-4 rounded-lg bg-success-light/5 border border-success-light/20">
                  <p className="text-sm text-slate-400 mb-1">Seu investimento valerá</p>
                  <p className="text-2xl font-bold text-success-light font-mono">
                    {formatBRL(futureValue)}
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="text-slate-400">Lucro: </span>
                    <span className={profit >= 0 ? 'text-success-light' : 'text-danger-light'}>
                      {formatBRL(profit)} ({profitPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
```

---

## 5️⃣ Páginas

### **5.1 Dashboard Principal**

```typescript
// src/components/Dashboard/Dashboard.tsx

'use client'

import { Header } from './Header'
import { PricePanel } from '../PricePanel/PricePanel'
import { UniversalConverter } from '../Converter/UniversalConverter'
import { SupplyMetrics } from '../SupplyMetrics/SupplyMetrics'
import { MarketData } from '../MarketData/MarketData'
import { InvestmentCalculator } from '../Calculator/InvestmentCalculator'
import { ErrorState } from '../ui/ErrorState'
import { RefreshCw } from 'lucide-react'

import { useEVAPrice } from '@/hooks/useEVAPrice'
import { useTokenMetrics } from '@/hooks/useTokenMetrics'
import { useMarketData } from '@/hooks/useMarketData'

export function Dashboard() {
  const {
    price,
    loading: priceLoading,
    error: priceError,
    refetch: refetchPrice,
  } = useEVAPrice()

  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useTokenMetrics()

  const {
    data: marketData,
    loading: marketLoading,
    error: marketError,
    refetch: refetchMarket,
  } = useMarketData()

  const handleRefreshAll = () => {
    refetchPrice()
    refetchMetrics()
    refetchMarket()
  }

  // Erro crítico (preço não carregou)
  if (priceError && !price) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Erro ao carregar preços"
          message={priceError.message}
          onRetry={refetchPrice}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header com botão de refresh */}
      <div className="flex items-start justify-between mb-8">
        <Header
          currentPrice={price?.usd}
          loading={priceLoading}
        />

        <button
          onClick={handleRefreshAll}
          className="btn-secondary flex items-center gap-2"
          title="Atualizar todos os dados"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Conversor Universal */}
      <UniversalConverter price={price} />

      {/* Painel de Preços */}
      <PricePanel price={price} loading={priceLoading} />

      {/* Métricas do Token */}
      <SupplyMetrics metrics={metrics} loading={metricsLoading} />

      {/* Grid de 2 colunas: Market Data + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketData data={marketData} loading={marketLoading} />
        <InvestmentCalculator price={price} />
      </div>

      {/* Avisos de erro não-críticos */}
      {metricsError && (
        <div className="mt-6 p-4 rounded-lg bg-warning-light/10 border border-warning-light/20 text-warning-light text-sm">
          ⚠️ Não foi possível carregar algumas métricas. Tente atualizar.
        </div>
      )}

      {marketError && (
        <div className="mt-6 p-4 rounded-lg bg-warning-light/10 border border-warning-light/20 text-warning-light text-sm">
          ⚠️ Dados de mercado indisponíveis no momento.
        </div>
      )}
    </div>
  )
}
```

### **5.2 Página Principal (App Router)**

```typescript
// src/app/page.tsx

import { Dashboard } from '@/components/Dashboard/Dashboard'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Dashboard />
    </main>
  )
}
```

---

## 6️⃣ Estados de Loading e Erro

### **6.1 Loading States Strategy**

Cada seção carrega independentemente:

```typescript
// Exemplo de componente com loading granular
{priceLoading ? (
  <SkeletonCard />
) : price ? (
  <PricePanel price={price} />
) : (
  <ErrorState message="Falha ao carregar preços" />
)}
```

### **6.2 Error Boundaries (Opcional)**

```typescript
// src/components/ErrorBoundary.tsx

'use client'

import { Component, ReactNode } from 'react'
import { ErrorState } from './ui/ErrorState'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Algo deu errado"
          message={this.state.error?.message || 'Erro desconhecido'}
          onRetry={() => window.location.reload()}
        />
      )
    }

    return this.props.children
  }
}
```

Usar no layout:

```typescript
// src/app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

## 7️⃣ Responsividade

### **7.1 Grid Responsivo**

```typescript
// Breakpoints usados
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Mobile: 1 coluna */}
  {/* Tablet: 2 colunas */}
  {/* Desktop: 4 colunas */}
</div>
```

### **7.2 Testar Responsividade**

```bash
# Rodar dev server
npm run dev

# Testar em:
# - Mobile (375px)
# - Tablet (768px)
# - Desktop (1280px)
```

---

## 8️⃣ Otimizações

### **8.1 Lazy Loading de Componentes**

```typescript
// src/app/page.tsx
import dynamic from "next/dynamic";

const InvestmentCalculator = dynamic(
  () => import("@/components/Calculator/InvestmentCalculator"),
  { ssr: false },
);
```

### **8.2 Memoização**

```typescript
// Usar React.memo em componentes pesados
export const PriceCard = React.memo(PriceCardComponent);
```

### **8.3 Image Optimization**

Se adicionar imagens:

```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="EVA Token"
  width={48}
  height={48}
  priority
/>
```

---

## ✅ Checklist Frontend

- [ ] Layout global configurado
- [ ] Tailwind customizado com tema
- [ ] Componentes UI base criados (Card, Skeleton, Spinner, etc)
- [ ] Header implementado
- [ ] PricePanel funcionando
- [ ] UniversalConverter funcionando
- [ ] SupplyMetrics exibindo dados
- [ ] MarketData exibindo dados
- [ ] InvestmentCalculator funcionando
- [ ] Estados de loading em todos os componentes
- [ ] Estados de erro tratados
- [ ] Responsividade testada
- [ ] Dashboard completo integrado

---

## 🎯 Próximos Passos

### **Deploy na Vercel**

```bash
# 1. Commit tudo
git add .
git commit -m "feat: EVA Tokenomics Dashboard complete"

# 2. Push para GitHub
git push origin main

# 3. Ir para vercel.com
# - Importar repositório
# - Adicionar env vars (NEXT_PUBLIC_ARBITRUM_RPC_URL, etc)
# - Deploy!
```

### **Melhorias Futuras (V2)**

- [ ] Dark/Light mode toggle
- [ ] Gráfico de histórico de preço (Chart.js ou Recharts)
- [ ] Notificações de preço (Web Push)
- [ ] PWA (funcionar offline)
- [ ] Exportar dados (CSV/PDF)
- [ ] Comparação com outros tokens
- [ ] Sistema de favoritos

---

**🎉 Parabéns! Seu dashboard está completo!**

Documentação relacionada:

- [ROADMAP_BACKEND.md](./ROADMAP_BACKEND.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API_INTEGRATION.md](./API_INTEGRATION.md)
