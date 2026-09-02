export function onlyDigits(text: string) {
  return text
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "")
    .slice(0, 11);
}

export function formatCents(digits: string) {
  if (!digits) return "";
  const padded = digits.padStart(3, "0");
  const units = Number(padded.slice(0, -2));
  return `${units.toLocaleString("pt-BR")},${padded.slice(-2)}`;
}

export function formatCurrencyLabel(amount: string) {
  if (!amount) return "";
  return `R$ ${Number(amount).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
