"use client";

import { useState } from "react";
import { POSTAL_CODE_LENGTH, VIACEP_URL } from "../constants";
import type { Address } from "../types";

type AddressUpdater = (update: (current: Address) => Address) => void;

export function useAddressLookup(setAddress: AddressUpdater) {
  const [postalCode, setPostalCode] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  async function onPostalCodeChange(formatted: string) {
    setPostalCode(formatted);

    const digits = formatted.replace(/\D/g, "");
    if (digits.length !== POSTAL_CODE_LENGTH) return;

    setIsLookingUp(true);
    try {
      const response = await fetch(`${VIACEP_URL}/${digits}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress((current) => ({
          ...current,
          rua: data.logradouro ?? "",
          bairro: data.bairro ?? "",
          cidade: data.localidade ?? "",
          estado: data.uf ?? "",
        }));
      }
    } catch {
    } finally {
      setIsLookingUp(false);
    }
  }

  return { postalCode, setPostalCode, isLookingUp, onPostalCodeChange };
}
