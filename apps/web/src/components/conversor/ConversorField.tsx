import { AssetBadgeLink } from "@/components/conversor/AssetBadgeLink";
import { useConversorContext } from "@/components/conversor/ConversorContext";
import { ConversorFieldConnector } from "@/components/conversor/ConversorFieldConnector";
import { Input } from "@/components/ui/input";
import { sanitizeDecimalInput } from "@/lib/conversor";
import { cn } from "@/lib/utils";
import type { FieldDefinition } from "@/types/conversor";

interface ConversorFieldProps {
  field: FieldDefinition;
  isLast: boolean;
}
export function ConversorField({ field, isLast }: ConversorFieldProps) {
  const {
    values,
    usdValue,
    activeInput,
    onFieldFocus,
    onFieldBlur,
    onFieldChange,
  } = useConversorContext();

  const value = values[field.id];
  const isActive = activeInput === field.id;

  return (
    <div className="group relative">
      <div
        className={cn(
          "rounded-[16px] border bg-[#FAFAFA] px-5 py-3 transition-all",
          isActive
            ? "relative z-20 border-gray-200 bg-white ring-1 ring-gray-200 shadow-sm"
            : "border-transparent hover:border-gray-200",
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              value={value}
              onFocus={() => onFieldFocus(field.id)}
              onBlur={onFieldBlur}
              onChange={(e) => {
                const raw = sanitizeDecimalInput(e.target.value);
                if (raw !== null) onFieldChange(field.id, raw);
              }}
              className="h-auto border-0 bg-transparent p-0 text-2xl font-semibold text-black shadow-none focus-visible:ring-0"
            />
            <div className="mt-1 text-sm text-gray-500">
              ≈ $
              {usdValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          <AssetBadgeLink
            icon={field.icon}
            symbol={field.symbol}
            href={field.href}
            ariaLabel={`Open ${field.label} on CoinGecko`}
          />
        </div>
      </div>
      {!isLast && <ConversorFieldConnector />}
    </div>
  );
}
