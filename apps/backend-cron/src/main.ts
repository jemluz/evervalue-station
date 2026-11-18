import { loadEnvironment } from "./config/env";

export {};

const environment = loadEnvironment();

console.info("backend-cron initialized", {
  coingeckoBaseUrl: environment.COINGECKO_BASE_URL,
  coingeckoTimeoutMs: environment.COINGECKO_TIMEOUT_MS,
  coingeckoRetryCount: environment.COINGECKO_RETRY_COUNT,
  coingeckoBackoffMs: environment.COINGECKO_BACKOFF_MS,
});
