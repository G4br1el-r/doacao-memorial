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
  /* no mobile a tela e estreita e alta: as palavras precisam de outra
     distribuicao pra nao se cortarem nem se empilharem */
  mobileX: number;
  mobileY: number;
  depth: number;
  size: string;
};
