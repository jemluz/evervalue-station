import type { HealthCheckListItemProps } from "@/types/health";

export function HealthCheckListItem({
  label,
  statusUi,
}: HealthCheckListItemProps) {
  return (
    <li className="flex items-center gap-3 text-base">
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
}
