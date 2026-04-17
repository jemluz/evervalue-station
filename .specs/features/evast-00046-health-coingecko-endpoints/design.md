# EVAST-00046 Design

**Spec**: `.specs/features/evast-00046-health-coingecko-endpoints/spec.md`
**Status**: Approved

---

## Architecture Overview

A solução mantém o padrão atual de página cliente + hook de lógica e adiciona um fluxo assíncrono isolado por endpoint do CoinGecko.

Fluxo proposto:

1. A página `/health` renderiza checks legados (`ethers`, `swr`) e novos checks (`coingecko / eva price`, `coingecko / btc price`).
2. Os checks CoinGecko iniciam em `loading`.
3. O hook dispara chamadas HTTP reais no `mount` (uma por endpoint).
4. Cada resposta atualiza apenas o seu check para `ok` ou `fail`.
5. Em `fail`, o estado guarda mensagem expandida para exibição abaixo do item.

Sem nova camada de API route nesta issue: chamadas diretas de cliente para os endpoints de referência do CoinGecko, compatível com o estado atual do projeto (health page de diagnóstico local).

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component             | Location                                        | How to Use                                                              |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| `HealthPage`          | `src/app/health/page.tsx`                       | Estender composição da lista de checks sem alterar comportamento legado |
| `useHealthCheck`      | `src/hooks/useHealthCheck.ts`                   | Evoluir de mock-only para orquestração de checks assíncronos CoinGecko  |
| `HealthCheckListItem` | `src/components/health/HealthCheckListItem.tsx` | Reutilizar render base e expandir para mensagem de erro opcional        |
| `STATUS_UI`           | `src/app/health/constants.ts`                   | Reutilizar mapeamento visual dos estados (`loading`, `ok`, `fail`)      |
| `HealthCheckStatus`   | `src/types/health.d.ts`                         | Reutilizar enum de status existente para novos checks                   |

### Integration Points

| System                 | Integration Method                                         |
| ---------------------- | ---------------------------------------------------------- |
| CoinGecko EVA endpoint | `fetch` client-side no hook com validação de `response.ok` |
| CoinGecko BTC endpoint | `fetch` client-side no hook com validação de `response.ok` |

---

## Components

### Health Check Domain Types

- **Purpose**: Modelar checks com estado e erro por item para suportar transição assíncrona por endpoint.
- **Location**: `src/types/health.d.ts`
- **Interfaces**:
  - `interface HealthCheckItem { label: string; status: HealthCheckStatus; errorMessage?: string }`
  - `interface CoinGeckoCheckConfig { key: "eva" | "btc"; label: string; url: string }`
  - `interface UseHealthCheckResult { data: HealthData; checks: HealthCheckItem[] }`
- **Dependencies**: Tipos existentes `HealthData`, `HealthCheckStatus`.
- **Reuses**: Contrato atual de status (`ok` | `fail` | `not-in-use` | `loading`).

### useHealthCheck (extended)

- **Purpose**: Orquestrar estado dos checks CoinGecko e manter timestamp de verificação local.
- **Location**: `src/hooks/useHealthCheck.ts`
- **Interfaces**:
  - `useHealthCheck(): UseHealthCheckResult`
  - `runCoinGeckoCheck(config: CoinGeckoCheckConfig): Promise<{ status: "ok" } | { status: "fail"; errorMessage: string }>`
- **Dependencies**: `fetch`, `useEffect`, `useMemo`, `useState`.
- **Reuses**: Estrutura atual do hook e fallback `checkedAt`.

### HealthCheckListItem (extended)

- **Purpose**: Exibir linha de status e, quando houver falha, mensagem expandida abaixo da linha.
- **Location**: `src/components/health/HealthCheckListItem.tsx`
- **Interfaces**:
  - `HealthCheckListItemProps` recebe `label`, `statusUi` e `errorMessage?`.
- **Dependencies**: `StatusUiConfig`.
- **Reuses**: Layout atual da linha (`ícone + label + status`).

### HealthPage (composition update)

