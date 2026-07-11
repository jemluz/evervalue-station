import type { HealthCheckStatus, StatusUiConfig } from "@/types/health";

export const STATUS_UI: Record<HealthCheckStatus, StatusUiConfig> = {
  ok: {
    toneClassName: "text-green-600 dark:text-green-400",
    icon: "✓",
    srLabel: "status ok",
    displayText: "ok",
  },
  fail: {
    toneClassName: "text-red-600 dark:text-red-400",
    icon: "✗",
    srLabel: "status fail",
    displayText: "fail",
  },
  "not-in-use": {
    toneClassName: "text-gray-500 dark:text-gray-400",
    icon: "-",
    srLabel: "status not in use",
    displayText: "not in use",
  },
  loading: {
    toneClassName: "text-yellow-500",
    icon: "…",
    srLabel: "status loading",
    displayText: "loading...",
  },
};
