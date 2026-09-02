export type PaymentMethodId =
  | "pix-auto"
  | "pix"
  | "credito"
  | "boleto"
  | "carne";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  icon: React.ElementType;
  recurring?: boolean;
};

export type Frequency = "mensal" | "unica";

export type FrequencyOption = {
  id: Frequency;
  label: string;
  note: string;
};

export type Amount = number | "outro";

export type Address = {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type Step = "formulario" | "obrigado";
