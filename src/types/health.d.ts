
export type HealthCheckStatus = "ok" | "fail" | "not-in-use" | "loading";

export interface HealthCheckItem {
  label: string;
  status: HealthCheckStatus;
}

export interface StatusUiConfig {
  toneClassName: string;
  icon: string;
  srLabel: string;
  displayText: string;
}

export interface HealthData {
  status: "ok";
  checkedAt: string;
}

export interface UseHealthCheckResult {
  data: HealthData;
  isLoading: boolean;
  isError: boolean;
}
