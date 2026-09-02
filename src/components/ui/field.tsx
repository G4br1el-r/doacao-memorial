"use client";

import { CONTROL, FRAME } from "./constants";

interface FieldProps {
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  inputMode?: "numeric" | "tel" | "email" | "text";
  maxLength?: number;
  autoComplete?: string;
}

export function Field({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
  inputMode,
  maxLength,
  autoComplete,
}: FieldProps) {
  return (
    <label className={FRAME}>
      <Icon className="h-4 w-4 shrink-0 text-[#d9c9a3]/80" />
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        placeholder={required ? `${placeholder} *` : placeholder}
        className={CONTROL}
      />
    </label>
  );
}
