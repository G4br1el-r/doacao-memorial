"use client";

import { MotionConfig } from "motion/react";
import { CandleRitual } from "./candle-ritual";
import { DonationCard } from "./donation-card";
import { useDonationForm } from "./donation-card/hooks/use-donation-form";

interface DonationExperienceProps {
  children: React.ReactNode;
}

export function DonationExperience({ children }: DonationExperienceProps) {
  const form = useDonationForm();

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen overflow-hidden bg-black">
        {children}
        <DonationCard form={form} />
      </main>

      <CandleRitual
        open={form.ritualOpen}
        onClose={() => form.setRitualOpen(false)}
      />
    </MotionConfig>
  );
}
