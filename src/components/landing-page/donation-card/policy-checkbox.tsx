"use client";

import { motion } from "motion/react";
import { RequiredMark } from "@/components/ui/required-mark";
import { CARD_ITEM_VARIANTS } from "./card-variants";

interface PolicyCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PolicyCheckbox({ checked, onChange }: PolicyCheckboxProps) {
  return (
    <motion.label
      className="mt-1.5 flex min-h-11 cursor-pointer items-center gap-3 py-2.5 text-[12px] text-white/75"
      variants={CARD_ITEM_VARIANTS}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 cursor-pointer accent-[#d9c9a3]"
      />
      <span>
        Li e aceito as{" "}
        <a
          href="/politicas-de-privacidade"
          className="inline-block py-1 text-[#d9c9a3] underline underline-offset-2 hover:text-[#f0e2c0]"
        >
          Políticas de Privacidade
        </a>
        <RequiredMark />
      </span>
    </motion.label>
  );
}
