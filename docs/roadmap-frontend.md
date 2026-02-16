# 🎨 Frontend Roadmap - EVA Tokenomics Dashboard

This guide walks you step by step through implementing the user interface and visual experience of the project.

---

## 📚 Table of Contents

1. [Layout Setup](#1-layout-setup)
2. [Design System](#2-design-system)
3. [Base Components (UI)](#3-base-components-ui)
4. [Business Components](#4-business-components)
5. [Pages](#5-pages)
6. [Loading and Error States](#6-loading-and-error-states)
7. [Responsiveness](#7-responsiveness)
8. [Optimizations](#8-optimizations)

---

## 1️⃣ Layout Setup

### **1.1 Configure Tailwind CSS**

### **1.2 Configure Fonts**

### **1.3 Global Styles**

---

## 2️⃣ Design System

### **2.1 Create UI Types**

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

### **2.2 Create Icons (using Lucide React)**

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

## 3️⃣ Base Components (UI)

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

## 4️⃣ Business Components

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

## 5️⃣ Pages

### **5.1 Main Dashboard**

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

### **5.2 Main Page (App Router)**

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

## 6️⃣ Loading and Error States

### **6.1 Loading States Strategy**

Each section loads independently:

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

### **6.2 Error Boundaries (Optional)**

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

Use in the layout:

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

## 7️⃣ Responsiveness

### **7.1 Responsive Grid**

```typescript
// Breakpoints usados
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Mobile: 1 coluna */}
  {/* Tablet: 2 colunas */}
  {/* Desktop: 4 colunas */}
</div>
```

### **7.2 Test Responsiveness**

```bash
# Run dev server
npm run dev

# Test on:
# - Mobile (375px)
# - Tablet (768px)
# - Desktop (1280px)
```

---

## 8️⃣ Optimizations

### **8.1 Component Lazy Loading**

```typescript
// src/app/page.tsx
import dynamic from "next/dynamic";

const InvestmentCalculator = dynamic(
  () => import("@/components/Calculator/InvestmentCalculator"),
  { ssr: false },
);
```

### **8.2 Memoization**

```typescript
// Usar React.memo em componentes pesados
export const PriceCard = React.memo(PriceCardComponent);
```

### **8.3 Image Optimization**

If you add images:

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

## ✅ Frontend Checklist

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

## 🎯 Next Steps

### **Deploy on Vercel**

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

### **Future Improvements (V2)**

- [ ] Dark/Light mode toggle
- [ ] Price history chart (Chart.js or Recharts)
- [ ] Price notifications (Web Push)
- [ ] PWA (works offline)
- [ ] Export data (CSV/PDF)
- [ ] Compare with other tokens
- [ ] Favorites system

---

**🎉 Congrats! Your dashboard is complete!**

Related documentation:

- [ROADMAP_BACKEND.md](./roadmap-backend.md)
- [ARCHITECTURE.md](./architecture-new.md)
- [API_INTEGRATION.md](./api-integration.md)
