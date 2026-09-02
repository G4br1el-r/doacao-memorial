"use client";

import { Heart } from "lucide-react";

interface SubmitButtonProps {
  amountLabel: string;
  onSubmit: () => void;
}

export function SubmitButton({ amountLabel, onSubmit }: SubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onSubmit}
      className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg bg-linear-to-r from-[#c9b184] via-[#f0e2c0] to-[#c9b184] py-3 text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Heart className="h-4 w-4 fill-current" />
      {amountLabel ? `DOAR ${amountLabel}` : "CONTRIBUIR AGORA"}
    </button>
  );
}
