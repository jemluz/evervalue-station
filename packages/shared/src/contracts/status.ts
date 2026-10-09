import { z } from "zod";

export const statusSchema = z.object({
  id: z.literal(1),
  isOnline: z.boolean(),
  latencyMs: z.number().int().nonnegative().nullable(),
  errorLog: z.string().nullable(),
  lastCheck: z.coerce.date(),
});

export type Status = z.infer<typeof statusSchema>;
