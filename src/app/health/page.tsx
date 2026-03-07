"use client";

import { ethers } from "ethers";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import type {
  HealthCheckItem,
  HealthCheckStatus,
  StatusUiConfig,
} from "@/types/health";

const STATUS_UI: Record<HealthCheckStatus, StatusUiConfig> = {
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

function getEthersStatus(): HealthCheckStatus {
  try {
    return ethers.version ? "ok" : "fail";
  } catch {
    return "fail";
  }
}

export default function HealthPage() {
  const { data } = useHealthCheck();

  const ethersStatus = getEthersStatus();
  const swrStatus: HealthCheckStatus = "not-in-use";

  const checks: HealthCheckItem[] = [
    { label: "ethers ok?", status: ethersStatus },
    { label: "swr active?", status: swrStatus },
  ];

  return (
    <div className="min-h-screen bg-white p-8 font-mono dark:bg-black dark:text-white">
      <h1 className="mb-2 text-2xl font-bold">Health Check</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Data-layer baseline validation
      </p>

      <ul className="space-y-2">
        {checks.map(({ label, status }) => {
          const statusUi = STATUS_UI[status];

          return (
            <li key={label} className="flex items-center gap-3 text-base">
              <span
                className={statusUi.toneClassName}
                role="img"
                aria-label={statusUi.srLabel}
              >
                {statusUi.icon}
              </span>
              <span>{label}</span>
              <span className="text-gray-400">{statusUi.displayText}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-xs text-gray-400">
        Local fallback checked at: <span suppressHydrationWarning>{data.checkedAt}</span>
      </p>
    </div>
  );
}
