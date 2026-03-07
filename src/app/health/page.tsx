"use client";

import { ethers } from "ethers";
import { format } from "date-fns";
import { useHealthCheck } from "@/hooks/useHealthCheck";

function getEthersStatus(): string {
  try {
    return ethers.version ? "ok" : "fail";
  } catch {
    return "fail";
  }
}

function getDateFnsStatus(): string {
  try {
    const result = format(new Date(), "yyyy-MM-dd");
    return result ? "ok" : "fail";
  } catch {
    return "fail";
  }
}

export default function HealthPage() {
  const { data, isLoading, isError } = useHealthCheck();

  const ethersStatus = getEthersStatus();
  const dateFnsStatus = getDateFnsStatus();
  const swrStatus = isLoading ? "loading..." : isError ? "fail" : "ok";

  const checks = [
    { label: "ethers ok?", value: ethersStatus },
    { label: "swr ok?", value: swrStatus },
    { label: "date-fns ok?", value: dateFnsStatus },
  ];

  return (
    <div className="min-h-screen bg-white p-8 font-mono dark:bg-black dark:text-white">
      <h1 className="mb-2 text-2xl font-bold">Health Check</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Data-layer baseline validation
      </p>

      <ul className="space-y-2">
        {checks.map(({ label, value }) => (
          <li key={label} className="flex items-center gap-3 text-base">
            <span
              className={
                value === "ok"
                  ? "text-green-600 dark:text-green-400"
                  : value === "loading..."
                    ? "text-yellow-500"
                    : "text-red-600 dark:text-red-400"
              }
            >
              {value === "ok" ? "✓" : value === "loading..." ? "…" : "✗"}
            </span>
            <span>{label}</span>
            <span className="text-gray-400">{value}</span>
          </li>
        ))}
      </ul>

      {data && (
        <p className="mt-8 text-xs text-gray-400">
          SWR checked at: {data.checkedAt}
        </p>
      )}
    </div>
  );
}
