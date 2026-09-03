"use client";

import { useCallback, useMemo, useState } from "react";
import { INSCRIPTIONS } from "../constants";

export function useDiscovery() {
  const [found, setFound] = useState<ReadonlySet<string>>(new Set());

  const discover = useCallback((text: string) => {
    setFound((current) => {
      if (current.has(text)) return current;
      const next = new Set(current);
      next.add(text);
      return next;
    });
  }, []);

  const complete = found.size === INSCRIPTIONS.length;

  return useMemo(
    () => ({ discover, complete, foundCount: found.size }),
    [discover, complete, found.size],
  );
}
