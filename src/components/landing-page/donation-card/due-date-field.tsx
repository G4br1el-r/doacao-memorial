import { CalendarDays } from "lucide-react";
import { CONTROL } from "@/components/ui/constants";
import { LabeledField } from "@/components/ui/labeled-field";

export function DueDateField() {
  return (
    <div className="flex sm:w-1/2">
      <LabeledField icon={CalendarDays} label="Data de vencimento" required>
        {(id) => (
          <input
            id={id}
            type="date"
            className={`${CONTROL} [color-scheme:dark]`}
          />
        )}
      </LabeledField>
    </div>
  );
}
