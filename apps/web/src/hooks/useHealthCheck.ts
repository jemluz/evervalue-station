import { useMemo } from "react";
import type { HealthData, UseHealthCheckResult } from "@/types/health";

/*
 * SWR is temporarily disabled until this hook calls a real endpoint.
 * import useSWR from "swr";
 *
 * const fetcher = async (): Promise<HealthData> => {
 *   const res = await fetch("/api/health");
 *   if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *   return res.json();
 * };
 *
 * const { data, error, isLoading } = useSWR<HealthData>(
 *   "health-check",
 *   fetcher,
 * );
 *
 * Real-world SWR errors happen when fetcher throws/rejects, for example:
 * - Network failure (Failed to fetch, offline, DNS, timeout)
 * - Backend unavailable (5xx)
 * - Invalid endpoint (404) when handled as an error
 * - Unauthorized/forbidden (401/403) when handled as an error
 * - Response parsing failure (res.json() throws)
 * - CORS blocked by the browser
 *
 * Important: fetch does not throw on HTTP 4xx/5xx by default.
 *
 * const res = await fetch("/api/health");
 * if (!res.ok) throw new Error(`HTTP ${res.status}`);
 * return res.json();
 *
 * Without the above check, a 500 response would not throw and SWR would consider it a successful fetch.
 *
 * Extra useful: SWR can have data and error at the same time
 * (cached data + revalidation error).
 */

const buildMockHealthData = (): HealthData => ({
  status: "ok",
  checkedAt: new Date().toISOString(),
});

export function useHealthCheck(): UseHealthCheckResult {
  // Keep a stable timestamp per hook lifecycle while SWR is disabled.
  const data = useMemo(() => buildMockHealthData(), []);

  const isLoading = false;
  const isError = false;

  return {
    data,
    isLoading,
    isError,
  };
}
