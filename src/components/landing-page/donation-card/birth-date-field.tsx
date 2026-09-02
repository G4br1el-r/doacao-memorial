import { CalendarDays } from "lucide-react";
import { CONTROL } from "@/components/ui/constants";
import { LabeledField } from "@/components/ui/labeled-field";

export function BirthDateField() {
  return (
    <LabeledField icon={CalendarDays} label="Nascimento" required>
      {(id) => (
        <input
          id={id}
          type="date"
          autoComplete="bday"
          className={`${CONTROL} [color-scheme:dark]`}
        />
      )}
    </LabeledField>
  );
}
