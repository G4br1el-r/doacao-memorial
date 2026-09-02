import { Barcode, CreditCard, FileText, QrCode } from "lucide-react";
import type { Address, FrequencyOption, PaymentMethod } from "./types";

export const AMOUNTS = [200, 100, 75, 50, 25];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pix-auto", label: "PIX automático", icon: QrCode, recurring: true },
  { id: "pix", label: "PIX", icon: QrCode },
  { id: "credito", label: "Crédito", icon: CreditCard, recurring: true },
  { id: "boleto", label: "Boleto", icon: Barcode },
  { id: "carne", label: "Carnê digital", icon: FileText, recurring: true },
];

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { id: "mensal", label: "Mensal", note: "Todo mês" },
  { id: "unica", label: "Único", note: "Uma única vez" },
];

export const RECURRING_BLOCKED_NOTE = "Escolha PIX auto ou carnê";

export const EMPTY_ADDRESS: Address = {
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
};

export const DOCUMENT_MASK = [
  { mask: "000.000.000-00", maxLength: 11 },
  { mask: "00.000.000/0000-00" },
];

export const PHONE_MASK = "(00) 00000-0000";
export const POSTAL_CODE_MASK = "00000-000";

export const VIACEP_URL = "https://viacep.com.br/ws";
export const POSTAL_CODE_LENGTH = 8;
