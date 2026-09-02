export type RitualPhase =
  | "fechado"
  | "escurecendo"
  | "convite"
  | "acendendo"
  | "livre";

export type Inscription = {
  text: string;
  x: number;
  y: number;
  depth: number;
  size: string;
};
