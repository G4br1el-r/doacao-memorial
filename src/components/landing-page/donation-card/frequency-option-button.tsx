"use client";

import { Heart, Repeat } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { RECURRING_BLOCKED_NOTE } from "./constants";
import type { FrequencyOption } from "./types";

interface FrequencyOptionButtonProps {
  option: FrequencyOption;
  active: boolean;
  blocked: boolean;
  onSelect: () => void;
}

export function FrequencyOptionButton({
  option,
  active,
  blocked,
  onSelect,
}: FrequencyOptionButtonProps) {
  const Icon = option.id === "mensal" ? Repeat : Heart;

  return (
    <button
      type="button"
      disabled={blocked}
      onClick={onSelect}
      className={cn(
        "flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:gap-3 sm:px-3.5",
        active
          ? "border-[#d9c9a3]/80 bg-[#d9c9a3]/10"
          : "border-[#d9c9a3]/25 bg-black/40 hover:border-[#d9c9a3]/50",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          option.id === "unica" && active && "fill-[#d9c9a3]",
          active ? "text-[#d9c9a3]" : "text-[#d9c9a3]/70",
        )}
      />
      <span className="min-w-0">
        <span className="block text-sm text-white">{option.label}</span>
        <span className="block text-[10px] leading-tight text-white/60">
          {blocked ? RECURRING_BLOCKED_NOTE : option.note}
        </span>
      </span>
    </button>
  );
}
