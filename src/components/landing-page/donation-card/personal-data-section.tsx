"use client";

import { IdCard, Mail, Phone, User } from "lucide-react";
import { Field } from "@/components/ui/field";
import { MaskedField } from "@/components/ui/masked-field";
import { SectionLabel } from "@/components/ui/section-label";
import { BirthDateField } from "./birth-date-field";
import { DOCUMENT_MASK, PHONE_MASK } from "./constants";

interface PersonalDataSectionProps {
  name: string;
  onNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  document: string;
  onDocumentChange: (value: string) => void;
}

export function PersonalDataSection({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  document,
  onDocumentChange,
}: PersonalDataSectionProps) {
  return (
    <>
      <SectionLabel>SEUS DADOS</SectionLabel>
      <div className="flex">
        <Field
          icon={User}
          placeholder="Nome completo"
          autoComplete="name"
          value={name}
          onChange={onNameChange}
          required
        />
      </div>

      <div className="mt-3 flex">
        <Field
          icon={Mail}
          placeholder="E-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
      </div>

      <div className="mt-3 flex gap-3">
        <MaskedField
          icon={Phone}
          placeholder="Celular com DDD"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          mask={PHONE_MASK}
          value={phone}
          onAccept={onPhoneChange}
          required
        />
        <MaskedField
          icon={IdCard}
          placeholder="CPF/CNPJ"
          inputMode="numeric"
          mask={DOCUMENT_MASK}
          value={document}
          onAccept={onDocumentChange}
          required
        />
      </div>

      <div className="mt-3 flex w-1/2 gap-3 pr-1.5">
        <BirthDateField />
      </div>
    </>
  );
}
