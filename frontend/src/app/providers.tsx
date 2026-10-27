"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  /** Avoid SSR/client mismatch from `prefers-reduced-motion`. */
  const [reducedMotion, setReducedMotion] = useState<"never" | "user">("never");

  useEffect(() => {
    setReducedMotion("user");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </QueryClientProvider>
  );
}
