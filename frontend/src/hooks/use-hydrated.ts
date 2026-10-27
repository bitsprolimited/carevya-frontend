"use client";

import { useEffect, useState } from "react";

/** True only after mount — use to avoid SSR/client markup mismatches. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
