import { DAYS_LIT } from "./constants";

const MS_PER_DAY = 86400000;

export function candleEndDate() {
  return new Date(Date.now() + DAYS_LIT * MS_PER_DAY).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "long" },
  );
}
