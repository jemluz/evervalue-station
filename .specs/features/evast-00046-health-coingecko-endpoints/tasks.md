# EVAST-00046 Tasks

**Design**: `.specs/features/evast-00046-health-coingecko-endpoints/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1: Foundation (Sequential)

Estrutura de tipos usada pelos demais passos.

```text
T1
```

### Phase 2: Core Implementation (Parallel OK)

Após T1, implementação de lógica e renderização podem ocorrer em paralelo.

```text
T1 ─┬→ T2 [P]
    └→ T3 [P]
```

### Phase 3: Integration (Sequential)

Composição final na página `/health` e validação manual/lint.

```text
T2 + T3 → T4
```

---

## Task Breakdown

### T1: Expandir tipos de health check

**What**: Atualizar contratos de tipos para suportar checks CoinGecko com erro opcional por item.
**Where**: `src/types/health.d.ts`
**Depends on**: None
**Reuses**: Tipos existentes `HealthCheckStatus`, `StatusUiConfig`, `HealthData`
**Requirement**: EVAST-00046-REQ-001, EVAST-00046-REQ-004

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `HealthCheckItem` aceita `errorMessage?`
- [ ] Contrato de retorno de `useHealthCheck` inclui checks para consumo da página
- [ ] Tipos continuam compatíveis com `STATUS_UI` e `HealthCheckListItem`

**Tests**: none
**Gate**: quick (`npm run lint`)

---

### T2: Implementar checks CoinGecko no hook [P]

**What**: Implementar no hook o fluxo real de chamada para EVA e BTC com transições `loading -> ok|fail` e mensagens de erro operacionais.
**Where**: `src/hooks/useHealthCheck.ts`
**Depends on**: T1
**Reuses**: Estrutura atual de timestamp local (`checkedAt`) e padrão de validação `response.ok`
**Requirement**: EVAST-00046-REQ-002, EVAST-00046-REQ-003, EVAST-00046-REQ-004

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Hook inicializa checks CoinGecko em `loading`
- [ ] Sucesso HTTP por endpoint atualiza somente o item correspondente para `ok`
- [ ] Falha HTTP/rede/parse atualiza somente o item correspondente para `fail`
- [ ] Mensagem expandida é mapeada por endpoint falho
- [ ] Gate check passa: `npm run lint`

**Tests**: none
**Gate**: quick (`npm run lint`)

---

### T3: Renderização de erro expandido no item [P]

**What**: Estender componente de item para exibir mensagem de erro abaixo da linha principal quando status for `fail`.
**Where**: `src/components/health/HealthCheckListItem.tsx`
**Depends on**: T1
**Reuses**: Estrutura visual existente (`ícone + label + status`) e `StatusUiConfig`
**Requirement**: EVAST-00046-REQ-004

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Item mantém layout atual para estados sem erro
- [ ] Quando `errorMessage` existir e status for `fail`, mensagem é renderizada abaixo do item
- [ ] O texto de erro é legível e não quebra o layout da lista
- [ ] Gate check passa: `npm run lint`

**Tests**: none
**Gate**: quick (`npm run lint`)

---

### T4: Integrar checks CoinGecko na página health

**What**: Atualizar composição da página para combinar checks legados com checks CoinGecko retornados pelo hook, mantendo comportamento legado inalterado.
**Where**: `src/app/health/page.tsx`
**Depends on**: T2, T3
**Reuses**: `getEthersStatus`, `STATUS_UI`, estrutura atual da página `/health`
**Requirement**: EVAST-00046-REQ-001, EVAST-00046-REQ-005

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Lista `/health` mostra `coingecko / eva price` e `coingecko / btc price`
- [ ] Checks legados (`ethers ok?`, `swr active?`) preservam comportamento atual
- [ ] Estados `loading`, `ok`, `fail` dos checks CoinGecko aparecem na UI conforme hook
- [ ] Mensagem expandida de erro aparece no item correto em `fail`
- [ ] Validação manual dos AC-001..AC-005 realizada
- [ ] Gate check passa: `npm run lint`

**Tests**: none
**Gate**: quick (`npm run lint`)

---

## Parallel Execution Map

```text
Phase 1 (Sequential)
  T1

Phase 2 (Parallel)
  After T1:
    - T2 [P]
    - T3 [P]

Phase 3 (Sequential)
  After T2 and T3:
    - T4
```

**Parallelism constraint check**:

- T2 [P]: sem dependência de T3, sem teste automatizado bloqueante, arquivo isolado.
- T3 [P]: sem dependência de T2, sem teste automatizado bloqueante, arquivo isolado.
- T4: consolidado como sequencial para integrar outputs de T2/T3 e reduzir risco de regressão visual.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Expandir tipos de health check | 1 arquivo de tipos | ✅ Granular |
| T2: Implementar checks CoinGecko no hook | 1 hook | ✅ Granular |
| T3: Renderização de erro expandido no item | 1 componente | ✅ Granular |
| T4: Integrar checks CoinGecko na página health | 1 página | ✅ Granular |

Resultado: todas as tarefas são atômicas (1 deliverable principal por tarefa).

---

## Diagram-Definition Cross-Check

| Task | Depends on (Task Body) | Depends on (Execution Diagram) | Match |
| ---- | ---------------------- | ------------------------------ | ----- |
| T1 | None | Start | ✅ |
| T2 | T1 | T1 → T2 [P] | ✅ |
| T3 | T1 | T1 → T3 [P] | ✅ |
| T4 | T2, T3 | T2 + T3 → T4 | ✅ |

Resultado: diagrama e definições estão consistentes.

---

## Test Co-location Validation

Referência: `.specs/codebase/TESTING.md` indica ausência de framework de testes automatizados e gate ativo via lint.

| Task | Código alterado | Tipo exigido pela matriz atual | Tests field | Gate field | Match |
| ---- | --------------- | ------------------------------- | ----------- | ---------- | ----- |
| T1 | types | none | none | quick | ✅ |
| T2 | hook | none | none | quick | ✅ |
| T3 | component | none | none | quick | ✅ |
| T4 | page integration | none | none | quick | ✅ |

Resultado: co-location válida para o estado atual do projeto (sem suíte automatizada configurada).

---

## Requirement Traceability (Tasks)

| Requirement ID | Covered by Tasks |
| -------------- | ---------------- |
| EVAST-00046-REQ-001 | T1, T4 |
| EVAST-00046-REQ-002 | T2, T4 |
| EVAST-00046-REQ-003 | T2, T4 |
| EVAST-00046-REQ-004 | T1, T2, T3, T4 |
| EVAST-00046-REQ-005 | T4 |

Cobertura: 5/5 requisitos mapeados em tarefas.

---

## Pre-Execute Tool Selection (required before Execute)

Para a fase Execute, confirmar por tarefa quais ferramentas devo usar.

- Available MCPs: não identificados no workspace atual para este fluxo
- Available Skills: `tlc-spec-driven`, `codenavi`, `mermaid-studio`, `agent-customization`, `get-search-view-results`
- Proposta inicial:
  - T1: built-in edit tools
  - T2: built-in edit tools
  - T3: built-in edit tools
  - T4: built-in edit tools + lint em terminal
