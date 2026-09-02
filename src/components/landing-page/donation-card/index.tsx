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
    <div className="relative z-40 mx-auto w-full max-w-[510px] overflow-x-clip px-4 pt-12 pb-[calc(3rem+env(safe-area-inset-bottom))] xl:absolute xl:right-10 xl:top-1/2 xl:w-[440px] xl:max-w-none fhd:w-[560px] xl:-translate-y-1/2 xl:overflow-x-visible xl:p-0">
      <motion.div
        className="flex max-h-none flex-col xl:max-h-[92dvh]"
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
    </div>
  );
}
