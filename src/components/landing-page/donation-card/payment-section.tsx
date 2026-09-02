"use client";

import { Collapse } from "@/components/animation/collapse";
import { OptionButton } from "@/components/ui/option-button";
import { SectionLabel } from "@/components/ui/section-label";
import { PAYMENT_METHODS } from "./constants";
import { DueDateField } from "./due-date-field";
import type { PaymentMethodId } from "./types";

interface PaymentSectionProps {
  payment: PaymentMethodId;
  onPaymentChange: (id: PaymentMethodId) => void;
}

export function PaymentSection({
  payment,
  onPaymentChange,
}: PaymentSectionProps) {
  const showsDueDate = payment === "boleto" || payment === "carne";

  return (
    <>
      <SectionLabel>FORMA DE DOAÇÃO</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <OptionButton
              key={method.id}
              active={payment === method.id}
              onClick={() => onPaymentChange(method.id)}
              className="flex items-center gap-2 px-3 py-2.5"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {method.label}
            </OptionButton>
          );
        })}
      </div>

      <Collapse open={showsDueDate} className="overflow-hidden">
        <DueDateField />
      </Collapse>
    </>
  );
}