- **Purpose**: Compor checks legados + checks CoinGecko oriundos do hook, mantendo a ordem estável da lista.
- **Location**: `src/app/health/page.tsx`
- **Interfaces**:
  - Sem novos props; apenas mudança de composição interna.
- **Dependencies**: `useHealthCheck`, `STATUS_UI`, `ethers`.
- **Reuses**: Função `getEthersStatus` e bloco visual atual da página.

---

## Data Models

### HealthCheckItem (updated)

```typescript
interface HealthCheckItem {
  label: string;
  status: "ok" | "fail" | "not-in-use" | "loading";
  errorMessage?: string;
}
```

**Relationships**:

- `HealthPage` consome array de `HealthCheckItem` para renderização.
- `HealthCheckListItem` renderiza `errorMessage` quando `status === "fail"`.

### CoinGeckoCheckConfig (new)

```typescript
interface CoinGeckoCheckConfig {
  key: "eva" | "btc";
  label: string;
  url: string;
}
```

**Relationships**:

- `useHealthCheck` usa esta configuração para inicializar e processar checks.

### CoinGeckoCheckState (derived runtime)

```typescript
interface CoinGeckoCheckState {
  key: "eva" | "btc";
  status: "loading" | "ok" | "fail";
  errorMessage?: string;
}
```

**Relationships**:

- Estado interno do hook, convertido em `HealthCheckItem` para a UI.

---

## Error Handling Strategy

| Error Scenario              | Handling                                                         | User Impact                                        |
| --------------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| HTTP não-2xx (ex.: 429)     | Lançar erro com `HTTP {status}` + `statusText` quando disponível | Item específico mostra `fail` + mensagem expandida |
| Falha de rede/CORS          | Capturar exceção de `fetch` e mapear mensagem amigável           | Item específico mostra `fail` + mensagem expandida |
| Parsing/JSON inválido       | Capturar erro de parse e mapear como falha de resposta           | Item específico mostra `fail` + mensagem expandida |
| Falha de um endpoint apenas | Isolar atualização por check                                     | Outro endpoint pode continuar em `ok`              |

Princípio: falha parcial não deve derrubar a página nem bloquear os checks legados.

---

## Tech Decisions (non-obvious)

| Decision              | Choice                            | Rationale                                                                          |
| --------------------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| Onde chamar CoinGecko | Cliente (`useHealthCheck`)        | Escopo da health page é diagnóstico em runtime do frontend e já é rota client-side |
| Atualização de estado | Estado independente por endpoint  | Garante isolamento de falhas e aderência a REQ-003/REQ-004                         |
| Tratamento de erro    | Mensagem sanitizada e operacional | Atende clareza para debug sem expor stack traces verbosos                          |
| Estratégia de refresh | Apenas no page load               | Está explícito no escopo da issue; evita complexidade prematura                    |

---

## Requirement Coverage Map

| Requirement ID      | Design Coverage                                                     |
| ------------------- | ------------------------------------------------------------------- |
| EVAST-00046-REQ-001 | Composição de lista em `HealthPage` com dois novos checks CoinGecko |
| EVAST-00046-REQ-002 | Inicialização `loading` e transição para `ok` no hook               |
| EVAST-00046-REQ-003 | Transição para `fail` por endpoint com captura de erro              |
| EVAST-00046-REQ-004 | `HealthCheckListItem` estendido com bloco de erro expandido         |
| EVAST-00046-REQ-005 | Checks legados preservados sem alteração comportamental             |

---

## Risks and Mitigations

- Risco: Rate limit (429) pode gerar falhas frequentes em dev.
  - Mitigação: Mensagem explícita por endpoint e isolamento de falha parcial.
- Risco: CORS/intermitência pode variar por ambiente.
  - Mitigação: Tratamento robusto de exceção e UI resiliente sem quebrar layout.

---

## Ready for Tasks

Design pronto para fase Tasks/Execute com mudanças concentradas em:

1. `src/types/health.d.ts`
2. `src/hooks/useHealthCheck.ts`
3. `src/components/health/HealthCheckListItem.tsx`
4. `src/app/health/page.tsx`
