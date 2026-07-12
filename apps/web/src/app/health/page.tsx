"use client";

import { ethers } from "ethers";
import { HealthCheckListItem } from "@/components/health/HealthCheckListItem";
import { useHealthCheck } from "@/hooks/useHealthCheck";
import type { HealthCheckItem, HealthCheckStatus } from "@/types/health";
import { STATUS_UI } from "./constants";

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

          return <HealthCheckListItem key={label} label={label} statusUi={statusUi} />;
        })}
      </ul>

      <p className="mt-8 text-xs text-gray-400">
        Local fallback checked at: <span suppressHydrationWarning>{data.checkedAt}</span>
      </p>
    </div>
  );
}
