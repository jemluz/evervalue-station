### Por que PostgreSQL?

1. **Integridade de Dados**: Como você lidará com conversões financeiras (BTC, EVA, BRL), a consistência do banco relacional garante que os cálculos entre tabelas sejam precisos.
2. **Performance para Séries Temporais**: Se no futuro você quiser exibir gráficos de variação de preço, o Postgres lida muito bem com grandes volumes de dados temporais (especialmente com extensões como TimescaleDB).
3. **Ecossistema Node.js**: A integração com ORMs como Prisma ou TypeORM é excelente.

---

Esta URL solicita os dados de ambos os ativos e todas as conversões em uma única transação, otimizando o seu cronjob de 5 minutos:

`https://api.coingecko.com/api/v3/simple/price?ids=evervalue-coin,bitcoin&vs_currencies=usd,brl,btc,sats`

---


### 🗄️ Tabela `Price`

**Model**
Esta tabela armazena os valores de mercado. O uso de **Decimal** é mandatório para evitar erros de arredondamento comuns em tipos flutuantes.

| Campo          | Tipo Lógico     | Restrição        | Descrição                                            |
| :------------- | :-------------- | :--------------- | :--------------------------------------------------- |
| **symbol**     | String/Texto    | Unique, Not Null | Identificador do ativo (ex: "BTC", "EVA").           |
| **usd**        | Decimal (20, 8) | Not Null         | Preço do ativo em Dólar Americano.                   |
| **brl**        | Decimal (20, 8) | Not Null         | Preço do ativo em Real Brasileiro.                   |
| **btc**        | Decimal (20, 8) | Not Null         | Preço do ativo em Bitcoin (Para o BTC, o valor é 1). |
| **sats**       | BigInt/Decimal  | Not Null         | Valor do ativo em Satoshis.                          |
| **updated_at** | Timestamp       | Not Null         | Data e hora da última atualização do Cronjob.        |

**Exemplo**

| symbol  | usd      | brl       | btc        | sats      | updated_at     |
| :------ | :------- | :-------- | :--------- | :-------- | :------------- |
| **BTC** | 65000.00 | 350000.00 | 1.00000000 | 100000000 | 2026-06-12T... |
| **EVA** | 34.86    | 188.20    | 0.00053600 | 53600     | 2026-06-12T... |

---
### 🗄️ Tabela `Status`

Esta tabela funciona com apenas um registro com ID fixo, representando o "pulso" atual da integração externa.

- **Performance**: O Backend I faz uma consulta extremamente simples: `SELECT * FROM api_status WHERE id = 1`. É uma leitura instantânea (O(1)).
- **Simplicidade no Frontend**: Você não precisa lidar com arrays ou filtros de data no seu código frontend para saber se o sistema está online. Basta ler o objeto único que o Backend I retornar.
- **Economia de Armazenamento**: Se você salvasse um log a cada 5 minutos, em um ano teria mais de 100.000 linhas apenas de "pings". Como o objetivo é apenas exibir o status atual no site, uma linha é o suficiente.

**Model**

| Campo          | Tipo Lógico | Restrição   | Descrição                                                  |
| :------------- | :---------- | :---------- | :--------------------------------------------------------- |
| **id**         | Integer     | Primary Key | ID fixo (ex: 1) para garantir registro único.              |
| **is_online**  | Boolean     | Not Null    | `true` se a API respondeu ao ping; `false` caso contrário. |
| **latency_ms** | Integer     | Nullable    | Tempo de resposta da API em milissegundos.                 |
| **error_log**  | Text/String | Nullable    | Descrição técnica do erro (ex: "404", "Timeout").          |
| **last_check** | Timestamp   | Not Null    | Data e hora da última verificação realizada.               |

**Exemplo**

| id  | is_online | latency_ms | error_log | last_check          |
| :-- | :-------- | :--------- | :-------- | :------------------ |
| 1   | true      | 145        | null      | 2026-06-12 14:30:00 |

ou em caso de falha:

| id  | is_online | latency_ms | error_log | last_check          |
| :-- | :-------- | :--------- | :-------- | :------------------ |
| 1   | false     | 30000      | Timeout   | 2026-06-12 14:38:00 |
