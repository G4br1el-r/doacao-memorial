"use client";

import { CONTROL, FRAME } from "./constants";
import { onEnterGoToNextField } from "./focus-next";

interface FieldProps {
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
  spellCheck?: boolean;
  enterKeyHint?: React.HTMLAttributes<HTMLInputElement>["enterKeyHint"];
}

export function Field({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
  inputMode = "text",
  maxLength,
  autoComplete,
  autoCapitalize,
  autoCorrect,
  spellCheck,
  enterKeyHint = "next",
}: FieldProps) {
  return (
    <label className={FRAME}>
      <Icon className="h-4 w-4 shrink-0 text-[#d9c9a3]/80" />
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        spellCheck={spellCheck}
        enterKeyHint={enterKeyHint}
        onKeyDown={onEnterGoToNextField}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        placeholder={required ? `${placeholder} *` : placeholder}
        className={CONTROL}
      />
    </label>
  );
}
