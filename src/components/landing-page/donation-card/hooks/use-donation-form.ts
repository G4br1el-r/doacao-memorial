"use client";

import { useState } from "react";
import { AMOUNTS, EMPTY_ADDRESS, PAYMENT_METHODS } from "../constants";
import type {
  Address,
  Amount,
  Frequency,
  PaymentMethodId,
  Step,
} from "../types";
import { formatCurrencyLabel } from "../utils/amount";
import { useAddressLookup } from "./use-address-lookup";

export function useDonationForm() {
  const [amount, setAmount] = useState<Amount>(AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("mensal");
  const [payment, setPayment] = useState<PaymentMethodId>("pix-auto");
  const [accepted, setAccepted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);

  const [ritualOpen, setRitualOpen] = useState(false);
  const [step, setStep] = useState<Step>("formulario");
  const [donationConfirmed, setDonationConfirmed] = useState(false);

  const addressLookup = useAddressLookup(setAddress);

  function reset() {
    setAmount(AMOUNTS[0]);
    setCustomAmount("");
    setFrequency("mensal");
    setPayment("pix-auto");
    setAccepted(false);
    setName("");
    setPhone("");
    setDocument("");
    addressLookup.setPostalCode("");
    setAddress(EMPTY_ADDRESS);
    setDonationConfirmed(false);
    setStep("formulario");
  }

  function selectPayment(id: PaymentMethodId) {
    setPayment(id);
    const method = PAYMENT_METHODS.find((item) => item.id === id);
    if (!method?.recurring) setFrequency("unica");
  }

  const currentMethod = PAYMENT_METHODS.find((item) => item.id === payment);
  const allowsRecurring = Boolean(currentMethod?.recurring);

  const finalAmount =
    amount === "outro"
      ? customAmount
        ? String(Number(customAmount) / 100)
        : ""
      : String(amount);
  const amountLabel = formatCurrencyLabel(finalAmount);

  return {
    amount,
    setAmount,
    customAmount,
    setCustomAmount,
    frequency,
    setFrequency,
    payment,
    selectPayment,
    accepted,
    setAccepted,
    name,
    setName,
    phone,
    setPhone,
    document,
    setDocument,
    address,
    setAddress,
    ...addressLookup,
    ritualOpen,
    setRitualOpen,
    step,
    setStep,
    donationConfirmed,
    setDonationConfirmed,
    allowsRecurring,
    amountLabel,
    reset,
  };
}
