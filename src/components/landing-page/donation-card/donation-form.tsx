"use client";

import { motion } from "motion/react";
import { SMOOTH } from "@/lib/animation/easing";
import { AddressSection } from "./address-section";
import { AmountSection } from "./amount-section";
import { CardSection } from "./card-section";
import { CARD_CONTAINER_VARIANTS } from "./card-variants";
import { DonationTypeSection } from "./donation-type-section";
import { FormHeader } from "./form-header";
import type { useDonationForm } from "./hooks/use-donation-form";
import { PaymentSection } from "./payment-section";
import { PersonalDataSection } from "./personal-data-section";
import { PolicyCheckbox } from "./policy-checkbox";
import { SecureNote } from "./secure-note";
import { SubmitButton } from "./submit-button";

interface DonationFormProps {
  form: ReturnType<typeof useDonationForm>;
}

export function DonationForm({ form }: DonationFormProps) {
  return (
    <motion.div
      data-field-flow
      className="flex min-h-0 flex-col overflow-visible rounded-2xl border border-[#d9c9a3]/20 bg-black/55 p-5 shadow-xl backdrop-blur-xl xl:overflow-y-auto xl:overscroll-contain [scrollbar-color:rgba(217,201,163,0.35)_transparent] [scrollbar-width:thin]"
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -16, transition: { duration: 0.5, ease: SMOOTH } }}
      variants={CARD_CONTAINER_VARIANTS}
    >
      <FormHeader />

      <CardSection className="mt-4">
        <PersonalDataSection
          name={form.name}
          onNameChange={form.setName}
          phone={form.phone}
          onPhoneChange={form.setPhone}
          document={form.document}
          onDocumentChange={form.setDocument}
        />
      </CardSection>

      <CardSection className="mt-4">
        <AddressSection
          address={form.address}
          onAddressChange={form.setAddress}
          postalCode={form.postalCode}
          onPostalCodeChange={form.onPostalCodeChange}
          isLookingUp={form.isLookingUp}
        />
      </CardSection>

      <CardSection className="mt-4">
        <DonationTypeSection
          frequency={form.frequency}
          onFrequencyChange={form.setFrequency}
          allowsRecurring={form.allowsRecurring}
        />
      </CardSection>

      <CardSection className="mt-4">
        <AmountSection
          amount={form.amount}
          onAmountChange={form.setAmount}
          customAmount={form.customAmount}
          onCustomAmountChange={form.setCustomAmount}
        />
      </CardSection>

      <CardSection className="mt-4">
        <PaymentSection
          payment={form.payment}
          onPaymentChange={form.selectPayment}
        />
      </CardSection>

      <PolicyCheckbox checked={form.accepted} onChange={form.setAccepted} />

      <SubmitButton
        amountLabel={form.amountLabel}
        onSubmit={() => form.setStep("obrigado")}
      />

      <SecureNote />
    </motion.div>
  );
}
