"use client";

import { cn } from "@/lib/utils/cn";

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export function OptionButton({
  active,
  onClick,
  className,
  children,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-lg border text-[13px] transition-colors",
        active
          ? "border-[#d9c9a3] bg-[#d9c9a3] font-semibold text-black"
          : "border-[#d9c9a3]/25 bg-white/8 text-white/80 hover:border-[#d9c9a3]/60",
        className,
      )}
    >
      {children}
    </button>
  );
}
