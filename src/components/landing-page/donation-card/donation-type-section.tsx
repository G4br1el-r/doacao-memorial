"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { FREQUENCY_OPTIONS } from "./constants";
import { FrequencyOptionButton } from "./frequency-option-button";
import type { Frequency } from "./types";

interface DonationTypeSectionProps {
  frequency: Frequency;
  onFrequencyChange: (frequency: Frequency) => void;
  allowsRecurring: boolean;
}

export function DonationTypeSection({
  frequency,
  onFrequencyChange,
  allowsRecurring,
}: DonationTypeSectionProps) {
  return (
    <>
      <SectionLabel info>TIPO DA DOAÇÃO</SectionLabel>
      <div className="flex gap-3">
        {FREQUENCY_OPTIONS.map((option) => (
          <FrequencyOptionButton
            key={option.id}
            option={option}
            active={frequency === option.id}
            blocked={option.id === "mensal" && !allowsRecurring}
            onSelect={() => onFrequencyChange(option.id)}
          />
        ))}
      </div>
    </>
  );
}
