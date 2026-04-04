import { AlertCircle, RefreshCcw } from "lucide-react";

import { useConversorContext } from "@/components/conversor/ConversorContext";

export function ConversorStatusBar() {
  const { isLoading, lastUpdated, error } = useConversorContext();

  return (
    <div className="mt-3 flex items-center justify-between rounded-[24px] border border-gray-100 bg-[#FAFAFA] px-4 py-3 text-xs font-medium text-gray-500">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <>
            <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> Atualizando
          </>
        ) : (
          <>
            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Atualizado {lastUpdated?.toTimeString().split(" ")[0]}
          </>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-red-500">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </div>
      )}
    </div>
  );
}
