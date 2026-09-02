"use client";

import { Hash, MapPin } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Field } from "@/components/ui/field";
import { FieldSpinner } from "@/components/ui/field-spinner";
import { MaskedField } from "@/components/ui/masked-field";
import { SectionLabel } from "@/components/ui/section-label";
import { POSTAL_CODE_MASK } from "./constants";
import type { Address } from "./types";

interface AddressSectionProps {
  address: Address;
  onAddressChange: (address: Address) => void;
  postalCode: string;
  onPostalCodeChange: (value: string) => void;
  isLookingUp: boolean;
}

export function AddressSection({
  address,
  onAddressChange,
  postalCode,
  onPostalCodeChange,
  isLookingUp,
}: AddressSectionProps) {
  const setField = (field: keyof Address) => (value: string) =>
    onAddressChange({ ...address, [field]: value });

  return (
    <>
      <SectionLabel>ENDEREÇO</SectionLabel>
      <div className="flex">
        <div className="w-full sm:w-1/3 sm:pr-1.5">
          <MaskedField
            icon={MapPin}
            placeholder="CEP"
            inputMode="numeric"
            autoComplete="postal-code"
            mask={POSTAL_CODE_MASK}
            value={postalCode}
            onAccept={onPostalCodeChange}
            required
            trailing={
              <AnimatePresence>
                {isLookingUp && <FieldSpinner key="spinner" />}
              </AnimatePresence>
            }
          />
        </div>
      </div>

      <div className="mt-3 flex">
        <Field
          icon={MapPin}
          placeholder="Rua"
          inputMode="text"
          autoComplete="address-line1"
          autoCapitalize="words"
          value={address.rua}
          onChange={setField("rua")}
        />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Field
          icon={MapPin}
          placeholder="Bairro"
          inputMode="text"
          autoComplete="address-level3"
          autoCapitalize="words"
          value={address.bairro}
          onChange={setField("bairro")}
        />
        <Field
          icon={MapPin}
          placeholder="Cidade"
          inputMode="text"
          autoComplete="address-level2"
          autoCapitalize="words"
          value={address.cidade}
          onChange={setField("cidade")}
        />
      </div>

      <div className="mt-3 flex">
        <Field
          icon={MapPin}
          placeholder="Estado"
          maxLength={2}
          inputMode="text"
          autoComplete="address-level1"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={address.estado}
          onChange={(value) =>
            onAddressChange({ ...address, estado: value.toUpperCase() })
          }
        />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Field
          icon={Hash}
          placeholder="Número"
          inputMode="numeric"
          autoComplete="address-line3"
          autoCorrect="off"
          spellCheck={false}
          value={address.numero}
          onChange={setField("numero")}
          required
        />
        <Field
          icon={MapPin}
          placeholder="Complemento"
          inputMode="text"
          autoComplete="address-line2"
          enterKeyHint="done"
          value={address.complemento}
          onChange={setField("complemento")}
        />
      </div>
    </>
  );
}
