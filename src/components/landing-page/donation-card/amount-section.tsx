"use client";

import { Collapse } from "@/components/animation/collapse";
import { OptionButton } from "@/components/ui/option-button";
import { SectionLabel } from "@/components/ui/section-label";
import { AMOUNTS } from "./constants";
import { CustomAmountField } from "./custom-amount-field";
import type { Amount } from "./types";

interface AmountSectionProps {
  amount: Amount;
  onAmountChange: (amount: Amount) => void;
  customAmount: string;
  onCustomAmountChange: (value: string) => void;
}

export function AmountSection({
  amount,
  onAmountChange,
  customAmount,
  onCustomAmountChange,
}: AmountSectionProps) {
  return (
    <>
      <SectionLabel>SUA CONTRIBUIÇÃO</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {AMOUNTS.map((value) => (
          <OptionButton
            key={value}
            active={amount === value}
            onClick={() => onAmountChange(value)}
            className="py-2"
          >
            R$ {value},00
          </OptionButton>
        ))}
        <OptionButton
          active={amount === "outro"}
          onClick={() => onAmountChange("outro")}
          className="py-2"
        >
          Outro
        </OptionButton>
      </div>

      <Collapse
        open={amount === "outro"}
        className="flex items-stretch gap-3 overflow-hidden"
      >
        <CustomAmountField
          value={customAmount}
          onChange={onCustomAmountChange}
        />
      </Collapse>
    </>
  );
}
