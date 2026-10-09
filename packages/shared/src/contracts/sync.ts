import z from "zod";
import { priceSchema } from "./price.js";
import { statusSchema } from "./status.js";

export const syncResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    prices: z.array(priceSchema),
    status: statusSchema,
  }),
  z.object({
    ok: z.literal(false),
    status: statusSchema,
    error: z.string().min(1),
  }),
]);

export type SyncResult = z.infer<typeof syncResultSchema>;
