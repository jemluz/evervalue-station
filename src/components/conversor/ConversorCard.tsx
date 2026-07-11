import { FIELDS } from "@/lib/conversor";

import { ConversorActions } from "./ConversorActions";
import { ConversorField } from "./ConversorField";
import { ConversorStatusBar } from "./ConversorStatusBar";

export function ConversorCard() {
  return (
    <div className="rounded-[24px] border border-gray-100 bg-white p-3 shadow-2xl">
      <div className="relative space-y-1">
        {FIELDS.map((field, index) => (
          <ConversorField
            key={field.id}
            field={field}
            isLast={index === FIELDS.length - 1}
          />
        ))}
      </div>

      <ConversorActions />
      <ConversorStatusBar />
    </div>
  );
}
