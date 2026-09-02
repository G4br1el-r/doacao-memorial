"use client";

import { Hash, MapPin } from "lucide-react";
import { Field } from "@/components/ui/field";
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
        <div className="w-1/3 pr-1.5">
          <MaskedField
            icon={MapPin}
            placeholder={isLookingUp ? "Buscando…" : "CEP"}
            inputMode="numeric"
            autoComplete="postal-code"
            mask={POSTAL_CODE_MASK}
            value={postalCode}
            onAccept={onPostalCodeChange}
            required
          />
        </div>
      </div>

      <div className="mt-3 flex">
        <Field
          icon={MapPin}
          placeholder="Rua"
          autoComplete="address-line1"
          value={address.rua}
          onChange={setField("rua")}
        />
      </div>

      <div className="mt-3 flex gap-3">
        <Field
          icon={MapPin}
          placeholder="Bairro"
          value={address.bairro}
          onChange={setField("bairro")}
        />
        <Field
          icon={MapPin}
          placeholder="Cidade"
          autoComplete="address-level2"
          value={address.cidade}
          onChange={setField("cidade")}
        />
      </div>

      <div className="mt-3 flex">
        <Field
          icon={MapPin}
          placeholder="Estado"
          maxLength={2}
          autoComplete="address-level1"
          value={address.estado}
          onChange={(value) =>
            onAddressChange({ ...address, estado: value.toUpperCase() })
          }
        />
      </div>

      <div className="mt-3 flex gap-3">
        <Field
          icon={Hash}
          placeholder="Número"
          inputMode="numeric"
          value={address.numero}
          onChange={setField("numero")}
          required
        />
        <Field
          icon={MapPin}
          placeholder="Complemento"
          autoComplete="address-line2"
          value={address.complemento}
          onChange={setField("complemento")}
        />
      </div>
    </>
  );
}
