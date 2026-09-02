"use client";

import { useEffect, useState } from "react";
import { MS_PROCESSING, MS_UNTIL_CONTENT } from "./constants";
import type { ThankYouState } from "./types";

export function useThankYouState(
  alreadyConfirmed: boolean | undefined,
  onConfirmed: (() => void) | undefined,
) {
  const [state, setState] = useState<ThankYouState>(
    alreadyConfirmed ? "pronto" : "processando",
  );

  useEffect(() => {
    if (alreadyConfirmed) return;

    const confirmTimer = setTimeout(
      () => setState("confirmado"),
      MS_PROCESSING,
    );
    const releaseTimer = setTimeout(() => {
      setState("pronto");
      onConfirmed?.();
    }, MS_PROCESSING + MS_UNTIL_CONTENT);

    return () => {
      clearTimeout(confirmTimer);
      clearTimeout(releaseTimer);
    };
  }, [alreadyConfirmed, onConfirmed]);

  return state;
}
