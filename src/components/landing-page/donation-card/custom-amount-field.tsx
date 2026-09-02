"use client";

import { onEnterGoToNextField } from "@/components/ui/focus-next";
import { formatCents, onlyDigits } from "./utils/amount";

interface CustomAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomAmountField({ value, onChange }: CustomAmountFieldProps) {
  return (
    <>
      <span className="flex shrink-0 items-center rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-4 text-sm font-medium text-[#d9c9a3]">
        R$
      </span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        onKeyDown={onEnterGoToNextField}
        value={formatCents(value)}
        onChange={(e) => onChange(onlyDigits(e.target.value))}
        placeholder="Digite outro valor"
        className="min-w-0 flex-1 rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-3.5 py-2 text-base text-white placeholder:text-white/45 focus:border-[#d9c9a3]/70 focus:outline-none"
      />
    </>
  );
}
