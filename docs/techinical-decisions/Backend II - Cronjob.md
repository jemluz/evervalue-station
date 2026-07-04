
O Coingecko retornará o `sats` como uma unidade de medida para o Bitcoin (onde 1 BTC = 100.000.000 SATS) e também tentará converter o EVA para SATS.

Para garantir a **fidelidade absoluta**, o seu código de atualização (Upsert) no banco de dados deve tratar o retorno assim:

```typescript
// Exemplo do mapeamento do JSON de retorno
{
  "bitcoin": {
    "usd": 65000,
    "brl": 350000,
    "sats": 100000000 // Valor fixo de referência
  },
  "evervalue-coin": {
    "usd": 34.86,
    "brl": 188.20,
    "btc": 0.000536,
    "sats": 53600 // Valor do EVA em Satoshis
  }
}
```
