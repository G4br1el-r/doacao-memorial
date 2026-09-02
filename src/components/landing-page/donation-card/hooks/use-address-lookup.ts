"use client";

import { useState } from "react";
import { POSTAL_CODE_LENGTH, POSTAL_CODE_URL } from "../constants";
import type { Address } from "../types";

type AddressUpdater = (update: (current: Address) => Address) => void;

type LookupResult = {
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

export function useAddressLookup(setAddress: AddressUpdater) {
  const [postalCode, setPostalCode] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  async function onPostalCodeChange(formatted: string) {
    setPostalCode(formatted);

    const digits = formatted.replace(/\D/g, "");
    if (digits.length !== POSTAL_CODE_LENGTH) return;

    setIsLookingUp(true);
    try {
      const response = await fetch(`${POSTAL_CODE_URL}/${digits}`);
      if (!response.ok) return;

      const data = (await response.json()) as LookupResult;
      setAddress((current) => ({
        ...current,
        rua: data.rua ?? "",
        bairro: data.bairro ?? "",
        cidade: data.cidade ?? "",
        estado: data.estado ?? "",
      }));
    } catch {
    } finally {
      setIsLookingUp(false);
    }
  }

  return { postalCode, setPostalCode, isLookingUp, onPostalCodeChange };
}
