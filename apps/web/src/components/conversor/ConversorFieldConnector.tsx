import { ArrowDownUp } from "lucide-react";
export function ConversorFieldConnector() {
  return (
    <div className="absolute -bottom-3.5 left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border bg-white shadow-sm">
      <ArrowDownUp className="h-3.5 w-3.5 text-gray-400" />
    </div>
  );
}
