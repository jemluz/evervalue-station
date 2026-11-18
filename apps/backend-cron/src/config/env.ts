import { type } from "node:os";
import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  COINGECKO_BASE_URL: z
    .string()
    .url()
    .default("https://api.coingecko.com/api/v3"),
  COINGECKO_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  COINGECKO_RETRY_COUNT: z.coerce.number().int().min(0).max(10).default(3),
  COINGECKO_BACKOFF_MS: z.coerce.number().int().positive().default(500),
});

export type Environment = z.infer<typeof environmentSchema>;

export function loadEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): Environment {
  return environmentSchema.parse(source);
}
