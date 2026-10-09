import { z } from "zod";

export const priceSymbolSchema = z.enum(["BTC", "EVA"]);

export const priceSchema = z.object({
  symbol: priceSymbolSchema,
  brl: z.number(),
  btc: z.number(),
  sats: z.number(),
  usd: z.number(),
  updatedAt: z.coerce.date(),
});

export type Price = z.infer<typeof priceSchema>;

export const BITCOIN_SATS = 100_000_000;
