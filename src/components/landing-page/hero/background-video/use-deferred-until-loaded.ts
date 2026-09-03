"use client";

import { useEffect, useState } from "react";

export function useDeferredUntilLoaded() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;

    const release = () => {
      const schedule =
        window.requestIdleCallback ??
        ((cb: IdleRequestCallback) =>
          window.setTimeout(() => cb({} as IdleDeadline), 200));
      idle = schedule(() => setReady(true), { timeout: 3000 });
    };

    if (document.readyState === "complete") {
      release();
      return () => {
        window.cancelIdleCallback?.(idle);
      };
    }

    window.addEventListener("load", release, { once: true });
    return () => {
      window.removeEventListener("load", release);
      window.cancelIdleCallback?.(idle);
    };
  }, []);

  return ready;
}
