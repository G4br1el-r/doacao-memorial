"use client";

import { formatCents, onlyDigits } from "./utils/amount";

interface CustomAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomAmountField({ value, onChange }: CustomAmountFieldProps) {
  return (
    <>
      <span className="flex items-center rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-4 text-sm font-medium text-[#d9c9a3]">
        R$
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={formatCents(value)}
        onChange={(e) => onChange(onlyDigits(e.target.value))}
        placeholder="Digite outro valor"
        className="flex-1 rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-[#d9c9a3]/70 focus:outline-none"
      />
    </>
  );
}
