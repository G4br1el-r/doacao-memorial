import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** junta classes condicionais resolvendo conflitos do tailwind */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
