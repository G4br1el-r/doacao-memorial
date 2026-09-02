"use client";

import { AnimatedLetter } from "./animated-letter";
import { LETTER_STAGGER } from "./constants";

interface AnimatedTitleLineProps {
  text: string;
  baseDelay: number;
}

export function AnimatedTitleLine({ text, baseDelay }: AnimatedTitleLineProps) {
  return (
    <span className="inline-block">
      {text.split("").map((letter, index) => (
        <AnimatedLetter
          // biome-ignore lint/suspicious/noArrayIndexKey: texto estatico, a lista nunca reordena
          key={`${text}-${letter}-${index}`}
          letter={letter}
          delay={baseDelay + index * LETTER_STAGGER}
        />
      ))}
    </span>
  );
}
