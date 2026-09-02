"use client";

import { useId } from "react";
import { RequiredMark } from "./required-mark";

interface LabeledFieldProps {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  children: (id: string) => React.ReactNode;
}

export function LabeledField({
  icon: Icon,
  label,
  required,
  children,
}: LabeledFieldProps) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-3.5 py-1.5 transition-colors focus-within:border-[#d9c9a3]/70">
      <label htmlFor={id} className="text-[10px] tracking-wide text-white/55">
        {label}
        {required && <RequiredMark />}
      </label>
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-[#d9c9a3]/80" />
        {children(id)}
      </span>
    </div>
  );
}
