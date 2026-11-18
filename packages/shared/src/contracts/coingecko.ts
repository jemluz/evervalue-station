// considering the response structure from the CoinGecko API for price request
// GET -> /simple/price?ids=evervalue-coin,bitcoin&vs_currencies=usd,brl,btc,sats

import { z } from "zod";

const priceSchema = z.object({
  brl: z.number(),
  btc: z.number(),
  sats: z.number(),
  usd: z.number(),
});

export const coingeckoPricePayloadSchema = z.object({
  bitcoin: priceSchema,
  "evervalue-coin": priceSchema,
});

export type CoingeckoPricePayload = z.infer<typeof coingeckoPricePayloadSchema>;

export const coingeckoPingPayloadSchema = z.object({
  gecko_says: z.string(),
});
