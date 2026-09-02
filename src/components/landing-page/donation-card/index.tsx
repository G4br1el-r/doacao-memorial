"use client";

import { AnimatePresence, motion } from "motion/react";
import { ThankYou } from "@/components/landing-page/thank-you";
import { SMOOTH } from "@/lib/animation/easing";
import { DonationForm } from "./donation-form";
import type { useDonationForm } from "./hooks/use-donation-form";

interface DonationCardProps {
  form: ReturnType<typeof useDonationForm>;
}

export function DonationCard({ form }: DonationCardProps) {
  return (
    <motion.div
      className="absolute right-10 top-1/2 z-40 flex max-h-[92vh] w-[510px] -translate-y-1/2 flex-col"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: form.ritualOpen ? 0 : 1, x: 0 }}
      inert={form.ritualOpen}
      transition={{ duration: 1.4, delay: 0.8, ease: SMOOTH }}
    >
      <AnimatePresence mode="wait">
        {form.step === "formulario" ? (
          <DonationForm key="formulario" form={form} />
        ) : (
          <ThankYou
            key="obrigado"
            name={form.name}
            amount={form.amountLabel}
            alreadyConfirmed={form.donationConfirmed}
            onConfirmed={() => form.setDonationConfirmed(true)}
            onLightCandle={() => {
              form.setRitualOpen(true);
              form.reset();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
