Coingecko will return `sats` as a unit of measure for Bitcoin (where 1 BTC = 100,000,000 SATS) and will also try to convert EVA to SATS.

To guarantee **absolute fidelity**, your database update code (Upsert) must handle the response like this:

```typescript
// Example of response JSON mapping
{
  "bitcoin": {
    "usd": 65000,
    "brl": 350000,
    "sats": 100000000 // Fixed reference value
  },
  "evervalue-coin": {
    "usd": 34.86,
    "brl": 188.20,
    "btc": 0.000536,
    "sats": 53600 // EVA value in Satoshis
  }
}
```
