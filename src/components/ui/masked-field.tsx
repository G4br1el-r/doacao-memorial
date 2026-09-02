"use client";

import { useId } from "react";
import { IMaskInput } from "react-imask";
import { CONTROL, FRAME } from "./constants";
import { onEnterGoToNextField } from "./focus-next";

interface MaskedFieldProps {
  icon: React.ElementType;
  placeholder: string;
  mask: string | { mask: string; maxLength?: number }[];
  type?: string;
  value: string;
  onAccept: (value: string) => void;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  trailing?: React.ReactNode;
  enterKeyHint?: React.HTMLAttributes<HTMLInputElement>["enterKeyHint"];
}

export function MaskedField({
  icon: Icon,
  placeholder,
  mask,
  type = "text",
  value,
  onAccept,
  required,
  inputMode = "text",
  autoComplete,
  trailing,
  enterKeyHint = "next",
}: MaskedFieldProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={FRAME}>
      <Icon className="h-4 w-4 shrink-0 text-[#d9c9a3]/80" />
      <IMaskInput
        id={id}
        mask={mask as unknown as string}
        value={value}
        onAccept={onAccept}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint={enterKeyHint}
        onKeyDown={onEnterGoToNextField}
        placeholder={required ? `${placeholder} *` : placeholder}
        className={CONTROL}
      />
      {trailing}
    </label>
  );
}
