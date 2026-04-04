import type { LucideIcon } from "lucide-react";

interface CurrencyBadgeProps {
  val: number;
  icon: LucideIcon;
  color: string;
  prefix: string;
  dec: number;
}
export function CurrencyBadge({
  val,
  icon: Icon,
  color,
  prefix,
  dec,
}: CurrencyBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm">
      <Icon className="h-4 w-4" color={color} />
      <span className="font-medium text-black">
        1 {prefix} = $
        {val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: dec,
        })}
      </span>
    </div>
  );
}
