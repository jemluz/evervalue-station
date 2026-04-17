# Feature Spec — evast-00046-health-coingecko-endpoints

## 1) Contexto

- Problema em 1 frase: A página `/health` ainda não valida os endpoints de preço do CoinGecko usados como base de dados de mercado (EVA e BTC), reduzindo confiança no estado real da integração.
- Usuário principal impactado: Pessoa desenvolvedora e mantenedora que usa a health page para validar rapidamente integrações externas.
- Relação com roadmap (P0/P1/P2): P0 ("Health page reflects real data-layer checks").

## 2) Escopo

### In

- Adicionar 2 itens de health check na página `/health`:
  - `coingecko / eva price`
  - `coingecko / btc price`
- Executar chamada real aos respectivos endpoints quando a página carregar.
- Exibir ciclo de status por item: `loading` -> `ok` ou `fail`.
- Em caso de `fail`, exibir mensagem de erro expandida abaixo do item (exemplo: `HTTP 429 - rate limit`).

### Out

- Exibir valores de preço retornados pelos endpoints (escopo é apenas status de disponibilidade/saúde).
- Implementar cache avançado, retry/backoff, circuit breaker ou observabilidade server-side.
- Alterar o layout geral da página `/health` além do necessário para suportar os novos checks e erro expandido.

## 3) Requisitos (traceáveis)

- EVAST-00046-REQ-001: O sistema deve incluir na `/health` dois novos checks identificados como `coingecko / eva price` e `coingecko / btc price`.
- EVAST-00046-REQ-002: Ao carregar a página, cada novo check deve iniciar em `loading` e transicionar para `ok` quando a chamada real ao endpoint correspondente responder com sucesso HTTP.
- EVAST-00046-REQ-003: Ao carregar a página, cada novo check deve iniciar em `loading` e transicionar para `fail` quando a chamada real ao endpoint correspondente falhar (erro HTTP, rede, CORS, timeout ou parsing).
- EVAST-00046-REQ-004: Quando um check estiver em `fail`, o sistema deve exibir mensagem de erro expandida abaixo do item com detalhe útil para diagnóstico humano.
- EVAST-00046-REQ-005: O comportamento dos checks existentes (`ethers ok?`, `swr active?`) deve permanecer inalterado após a inclusão dos novos checks.

## 4) Critérios de aceitação

- AC-001 (EVAST-00046-REQ-001): WHEN a página `/health` for renderizada THEN o sistema SHALL listar os dois itens adicionais `coingecko / eva price` e `coingecko / btc price`.
- AC-002 (EVAST-00046-REQ-002): WHEN a página `/health` carregar THEN cada novo item SHALL aparecer inicialmente como `loading` e, em resposta HTTP bem-sucedida, SHALL mudar para `ok`.
- AC-003 (EVAST-00046-REQ-003): WHEN uma chamada ao endpoint EVA ou BTC falhar THEN o item correspondente SHALL mudar para `fail`.
- AC-004 (EVAST-00046-REQ-004): WHEN um item estiver em `fail` THEN o sistema SHALL renderizar abaixo desse item uma mensagem expandida contendo o motivo da falha (exemplo `HTTP 429 - rate limit`).
- AC-005 (EVAST-00046-REQ-005): WHEN os novos checks forem adicionados THEN os checks legados SHALL continuar com os mesmos rótulos e comportamento atuais.

## 5) Dados e integrações

- Fontes externas envolvidas:
  - `https://api.coingecko.com/api/v3/simple/price?ids=evervalue-coin&vs_currencies=usd,brl,btc,sats`
  - `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,brl`
- Estratégia de fallback/erro:
  - Falha em qualquer endpoint marca apenas o check correspondente como `fail` (falha isolada por item).
  - Mensagem de erro deve priorizar legibilidade operacional (status HTTP e/ou descrição curta da exceção).
- Refresh esperado:
  - Chamadas são executadas no carregamento da página (sem requisito de polling contínuo nesta issue).

## 6) Observabilidade mínima

- O que validar manualmente:
  - Carregamento inicial mostra os checks em `loading`.
  - Cenário de sucesso muda para `ok` em cada endpoint.
  - Cenário de falha mostra `fail` + mensagem expandida no item correto.
  - Os checks legados continuam aparecendo normalmente.
- Logs/estados úteis:
  - Erro bruto por endpoint disponível no estado do hook para depuração local.
  - Mensagem de erro mapeada para UI (human-readable) por check.

## 7) Riscos e decisões abertas

- Risco principal: Limite de rate do CoinGecko (HTTP 429) gerar falso negativo frequente em ambiente de desenvolvimento.
- Decisão pendente: Definir se a mensagem expandida deve exibir o erro técnico completo ou uma versão sanitizada (mantendo ainda o detalhe útil solicitado).

## 8) Plano de execução (modo enxuto)

1. Estender os tipos de health check para suportar erro opcional por item e modelar checks assíncronos de CoinGecko.
2. Implementar hook/fluxo de chamada real no carregamento da `/health` com transições `loading -> ok|fail` por endpoint.
3. Atualizar renderização da lista para incluir os 2 novos itens e mensagem expandida abaixo do item em estado `fail`.

## 9) Definição de pronto

- [ ] Critérios de aceitação atendidos
- [ ] Lint ok
- [ ] Docs afetadas atualizadas
- [ ] Sem regressões visíveis no fluxo principal

## 10) Matriz de rastreabilidade

| Requirement ID      | Critério de Aceitação | Fase atual | Status    |
| ------------------- | --------------------- | ---------- | --------- |
| EVAST-00046-REQ-001 | AC-001                | Tasks      | In Tasks |
| EVAST-00046-REQ-002 | AC-002                | Tasks      | In Tasks |
| EVAST-00046-REQ-003 | AC-003                | Tasks      | In Tasks |
| EVAST-00046-REQ-004 | AC-004                | Tasks      | In Tasks |
| EVAST-00046-REQ-005 | AC-005                | Tasks      | In Tasks |

Cobertura: 5 requisitos totais, 5 com critérios de aceitação associados, 0 sem cobertura.
