import type { ReactNode } from "react";

// Base aliases ---------------------------------------------------------------------
export type HealthCheckStatus = "ok" | "fail" | "not-in-use" | "loading";
export type CoinGeckoEndpointKey = "evaPrice" | "btcPrice";

// Backend contract ------------------------------------------------------------------
export interface HealthData {
  status: "ok";
  checkedAt: string;
}

// Domain state ----------------------------------------------------------------------
export type EndpointHealthCheckState =
  | { status: "loading" }
  | { status: "ok" }
  | {
      status: "fail";
      errorMessage: string;
      rawError?: string;
    };

export interface HealthCheckItem {
  label: string;
  status: HealthCheckStatus;
  errorMessage?: string;
  children?: readonly HealthCheckItem[];
}

// UI contracts ----------------------------------------------------------------------
export interface StatusUiConfig {
  toneClassName: string;
  icon: string;
  srLabel: string;
  displayText: string;
}

export interface HealthCheckListItemProps {
  label: string;
  statusUi: StatusUiConfig;
  errorMessage?: string;
  depth?: number;
  children?: ReactNode;
}

// Hook return contract ---------------------------------------------------------------
export interface UseHealthCheckResult {
  data: HealthData;
  isLoading: boolean;
  isError: boolean;
  coinGeckoStatusByEndpoint: Record<
    CoinGeckoEndpointKey,
    EndpointHealthCheckState
  >;
}
